#!/usr/bin/env bash
# Checks a running release stack (compose.release.yaml, WITHOUT compose.e2e.yaml) for the properties
# that only show up when the real images run behind the real proxy:
#
#   - the web container serves the app with its security headers and keeps operations endpoints out
#   - the backend is ready and live on its host-only port
#   - the API answers through the proxy with the documented error contract
#   - a client cannot choose its own address by sending X-Forwarded-For: the proxy overwrites it, so
#     the per-address registration limit still applies
#
# Usage: deploy/verify-release.sh [web-url] [backend-url]
set -u

WEB="${1:-http://localhost:8081}"
BACKEND="${2:-http://localhost:8080}"
failures=0

check() { # description, command...
  local description="$1"
  shift
  if "$@" > /dev/null 2>&1; then
    echo "ok    $description"
  else
    echo "FAIL  $description"
    failures=$((failures + 1))
  fi
}

header_has() { # url, header-regex
  curl -s -D - -o /dev/null "$1" | tr -d '\r' | grep -iqE "$2"
}

status_is() { # url, expected
  [ "$(curl -s -o /dev/null -w '%{http_code}' "$1")" = "$2" ]
}

echo "Release checks against $WEB (backend $BACKEND)"

check "the app is served" status_is "$WEB/" 200
check "client-side routes fall back to the app" status_is "$WEB/editorial" 200
check "Content-Security-Policy is set and forbids framing" header_has "$WEB/" "^content-security-policy:.*frame-ancestors 'none'"
check "script and style are limited to the app's own origin" header_has "$WEB/" "^content-security-policy:.*script-src 'self'; style-src 'self'"
check "X-Content-Type-Options is nosniff" header_has "$WEB/" "^x-content-type-options: nosniff"
check "the server does not announce its version" bash -c "! curl -s -D - -o /dev/null '$WEB/' | tr -d '\r' | grep -iE '^server: .*[0-9]'"
check "built assets are cached for a long time" bash -c "
  asset=\$(curl -s '$WEB/' | grep -oE '/assets/[^\"]+\.js' | head -1)
  curl -s -D - -o /dev/null \"$WEB\$asset\" | tr -d '\r' | grep -iqE '^cache-control:.*max-age=[0-9]{7,}'"
check "the page itself is not cached" header_has "$WEB/" "^cache-control:.*no-cache"
check "operations endpoints are not reachable through the proxy" status_is "$WEB/actuator/health" 404
check "the backend is live" status_is "$BACKEND/actuator/health/liveness" 200
check "the backend is ready (database reachable, migrations applied)" status_is "$BACKEND/actuator/health/readiness" 200
check "the API answers through the proxy" status_is "$WEB/api/auth/csrf" 200
check "an anonymous request gets a problem response with a request id" bash -c "
  curl -s -D - '$WEB/api/auth/me' | tr -d '\r' > /tmp/verify-me.txt
  head -1 /tmp/verify-me.txt | grep -q ' 401' &&
  grep -qi '^content-type: application/problem+json' /tmp/verify-me.txt &&
  grep -q '\"requestId\"' /tmp/verify-me.txt"

# Registration is limited per client address (10 by default). If the proxy let a client pick its own
# X-Forwarded-For, sending a different one each time would never reach the limit.
jar="$(mktemp)"
curl -s -c "$jar" "$WEB/api/auth/csrf" > /dev/null
token="$(grep XSRF-TOKEN "$jar" | awk '{print $7}')"
created=0
refused=0
for i in $(seq 1 14); do
  code="$(curl -s -o /dev/null -w '%{http_code}' -b "$jar" -X POST "$WEB/api/auth/register" \
    -H "X-XSRF-TOKEN: $token" -H "Content-Type: application/json" \
    -H "X-Forwarded-For: 203.0.113.$i" \
    -d "{\"email\":\"verify-$RANDOM-$i@example.com\",\"password\":\"a long verification password\"}")"
  [ "$code" = "201" ] && created=$((created + 1))
  [ "$code" = "429" ] && refused=$((refused + 1))
done
rm -f "$jar"
if [ "$created" -eq 10 ] && [ "$refused" -eq 4 ]; then
  echo "ok    a forged X-Forwarded-For does not get around the per-address limit (10 accepted, 4 refused)"
else
  echo "FAIL  a forged X-Forwarded-For does not get around the per-address limit ($created accepted, $refused refused; expected 10 and 4)"
  failures=$((failures + 1))
fi

if [ "$failures" -gt 0 ]; then
  echo "$failures check(s) failed"
  exit 1
fi
echo "All release checks passed"

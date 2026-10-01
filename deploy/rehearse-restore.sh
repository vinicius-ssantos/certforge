#!/usr/bin/env bash
# Rehearses recovery: takes a backup of the running release database, restores it into a brand new
# PostgreSQL, and checks that what came back is what went in. A backup nobody has restored is a hope.
#
# It compares, table by table, the number of rows and a checksum of the contents, plus the schema
# migration history. Run it against a stack that has seen some traffic.
#
# Usage: deploy/rehearse-restore.sh [compose-args...]
#   e.g. deploy/rehearse-restore.sh -p certforge-release -f compose.release.yaml
# DB_PASSWORD must be set, as for the stack itself.
set -euo pipefail

COMPOSE=(docker compose "$@")
RESTORE=certforge-restore-rehearsal
DUMP="$(mktemp)"
trap 'rm -f "$DUMP"; docker rm -f "$RESTORE" > /dev/null 2>&1 || true' EXIT

# stdin is closed: used inside a `while read` loop, exec would otherwise swallow the rest of the list.
src() { "${COMPOSE[@]}" exec -T postgres psql -U certforge -d certforge -At -c "$1" < /dev/null; }
dst() { docker exec "$RESTORE" psql -U certforge -d certforge -At -c "$1"; }

echo "1. Backup (custom format, the whole database)"
"${COMPOSE[@]}" exec -T postgres pg_dump -U certforge -d certforge -Fc > "$DUMP"
echo "   $(wc -c < "$DUMP") bytes"

echo "2. Restore into a new, empty PostgreSQL"
docker rm -f "$RESTORE" > /dev/null 2>&1 || true
docker run -d --name "$RESTORE" -e POSTGRES_DB=certforge -e POSTGRES_USER=certforge \
  -e POSTGRES_PASSWORD=restore-rehearsal postgres:18.6-alpine > /dev/null
for _ in $(seq 1 60); do
  # Over TCP: on first start the image runs a temporary server that listens on the socket only.
  docker exec "$RESTORE" pg_isready -h 127.0.0.1 -U certforge -d certforge > /dev/null 2>&1 && break
  sleep 1
done
docker exec -i "$RESTORE" pg_restore -U certforge -d certforge --no-owner --exit-on-error < "$DUMP"

echo "3. Compare"
failures=0
tables="$(src "select table_schema || '.' || table_name from information_schema.tables where table_schema in ('certforge','public') and table_type = 'BASE TABLE' order by 1")"
checked=0
while IFS= read -r table; do
  [ -z "$table" ] && continue
  # A checksum of every row's text form, in a stable order: equal counts alone would miss changed data.
  query="select count(*) || ' ' || coalesce(md5(string_agg(t::text, '|' order by t::text)), '-') from $table t"
  a="$(src "$query")"
  b="$(dst "$query")"
  checked=$((checked + 1))
  if [ "$a" = "$b" ]; then
    echo "   ok    $table (${a%% *} rows)"
  else
    echo "   FAIL  $table: before '$a', after '$b'"
    failures=$((failures + 1))
  fi
done <<< "$tables"

latest_src="$(src "select max(version::int) from public.flyway_schema_history where success")"
latest_dst="$(dst "select max(version::int) from public.flyway_schema_history where success")"
if [ "$latest_src" = "$latest_dst" ] && [ -n "$latest_src" ]; then
  echo "   ok    schema migration history (latest applied version $latest_src)"
else
  echo "   FAIL  schema migration history: before '$latest_src', after '$latest_dst'"
  failures=$((failures + 1))
fi

if [ "$checked" -lt 10 ]; then
  echo "   FAIL  only $checked tables were compared; expected the whole schema"
  failures=$((failures + 1))
fi

if [ "$failures" -gt 0 ]; then
  echo "$failures difference(s): the restore is NOT equivalent to the original"
  exit 1
fi
echo "Restore rehearsal passed: $checked tables restored with identical contents"

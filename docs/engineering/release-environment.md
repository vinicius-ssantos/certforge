# Release environment

How CertForge runs as images behind a proxy, what that setup guarantees, and how CI proves it. For development use [backend bootstrap](backend-bootstrap.md) and the dev servers; this is the shape a deployment takes.

## What runs

| Container | Image | Role |
|---|---|---|
| `postgres` | `postgres:18.6-alpine` | The only store. Its volume is the data to back up. |
| `app` | built from `Dockerfile` | The backend. Runs as an unprivileged user, reachable from the host on `127.0.0.1:8080` only, for health checks and operations. |
| `web` | built from `web/Dockerfile` | nginx serving the built web app and proxying `/api` to `app`. This is the only container meant to be reached by users. |

```sh
DB_PASSWORD=... BOOTSTRAP_ADMIN_EMAIL=... BOOTSTRAP_ADMIN_PASSWORD=... \
  docker compose -f compose.release.yaml up --build
# the app is then at http://localhost:8081 (change with WEB_PORT)
```

`DB_PASSWORD` has no default, so a missing secret stops the start instead of running with a known one. The bootstrap administrator is created only when no administrator exists; set both variables for the first start, then remove them.

## What the web container guarantees

- **One origin.** The browser talks to `web` for both the app and the API, so the session cookie never crosses origins.
- **Strict Content Security Policy.** Scripts, styles, fonts, images and connections only from the app's own origin; no framing; no objects. The build never inlines assets as `data:` URIs, because the policy would block them.
- **Security headers**: `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY`, a minimal `Permissions-Policy`, and no server version.
- **Operations endpoints stay inside.** `/actuator/` answers 404 through the proxy. Health is reachable on the backend's host-only port.
- **Caching.** Built assets are content-hashed and cached for a year; the page itself is never cached.
- **Client addresses are not spoofable.** The backend limits sign-in and registration per client address. Behind a proxy it must read that address from `X-Forwarded-For` (`SERVER_FORWARD_HEADERS_STRATEGY=framework`), and nginx therefore **overwrites** that header with the address it saw and never appends to the client's. Without this every user would share the proxy's bucket; with an appending proxy a client could pick its own address and never be limited.

## TLS

The images speak plain HTTP. In a real deployment terminate TLS in front of `web` (a load balancer or a TLS proxy) and then:

- set `SESSION_COOKIE_SECURE=true` so the session cookie is only sent over HTTPS;
- add `Strict-Transport-Security` at the TLS terminator;
- keep forwarding `X-Forwarded-Proto: https`; `web` passes it through.

Leave `SESSION_COOKIE_SECURE` unset only to try the stack on plain `http://localhost`.

## How CI proves it

The `release` job builds these images and then:

1. **Scans both images** with Trivy for fixable high and critical vulnerabilities and fails on any. A new advisory can fail an unrelated change; the fix is almost always a version bump (the first run of this scan found a critical Tomcat advisory and high Jackson ones, fixed by overriding the managed versions in `pom.xml`, and outdated operating-system packages, fixed by upgrading them in the Dockerfiles).
2. Starts the stack with the release settings and runs `deploy/verify-release.sh`: security headers, hidden operations endpoints, backend liveness and readiness, the error contract through the proxy, and that a forged `X-Forwarded-For` does not get around the per-address registration limit.
3. Restarts on a fresh database with `compose.e2e.yaml`, which relaxes only reviewer separation and the registration throttle, and runs the whole Playwright suite against the release images, so the real proxy, headers and Content Security Policy are exercised. The suite fails any page that triggers a Content Security Policy violation.

`compose.e2e.yaml` is for that purpose only.

## Run the same checks yourself

```sh
export DB_PASSWORD=local-test BOOTSTRAP_ADMIN_EMAIL=admin@example.com BOOTSTRAP_ADMIN_PASSWORD='a long local password'
docker compose -f compose.release.yaml up --build -d
bash deploy/verify-release.sh
```

## Known limits

- No TLS, backups or log shipping are included; see the operations guide for what to do about each.
- Rate limiting is in memory per backend instance (ADR 0008). Run one backend instance until it has a shared store.
- The vulnerability scan covers operating-system and Java/library packages in the images, not the application's own logic. It is not a substitute for the threat model.

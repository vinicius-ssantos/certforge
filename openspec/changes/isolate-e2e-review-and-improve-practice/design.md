## Environment
`certforge-release` remains on :8081 and keeps its volume. New `certforge-review` uses web :8082 / host-bound API :8085 and a different project-scoped database volume. New `certforge-e2e` uses web :8083 / API :8086 and its own volume. `APP_PORT` only controls backend host mapping, not container networking. Review never seeds fake content. Tests require `CERTFORGE_E2E_DISPOSABLE=1` on local runs; CI is a disposable environment.

## UX
Keep native details/summary and expose its interactive arrow. Resolve session track and nested topic from the already-cached catalogues, with accessible links. Show resumed notice briefly and dismiss after a successful answer; the mock notice expires. Do not translate or rewrite reviewed question text automatically.

## Review & rollback
Validate mobile, keyboard and CI. The existing :8081 database is never reset. Rollback reverts code and stops the separate review stack without touching old volumes; human acceptance remains required under #428.

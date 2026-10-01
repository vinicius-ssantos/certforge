# Operations

Issue: #12 — Add auditability, observability, readiness, and safe error contracts. This document explains how to see what the application is doing and how to react when something is wrong. Bootstrap and local setup are in [backend bootstrap](backend-bootstrap.md).

## What telemetry may contain

Telemetry (logs, metrics, observations and, later, traces) never contains credentials, session or idempotency keys, email addresses, submitted answers, answer keys, explanations, or unpublished content. Identifiers of accounts and sessions are kept out of it too: HTTP telemetry uses the templated path (`/api/admin/accounts/{id}/roles`), never the concrete one. Tests enforce this across logs, metrics, observations and error bodies (`OperabilityIT`).

The one identifier that is deliberately everywhere is the **request id**, which is random and carries no information.

## Correlating a request

Every request gets an id before anything else runs:

- A client may send `X-Request-Id`. It is kept only if it is 8 to 64 letters, digits, dots, underscores or hyphens; anything else is replaced by a random id, so an id can never inject into a log line.
- The id is returned in the `X-Request-Id` response header, and appears in every log line of the request (`[<id>] ` after the level) and in every error body as `requestId`. It is never placed in a URL.
- Audit records store it too, so an audited action can be tied to its log lines.

To investigate a failure, ask the user for the `requestId` in the error body (or read the header), then search the logs for it.

Logs are plain text by default. Set `LOGGING_STRUCTURED_FORMAT_CONSOLE=logstash` (or `ecs`) for JSON logs, in which the id is a field.

## Error contract

Every error is an RFC 9457 problem (`application/problem+json`) produced in one place:

```json
{"type":"about:blank","title":"Not Found","status":404,"code":"session_not_found","requestId":"…"}
```

- `code` is stable and machine-readable; the per-feature codes are listed in the architecture documents.
- Validation failures use `validation_failed` with a `fields` list of names only, and framework errors (malformed JSON, wrong method, unknown path) use `invalid_request`.
- Any unexpected failure returns `500` with `internal_error` and the generic title `Unexpected error`. The body has no stack trace, exception class or message; the full details go to the log under the same `requestId`.
- Authentication and authorization failures (`unauthenticated`, `forbidden`, `csrf_invalid`) follow the same shape.

## Audit trail

Approval, publication, replacement and deprecation of a question revision are recorded in `audit_event`: the actor, the action, the subject (`question-revision:<id>`), the time, and the request id. Records are written in the same transaction as the action, so the action and its record commit or roll back together: if the record cannot be written, the action fails. The table is append-only for every writer, including direct SQL.

Read it with `GET /api/admin/audit` (permission `AUDIT_READ`, held by administrators). Filters: `subject`, `actorId`, `action`. Pages are newest first with a `cursor` and `size` (1 to 50).

Audit records are evidence and are kept indefinitely.

## Health

| Endpoint | Meaning | Checks |
|---|---|---|
| `/actuator/health/liveness` | The process is alive. A failure means restart it | The process only. It never looks at the database |
| `/actuator/health/readiness` | The instance can do useful work. A failure means stop sending it traffic | The readiness state, the database, and the Flyway migrations |
| `/actuator/health` | Overall status | Both |

The readiness group reports `db` and `flywayMigrations`. `flywayMigrations` is `DOWN` when a migration has failed or is still pending. Health is public but shows only names and status, never details.

The split matters: a database outage or a failed migration makes an instance **unready**, which stops traffic, but does not make it **dead**, so an orchestrator does not restart healthy processes in a loop.

## Metrics

`GET /actuator/metrics` (and `/actuator/metrics/<name>`) requires the `OPERATIONS_VIEW` permission, held by administrators. Only `health`, `info` and `metrics` are exposed; every other management endpoint does not exist.

| Metric | Labels | Counts |
|---|---|---|
| `certforge.auth.failures` | `reason`: `invalid_credentials`, `throttled` | Failed logins and throttled attempts |
| `certforge.sessions.created` | none | Study sessions started |
| `certforge.attempts.submitted` | `outcome`: `correct`, `incorrect` | Accepted answers |
| `certforge.attempts.replayed` | none | Idempotent replays of an accepted answer |
| `certforge.editorial.transitions` | `action`: `created`, `revision_started`, `submitted`, `approved`, `changes_requested`, `published`, `replaced`, `deprecated` | Accepted editorial transitions |
| `certforge.domain.failures` | `code`: a stable problem code | Rejected requests by reason |
| `certforge.unexpected.failures` | none | Unexpected server failures (`internal_error`) |
| `certforge.session.start`, `certforge.attempt.submit`, `certforge.editorial.publish` | `error` | Timers of the critical operations |
| `http.server.requests` | templated `uri`, method, status, outcome | Standard HTTP timers |

Labels come from fixed sets, never from user input, and a filter caps the number of distinct values of each label as a safety net. The standard JVM, database pool and HTTP metrics are available as well.

The critical operations are also Micrometer observations: they become timers today and will become trace spans when a tracing bridge is added. Exporting traces is not part of `v0.1.0`; it needs a tracing bridge and an exporter, and the observations carry no identifiers so they can be exported safely.

## Logging and retention

Logs go to the console. When file logging is enabled (`logging.file.name`), files roll and are kept for a bounded time: 14 days, 50 MB per file, 1 GB in total. Change these under `logging.logback.rollingpolicy`. Ship console logs to the platform's log store and apply its retention; 30 days is a sensible ceiling for operational logs. Sessions are removed by the session store when they expire.

## Incident triage

Start from the signal, then the request id.

| Signal | Likely cause | What to do |
|---|---|---|
| Readiness is `DOWN`, `flywayMigrations` `DOWN`, liveness `UP` | A migration failed or is pending | Read the log of the startup; fix the cause and repair the failed row in `flyway_schema_history`, then restart. Do not edit applied migrations |
| Readiness is `DOWN`, `db` `DOWN` | The database is unreachable or saturated | Check the database and its connectivity and credentials. The application recovers on its own once the database is back |
| `certforge.unexpected.failures` rising, responses `internal_error` | A bug or a dependency failure | Take a `requestId` from an affected response, find its log line for the stack trace |
| `certforge.auth.failures{reason=throttled}` rising | Brute force, or users behind one address sharing the limit | Check source addresses. Behind a reverse proxy, configure trusted forwarded headers, otherwise everyone shares the proxy's address. Limits are per instance and in memory |
| `certforge.domain.failures{code=idempotency_key_reused}` or `concurrent_submission` | A client reusing keys wrongly or retrying in parallel | Check the client. Keys must be unique per answer and reused only for retries of the same request |
| `certforge.domain.failures{code=insufficient_content}` | A topic has too few published questions | Publish more content for the topic, or lower the requested count |
| `certforge.domain.failures{code=topic_not_active}` or `java_release_mismatch` when publishing | The topic or exam version is not active or targets another release | Fix the catalog state, then publish again |
| A learner's progress looks wrong | The projection drifted from the attempts | `GET /api/progress/reconciliation` shows the difference, `POST /api/progress/rebuild` repairs it. Attempts are the evidence and are never changed |
| A question was published or withdrawn unexpectedly | An editorial action | `GET /api/admin/audit?subject=question-revision:<id>` shows who did it, when, and the request id |
| A user cannot sign in after a role change | Changing roles deliberately ends the account's sessions | Ask them to sign in again |

### Recovering a failed migration

Health shows the failure but does not change the database. Identify the failed migration from the startup log and from `flyway_schema_history`, correct the underlying problem (data or permissions), then mark or remove the failed row as Flyway's repair procedure describes and restart. Migrations that have been applied are never edited, because Flyway checksums them; corrections go in a new migration.

## Deferred

External SIEM integration, a long-term analytics warehouse, a distributed tracing pipeline, runner-specific telemetry, and audit records for account and catalog changes (the audit module depends on identity, so those need a neutral fact type first).

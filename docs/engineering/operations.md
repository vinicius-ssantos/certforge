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
- Validation failures use `validation_failed` with a `fields` list of names only, and framework errors keep to the same body with a code for the kind of failure: `invalid_request` (malformed JSON and the like), `not_found` (unknown path), `method_not_allowed`, `unsupported_media_type` and `not_acceptable`. None of them carries text from the framework.
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

## Backup and restore

All state is in PostgreSQL: accounts, sessions, content, attempts, history and the audit trail. The backend and web containers hold nothing, so the database is the only thing to back up.

```sh
# Back up the whole database (custom format, restorable selectively and in parallel)
docker compose -f compose.release.yaml exec -T postgres pg_dump -U certforge -d certforge -Fc > certforge-$(date +%F).dump

# Restore into a new, empty database
pg_restore -U certforge -d certforge --no-owner --exit-on-error certforge-2026-10-01.dump
```

- Back up before every upgrade, and before anything that rewrites data by hand.
- **After a restore, end every session**: `delete from certforge.identity_session;` (this only signs people out). A backup can contain sessions that were revoked after it was taken, for example for an account that was disabled or lost a role, and restoring would revive them.
- Keep backups somewhere other than the database host, and treat them as sensitive: they hold password hashes and every learner's answers.
- **Rehearse it.** `deploy/rehearse-restore.sh` backs up a running stack, restores into a brand-new PostgreSQL and compares every table by row count and content checksum plus the migration history. CI runs it on every change; run it against your own environment before relying on a backup.
- This release defines no recovery point or recovery time objective. They depend on how often you back up and where; decide them for your deployment.

## Upgrading and rolling back

Migrations run when the backend starts, in order and forward only, and are recorded in `flyway_schema_history`. The rule for a release is that migrations are **additive**: new tables and columns with defaults, never a rename or removal in the same release that stops using the old name. The backend names its columns, so the previous version keeps working on the newer schema. V11 (the review checklist column) is an example.

- **Upgrade**: take a backup, deploy the new images, wait for readiness, run `deploy/verify-release.sh`.
- **Roll back the application**: redeploy the previous images. This is safe while every migration in between is additive, which the rule above is for. Do not try to undo a migration.
- **If a migration damaged data or was not additive**: restore the backup taken before the upgrade and redeploy the previous images. Everything written since the backup is lost, so say so to the people affected.
- A failed migration leaves the instance unready; see [Recovering a failed migration](#recovering-a-failed-migration).

## Reconciling data

Some data is derived, and some is evidence. Repair the first; never edit the second.

- **Topic progress is derived** from attempts. `GET /api/progress/reconciliation` shows any difference and `POST /api/progress/rebuild` repairs it.
- **Attempts, published revisions and audit records are evidence.** The database refuses to change them. If a number looks wrong, the projection is wrong, not the evidence.
- **Sessions expire on read**: an in-progress session past its expiry is reported as expired and needs no clean-up.
- **Publication and audit should agree.** Every published or replaced revision has an audit event. To list any that do not:

```sql
select r.id from certforge.qb_question_revision r
where r.published_at is not null
  and not exists (select 1 from certforge.audit_event a
                  where a.action = 'QUESTION_REVISION_PUBLISHED'
                    and a.subject = 'question-revision:' || r.id);
```

An empty result is the expected one. Revisions published before the audit trail existed (before issue #12) would appear; there are none in a database that began at v0.1.0.

## Incident response

In order, and write down what you did and when:

1. **Contain.** If answers or accounts may be exposed, stop traffic first: stop the `web` container, or let readiness fail. A short outage is better than a continuing leak.
2. **Preserve evidence.** Take a database backup before changing anything, and keep the logs. The `requestId` ties a user's report to log lines and to audit records.
3. **Identify.** Use the triage table above, the audit trail (`GET /api/admin/audit`) and the metrics.
4. **Fix or roll back.** See above. For one wrong question, retire it (the editorial desk's Retire) instead of editing the database; its history stays.
5. **Verify.** Readiness is up, `deploy/verify-release.sh` passes, and the symptom is gone.
6. **Tell the people affected** what happened and what they should do, and record the incident (what, why, what changed) in the changelog or a decision record.

Common cases:

| Case | First steps |
|---|---|
| A question's answer or wording is wrong | Retire the revision; start a new revision and publish it after review. Learners' past attempts keep showing what they saw. |
| Answers may have leaked before submission | Contain, then run `deploy/verify-privacy.mjs` and the privacy end-to-end journey against the stack, and read the audit trail for who published what. |
| An account is compromised | Disable it (`POST /api/admin/accounts/{id}/disable`), which ends its sessions at once; review what it did in the audit trail. |
| The database password or the bootstrap administrator password is exposed | Change it in the database and in the backend's environment, restart the backend, and sign everyone out (`delete from certforge.identity_session;`). |
| A dependency advisory is published | The image scan fails the next build; bump the version (see `pom.xml` for how overrides are recorded), rebuild and redeploy. |

## Deferred

External SIEM integration, a long-term analytics warehouse, a distributed tracing pipeline, runner-specific telemetry, and audit records for account and catalog changes (the audit module depends on identity, so those need a neutral fact type first).

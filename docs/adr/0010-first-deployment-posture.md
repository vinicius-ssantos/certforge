# ADR 0010: Run v0.1.0 as one instance behind a TLS terminator, with daily off-host backups

- Status: **Accepted** on 2026-10-02, as written. These are the decisions the [readiness review](../release/v0.1.0-readiness.md) left to a person before the first deployment. Accepting them does not deploy anything: a deployment must still be set up to match, and the operations guide says how.
- Date: 2026-10-01

## Context

`v0.1.0` is built and tested but not deployed anywhere. Three questions have no technical answer, because they are about how much risk the operator accepts and what they are willing to run:

1. Who terminates TLS, since the images speak plain HTTP by design.
2. How often backups are taken and where they are kept.
3. What recovery point and recovery time the service promises.

They are grouped because the answers constrain each other: a single instance makes the recovery time objective depend on how fast one machine can be rebuilt, and that in turn decides whether hourly backups buy anything.

Two properties of the release set the floor. Rate limiting is in memory per instance (ADR 0008), so more than one backend instance weakens sign-in and registration throttling until a shared store exists. And all state is in PostgreSQL, so the database is the only thing to back up.

## Decision

### 1. TLS is terminated in front of the web container, by a reverse proxy the operator already runs

Recommended: a TLS-terminating reverse proxy (Caddy, nginx, or a cloud load balancer) in front of `web`, with certificates from Let's Encrypt where there is no existing certificate authority. Then set `SESSION_COOKIE_SECURE=true`, add `Strict-Transport-Security` at the terminator, and keep forwarding `X-Forwarded-Proto`.

Why not in the image: the application would have to own certificate renewal, which is an operational concern with good existing solutions, and the images stay useful behind whatever the operator already has. `web` already overwrites `X-Forwarded-For` so the backend can tell clients apart; a terminator in front must do the same, or the rate limits see one address again.

### 2. One backend instance, until rate limiting has a shared store

Recommended: a single `app` container. Running two silently doubles how many sign-in attempts an address gets before being throttled, and nothing warns about it.

### 3. Backups daily, kept off the database host, retained for 30 days, and restored for real once a quarter

Recommended: `pg_dump -Fc` once a day, written to storage that is not the database host; 30 days of retention; and `deploy/rehearse-restore.sh` run against a copy of a real backup at least quarterly, not only in CI.

Why daily rather than continuous: what is lost in a day is a day of learners' answers and any editorial work not yet published. That is unpleasant but not ruinous, and the alternative, continuous archiving, is a standing operational commitment that a service at this stage does not warrant. Why off-host: a backup on the same disk does not survive the failure it exists for. Why restore for real: the CI rehearsal proves the procedure, not the actual backups.

Backups hold password hashes and every learner's answers, so they are protected like the database itself, and a restore is followed by ending every session (see the [operations guide](../engineering/operations.md#backup-and-restore)).

### 4. Recovery objectives: 24 hours of data, one working day to be back

Recommended as the stated promise, not as an aspiration: **recovery point 24 hours**, which falls out of daily backups, and **recovery time one working day**, which is what rebuilding one instance by hand plus restoring a dump takes without a standby.

Say it plainly to the people who use it rather than implying better. If either is too weak for a real audience, the honest fix is more infrastructure, not a better-sounding number.

## Consequences

- A deployment needs a TLS terminator the operator maintains; the images alone are not internet-facing.
- Up to a day of answers and unpublished editorial work can be lost. Published content also lives in `content/` in the repository, so the pack itself is never lost with the database.
- A single instance means a restart is an outage. With a one working day recovery time that is accepted.
- Scaling beyond one instance is blocked on a shared rate-limit store, which is a known limitation already recorded in the threat model and ADR 0008.
- The quarterly restore is a standing task with no automation behind it; if nobody owns it, it will not happen, and the backups become an assumption again.

## Rejected alternatives

- **TLS inside the web image.** Certificate renewal becomes the application's problem, and the image stops composing with whatever the operator runs.
- **Continuous archiving (point-in-time recovery).** It would cut the recovery point to minutes, and it is the right answer once there are learners whose work matters commercially. Today it buys a better number at the cost of an operational commitment nobody is yet responsible for.
- **Two or more backend instances for availability.** It weakens the throttles that protect sign-in, which is a security property, to improve an availability property that the stated recovery time does not require.
- **Leaving the objectives unstated.** An unstated objective is read as "no data loss and no downtime", which is not true of any of the arrangements above.

## How to accept this

Change the status to Accepted, with the date and any altered numbers, and the readiness review's fourth blocker is closed. If a different arrangement is chosen, change the decisions here first: the operations guide points at this record for the numbers.

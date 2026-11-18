## Context

The API remains authoritative for accepted answers, expiry, account ownership and available material. The site uses React Query and its existing locale and styling system.

## Goals / Non-Goals

- Make recovery and the next study action apparent in both locales.
- Preserve route contracts, accessibility and delayed feedback in timed mocks.
- Do not infer study history from the private notebook.

## Decisions

- Keep mock drafts in the active tab, scoped by exam ID and question position. An idempotency key stays with the attempted payload. Server-accepted responses and expiry discard applicable drafts.
- Keep opaque history cursors and apply track and status on the server before paging. Resolve labels from the existing catalogue. The home queries in-progress sessions separately from paged history.
- Use the server review priority and independent cache keys for the limited home query and the full queue.
- Keep tables semantic and expose extra columns through a focusable scroll region. Load staff and interview routes on demand and measure initial and total gzip independently.
- Self-hosted access recovery directs learners to their installation administrator. Automated resetting requires a separate identity design and verified channels.

## Risks / Trade-offs

- Access to browser storage can fail. The in-memory draft remains usable during the visit.
- Use the history API for comparing two loaded attempts on the same revision and disclose pagination and date-filter scope. Display the earliest future review derived by the server and keep learner-wide trend analysis separate.

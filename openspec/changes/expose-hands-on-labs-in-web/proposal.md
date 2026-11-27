# Proposal

## Why

`#175` ("Design safe hands-on labs for Docker, Kubernetes and IaC") shipped a complete backend:
`LabsController`, three reviewed `LabSpec`s, the Vercel Sandbox and temporary-container
orchestrators (ADR 0027/0028/0029/0030), and a real terminal bridge. Its own acceptance criteria
were backend-only ("3 labs reproducible, run outside the main application"; "learner-verifiable
feedback"), so the work closed without ever adding a web page for it. A learner has had no route,
link or UI reaching `/api/labs` since the capability shipped. The hard, reviewed part (isolated
execution) exists and has been separately security-reviewed; what was missing was the part that
makes it reachable at all.

## What Changes

- A learner-facing `/labs` catalog page lists the shipped labs from a new `GET /api/labs`
  (read-only; narrower than `LabSpec`, carrying only what a learner needs: id, objective title and
  description, time limit).
- `/labs/sessions/:sessionId` starts a session, opens its interactive terminal (xterm.js, wired to
  whichever WebSocket the session hands back — Vercel's own controller-hosted PTY for most labs,
  this project's own bridge for the two ADR 0030 names), and lets the learner check their work
  against the existing `complete` endpoint, showing the recorded verdict.
- A session exists only in the tab that started it (no session-recovery endpoint was added,
  matching the backend's own "never resumed" design — ADR 0028 decision 2); reloading or opening
  the URL directly shows an explicit, honest "this session is not open here" state rather than a
  broken page.

## Capabilities

### New Capabilities

- `hands-on-labs` covers the learner-facing lab catalog, session start, the interactive terminal,
  and the recorded verdict.

### Modified Capabilities

(none — `GET /api/labs` is additive; no existing endpoint's contract changed)

## Impact

- Backend: `LabsController` gains one read endpoint and a `LabCatalog` dependency; new
  `LabSummary` DTO. No schema, migration or authorization change (`hasAuthority('STUDY')`,
  unchanged).
- Web: new `src/labs/` module (`LabsPage`, `LabSessionPage`, `LabTerminal`), a nav link, i18n
  (EN + PT-BR), two new dependencies (`@xterm/xterm`, `@xterm/addon-fit`).
- The web bundle budget (`scripts/check-bundle-size.mjs`) moved from 212 KB to 300 KB gzip for
  "Total JS" (the lazy `LabSessionPage` chunk alone is ~85 KB gzip, almost entirely
  `@xterm/xterm` — an ANSI/VT100 terminal emulator, which is what "a real interactive terminal"
  costs; ADR 0029 already records the product owner choosing that over a lighter file-write-only
  bridge once told the trade-off). "Initial JS" moved from 155 to 156 KB for the new nav link and
  its strings; a learner who never opens `/labs` loads none of the extra 85 KB, since
  `LabSessionPage` is its own lazily-loaded route. **This budget change needs the same explicit
  owner attention prior budget changes have had — flagging prominently here, not just in the
  diff.**
- Known gap, disclosed rather than silently assumed: the Vercel-backed lab's exact interactive
  WebSocket wire protocol (how its one-time token is presented) was not verified against the live
  Vercel API — doing so would create a real, billed session, which no credential in this
  environment can do and which is not this agent's call to spend. The client assumes the same
  `?token=` convention this project's own container-bridge terminal already uses; `docs/adr/0029`
  independently confirms it is a plain WebSocket URL+token pair with no other documented contract.
  The two container-bridge labs' terminal path (this project's own code end-to-end) was verified
  working, including under real xterm.js, by scripted browser testing with a mock terminal
  WebSocket during this change.

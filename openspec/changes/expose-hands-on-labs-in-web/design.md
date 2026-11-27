# Design

## Context

`LabsController` already exposes `POST /api/labs/{labId}/sessions` and
`POST /api/labs/sessions/{sessionId}/complete`, returning `LabSession` (a `sessionId`, the
`interactiveUrl`/`interactiveToken` pair for the terminal, and `labId`) and `LabVerdict`
(`passed` + per-check results). There was no way for a browser to learn which `labId`s exist, and
no frontend code anywhere reaching `/api/labs` at all.

## Goals / Non-Goals

Expose the existing capability to a learner; do not change how a lab session is isolated, graded,
billed or routed between engines (`LabOrchestratorRouter` is untouched). Do not build session
recovery across a page reload — the backend's own sessions are single-shot and non-persistent
(ADR 0028 decision 2: `persistent: false`, always, written out explicitly, never resumed), so a
"recoverable" frontend would be promising a guarantee the backend intentionally does not have.

## Decisions

**A new minimal `GET /api/labs` rather than exposing `LabSpec` directly.** `LabSpec` carries image
references, sandbox limits, the allowed-command list and raw evaluation probe shell text — none of
it the learner's business, and some of it (the literal probe commands) arguably shouldn't reach the
client at all. `LabSummary` carries only `labId`, `objective.title`, `objective.description` and
`sandbox.timeoutSeconds`.

**One terminal client for both orchestration engines.** `LabSession.interactiveUrl` is a full
external URL for Vercel-backed labs and a same-origin path for the two container-bridge labs;
`LabTerminal` resolves either via `new URL(interactiveUrl, location.href)`, swaps `http(s)` for
`ws(s)`, and appends `?token=`. This was verified correct and necessary for the container-bridge
path (own code, own WebSocket handler); for the Vercel path it is this change's best-effort
assumption given an undocumented vendor API, flagged in the proposal rather than asserted as
verified.

**xterm.js (`@xterm/xterm` + `@xterm/addon-fit`), not a custom terminal.** ADR 0029 already records
the product owner explicitly choosing "a real interactive terminal" (line editing, Ctrl+C, full
screen `vi`/`nano`) over a lighter file-write-only bridge, after being told the real-terminal
option is the heavier one. A hand-rolled terminal would either not support `vi`/`nano` (reopening
that already-settled decision) or reimplement a large fraction of what xterm.js already does
correctly. `screenReaderMode: true` is enabled (xterm's own built-in accessibility mirror); this is
disclosed to the learner as not yet having had a human assistive-technology walkthrough, the same
disclosure discipline the rest of this project already applies to automated-only a11y coverage.

**No session-recovery endpoint.** The alternative (a `GET /api/labs/sessions/{id}` returning the
original credential again) would need the orchestrator to either cache the Vercel credential
indefinitely past its one-time-use intent or call `openInteractive` a second time with unknown
platform behavior. Given sessions are already deliberately short-lived and non-resumable by design,
a plain "this isn't open here any more, start again" state is the honest answer, not a workaround.

**Theme colors read from the page's own CSS custom properties at mount and on
`prefers-color-scheme` change**, not hardcoded, since xterm paints its own surface and cannot read
a CSS variable itself. This keeps the terminal in the same light/dark scheme as the rest of the
page without a second source of truth for color.

## Risks / Trade-offs

- **Bundle budget**: see the proposal's Impact section. This is the one decision in this change
  that is a genuine, visible trade-off rather than a straightforward engineering call, and is
  flagged there for exactly that reason.
- **A CSS grid item's default `min-width: auto`, combined with a `ResizeObserver` driving
  `FitAddon.fit()`, is an unbounded resize feedback loop** if the observed element's own box can
  grow from its content (discovered and fixed during this change: the terminal surface grew by
  ~225px every ~400ms in a real browser until `min-width: 0` was added). Documented in
  `styles.css` at the rule itself so a future refactor of `.panel`'s grid doesn't reintroduce it
  silently.
- **Vercel's interactive WebSocket protocol is unverified** (see proposal). If wrong, the one
  Vercel-backed lab's terminal would fail to connect while the catalog, session start, and the two
  container-bridge labs would be unaffected; this is a contained, visible failure mode (the
  existing "terminal connection ended" status text), not a silent one.

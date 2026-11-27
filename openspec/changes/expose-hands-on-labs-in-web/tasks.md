# Tasks

## 1. Backend: a learner-safe catalog read

- [x] 1.1 Add `LabSummary` (labId, title, description, timeoutSeconds only).
- [x] 1.2 Add `GET /api/labs` to `LabsController`, same `STUDY` authority as the rest of it.
- [x] 1.3 Integration tests: lists the shipped catalog with only learner-facing fields present;
      refuses anonymous callers. `LabsSessionIT`: 7/7 passing.
- [x] 1.4 Regenerate and commit `web/openapi.json` and `web/src/api/schema.d.ts`.

## 2. Web: catalog and session pages

- [x] 2.1 `LabsPage`: catalog list, start mutation, loading/empty/error states.
- [x] 2.2 `LabSessionPage`: objective, terminal, "Check my work", verdict, and the explicit
      session-not-open-here state for a reload/direct link.
- [x] 2.3 `LabTerminal`: xterm.js wired to either orchestration engine's WebSocket, themed from the
      page's own light/dark tokens, `screenReaderMode` enabled with a disclosed limitation.
- [x] 2.4 Routes, nav link, EN + PT-BR strings, friendly messages for `lab_not_found` /
      `lab_session_not_found`.

## 3. Verify

- [x] 3.1 Backend: `LabsSessionIT` (new `GET /api/labs` cases included) green. Pre-existing
      `LabsContainerSessionIT` (nested Docker-in-Docker) does not run in this sandboxed dev
      environment for lack of privileged virtualization — unrelated to this change, confirmed
      failing identically before it.
- [x] 3.2 Web: `npm run typecheck`, `npm run lint`, `npm test` (361/361) all green.
- [x] 3.3 `npm run budget`: green at the new, explicitly-raised ceiling (see proposal's Impact).
- [x] 3.4 Real-browser verification (scripted, against a built production bundle): catalog renders
      all 3 labs; starting the two container-bridge labs against the real local backend fails
      cleanly (no Docker-in-Docker here) with the existing error UI, not a crash; a mocked terminal
      WebSocket connects, displays output, accepts typed input, and "Check my work" renders a real
      mocked verdict — light and dark, desktop and mobile widths. Found and fixed a real
      `ResizeObserver` feedback-loop bug in the process (see design.md).
- [x] 3.5 Component tests (`web/src/labs/labs.test.tsx`, 6 cases) cover the same catalog → start →
      terminal → check-my-work → verdict flow, plus the empty/error/session-lost states, with only
      jsdom's missing `WebSocket`/`ResizeObserver`/`matchMedia` stood in for — not this project's
      own code.
- [ ] 3.6 Human acceptance: the Vercel-backed lab's terminal (unverified protocol, see proposal)
      needs one live check with a real Vercel Sandbox credential, which this change does not have
      and should not acquire unilaterally given the real per-session billing cost ADR 0028
      already flags. A manual assistive-technology walkthrough of the interactive terminal is a
      separate, not-yet-done gate, consistent with how this project already treats that gate for
      other screens.
- [ ] 3.7 CI and human review on this PR's own head before archiving this change.

## 1. Report blockers

- [x] 1.1 Fix and extend navigation assertions from #404.
- [x] 1.2 Retain mock drafts, show save state, focus questions and filter the navigator.
- [x] 1.3 Preserve editorial search, status and page across navigation.

## 2. Study surfaces

- [x] 2.1 Surface active study and mock sessions before reviewing or browsing.
- [x] 2.2 Make practice prominent on tracks and expose mock availability details progressively.
- [x] 2.3 Add result filters and topic practice, a queue overview, and history and progress filters.
- [x] 2.4 Clarify interview entry points and self-hosted account recovery.

## 3. Frontend quality

- [x] 3.1 Improve mobile table guidance, code reading and empty-state heading IDs.
- [x] 3.2 Split optional frontend payloads and report initial and total gzip.
- [x] 3.3 Run strict OpenSpec validation, frontend tests, type checks, and the production build.
- [x] 3.4 Confirm remote CI and complete visual acceptance on mobile and desktop.

Acceptance evidence (2026-11-18): [PR #412 visual review](../../../../docs/review/pr-412/README.md) includes desktop and mobile 320/390 px, Portuguese and English, mock result and editorial screens. The disposable-environment screenshot test passed; widths were explicitly checked for horizontal overflow. [CI 44391115494](https://github.com/vinicius-ssantos/certforge/actions/runs/44391115494) and [CodeQL 44391115423](https://github.com/vinicius-ssantos/certforge/actions/runs/44391115423) passed on commit `9201a36`. Visual evidence was inspected by the assistant; the user directed continuation with “SEGUE” following the request for visual approval. This records authorization to continue, not a claim that the user individually inspected every screenshot.

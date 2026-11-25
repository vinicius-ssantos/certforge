## Source correction

- [x] Confirm Codex P2 on #471: generic spy terminology remains ambiguous despite the earlier #458 copied-state fix.
- [x] Independently compare Fowler's classic Meszaros-derived test-spy definition with versioned Mockito 5.24.0 `spy(Object)` API.
- [x] Scope the learner-facing prompt to Mockito.spy(existingObject) and retain uniquely correct answer D.
- [x] Update D text, D explanation, overall rationale, and B/C distractor explanations without changing A/B/C texts.
- [x] Retain pinned original authoritative references and do not change `review.json` or DRAFT pack status.
- [x] Validate strict OpenSpec, Maven, Web, Playwright, release image E2E, secret scanner, CodeQL and reviewer findings.
- [x] Squash-merge source fix only after gates; separately verify exact merged source and V2 digest in a new review PR; archive completed OpenSpec afterward.

### Verified integration evidence — 2026-11-25

- #472 `606071c2bc9f2e96de5b7abf00ef4c5baee9663b` source-only correction after Codex P2; separate exact-source review #473 `cbe9be6acfd3cb802a52026dd7d0fdc07f588106`.
- The corresponding source/review PRs passed 8/8 required checks with completed Codex review and no unresolved blocking findings before their respective squash merges. No question verdict was recorded by a source-only correction PR.
- Exact main review record has **55/208** source-bound, truthful `ai-reviewer` verdicts and **153 pending**. Issue #392 stays OPEN; interview pack stays DRAFT, and accessibility issue #428 stays OPEN for human device/assistive-technology acceptance. No publication, deployment, bulk approval or fabricated human sign-off.

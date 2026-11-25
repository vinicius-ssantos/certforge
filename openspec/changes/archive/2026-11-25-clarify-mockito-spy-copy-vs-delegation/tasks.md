## Technical source correction

- [x] Identify the inaccurate forwarding-to-original assertion in the current correct answer D and rationale.
- [x] Cross-check Mockito `spy(Object)` semantics with versioned official 5.24.0 Javadoc.
- [x] Re-read classic stub/mock/fake/spy definitions from Martin Fowler's original essay.
- [x] Correct answer D, its explanation, the overall rationale, and stale wrong-option explanations A/B/C; preserve correct key D and the three incorrect option texts.
- [x] Pin Mockito documentation to version 5.24.0; leave review.json and pack DRAFT untouched.
- [x] Validate strict OpenSpec, Java Maven, Web, Playwright, release-image E2E, security and CodeQL and review findings.
- [x] Merge source correction only after gates; independently re-review and digest corrected question in a later PR; archive completed OpenSpec afterward.

### Verified integration evidence — 2026-11-25

- #458 `08745867a0459673d6fe21941337dd4b80a64188` source-only correction; later Codex P2 on #471 required an additional source-only fix #472 before final review #473.
- The corresponding source/review PRs passed 8/8 required checks with completed Codex review and no unresolved blocking findings before their respective squash merges. No question verdict was recorded by a source-only correction PR.
- Exact main review record has **55/208** source-bound, truthful `ai-reviewer` verdicts and **153 pending**. Issue #392 stays OPEN; interview pack stays DRAFT, and accessibility issue #428 stays OPEN for human device/assistive-technology acceptance. No publication, deployment, bulk approval or fabricated human sign-off.

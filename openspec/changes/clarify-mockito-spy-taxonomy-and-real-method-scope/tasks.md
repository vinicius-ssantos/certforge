## Source correction

- [x] Confirm Codex P2 on #471: generic spy terminology remains ambiguous despite the earlier #458 copied-state fix.
- [x] Independently compare Fowler's classic Meszaros-derived test-spy definition with versioned Mockito 5.24.0 `spy(Object)` API.
- [x] Scope the learner-facing prompt to Mockito.spy(existingObject) and retain uniquely correct answer D.
- [x] Update D text, D explanation, overall rationale, and B/C distractor explanations without changing A/B/C texts.
- [x] Retain pinned original authoritative references and do not change `review.json` or DRAFT pack status.
- [ ] Validate strict OpenSpec, Maven, Web, Playwright, release image E2E, secret scanner, CodeQL and reviewer findings.
- [ ] Squash-merge source fix only after gates; separately verify exact merged source and V2 digest in a new review PR; archive completed OpenSpec afterward.

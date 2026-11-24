## Technical repair

- [x] Identify the incorrect guaranteed lost-update outcome in the volatile prompt.
- [x] Check JLS SE 21 §17.4 semantics; preserve answer B and qualify both permitted results.
- [x] Identify the invalid top-level statements in the polymorphism program.
- [x] Add a complete main method and verify `javac --release 21` and runtime output `Woof`.
- [x] Verify JUnit PER_METHOD versus PER_CLASS semantics and default test order against versioned JUnit 5.14.3 documentation.
- [x] Clarify shared test-instance lifecycle and pin the two JUnit reference URLs, preserving answer C.
- [x] Preserve answer keys B, B and C, unrelated questions and pack DRAFT status.
- [x] Validate strict OpenSpec, Maven, frontend, Playwright, release E2E, CodeQL and review on the PR.
- [x] Merge the correction, then separately perform source-bound editorial review and archive OpenSpec.

### Verified completion (2026-11-24)

- Original PR #443 squash-merged into `main` after all eight CI and CodeQL checks passed.
- The corrected source content received separately verified AI-attributed V2 digest reviews in merged PR #445; six entries total. This is not a human sign-off or pack-wide approval.
- Issue #392 remains open, pack DRAFT, no publication or deployment. UX acceptance issue #428 remains independent and open.

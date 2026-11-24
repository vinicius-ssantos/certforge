## Technical verification and source-bound review

- [x] Verify each of the six complete question texts, options, distractors, explanations and reference links.
- [x] Validate JDK 21 PolymorphismDemo compilation/runtime output Woof and Java SE 21 overriding semantics.
- [x] Verify JUnit 5.14.3 PER_CLASS shared-instance state and test order in version-pinned official docs.
- [x] Check volatile lost-update possibility (not inevitability) against JLS 21 §17.4.
- [x] Compile/run an independent JDK 21 test for try-with-resources suppression and one-use Stream behavior.
- [x] Cross-check Oracle guidance for checked/unchecked exception recoverability in the stated scenario.
- [x] Compute exact six V2 digests, confirming SHA-256 against a known test vector and an existing review digest.
- [x] Preserve 26 existing reviews and DRAFT status, attributing only the new entries to ai-reviewer.
- [ ] Confirm strict OpenSpec, full Maven/Web/E2E/Release CI, CodeQL and review on the PR.
- [ ] Merge only after checks, update issue #392 and archive this OpenSpec in a follow-up PR.

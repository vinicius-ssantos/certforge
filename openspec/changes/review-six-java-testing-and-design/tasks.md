## Individual validation

- [x] Re-read the complete six question objects, all four answer alternatives and explanations individually.
- [x] Verify LIFO bracket matching via official Java SE 21 Deque API.
- [x] Verify flaky test nondeterminism against Martin Fowler's original essay.
- [x] Confirm CompletableFuture exceptional-stage propagation via Oracle Java SE21 APIs and compiled OpenJDK 21 smoke output: zero downstream calls.
- [x] Verify DRY anti-coupling example against Sandi Metz's original abstraction guidance.
- [x] Verify request scope vs eager singleton injection and scoped proxies in official Spring Framework.
- [x] Verify over-specific Mockito interaction tests vs observable outputs in original Martin Fowler mocks essay.
- [x] Independently compute six source V2 digests, validating SHA-256 `abc` vector and an existing recorded review digest.
- [x] Preserve 47 existing reviews; record six truthful ai-reviewer entries, keep pack DRAFT and both #392/#428 open.
- [x] Exclude broken Mockito spy terminology and non-async CompletableFuture thread overclaim, document issue #392.
- [ ] Confirm strict OpenSpec, Java Maven, Web, Playwright, image E2E, CodeQL and secret scan gates and reviewer findings.
- [ ] Squash merge after full 8/8 CI success, update #392, then archive change in follow-up.

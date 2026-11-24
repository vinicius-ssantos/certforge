## Technical verification

- [x] Re-read each exact question file, prompt, alternatives, wrong-option explanations and rationale.
- [x] Verify Java SE 21 ArrayList indexed access and LinkedList sequential access in first-party Oracle APIs.
- [x] Verify Spring AOP self-invocation bypass in official reference, distinguishing pre-existing ambient transactions.
- [x] Verify no-active-profile default versus @Profile("prod") semantics in official Spring Boot reference.
- [x] Verify @SpringBootApplication implicit component scan package boundaries via Spring Framework and Boot documentation.
- [x] Verify command-line server.port precedence over environment variables and packaged YAML in Spring Boot.
- [x] Verify independent REQUIRES_NEW audit commit survives outer REQUIRED rollback per official Spring reference.
- [x] Fix Codex P2 default-profile distractor: acknowledge unprofiled/negated profile activation, preserving key B, cite Spring Framework 6.2 @Profile API.
- [x] Fix Codex P2 component-scan distractor: acknowledge real spring.main.sources additional sources while retaining implicit scan, preserving key B, cite first-party Spring Boot docs.
- [x] Re-review both corrected D explanations and recompute their new exact V2 digests before re-recording AI approvals.
- [x] Recompute all six V2 SHA-256 source digests; check standard vector and an existing recorded source digest.
- [x] Preserve all previous 40 decisions, attribute six new entries to ai-reviewer and keep pack DRAFT.
- [x] Exclude unresolved @ResponseBody question distractor without fabricating its review.
- [x] Complete strict OpenSpec, Java Maven, Web, Playwright, release-image E2E, CodeQL and secret scan gates, plus review.
- [x] Merge only after all eight CI checks green; update issue #392 and archive this OpenSpec in follow-up work.

### Verified integration evidence — 2026-11-24

- PR #451 was squash-merged into main after all **eight** required CI/CodeQL checks succeeded, with no unresolved blocking review findings.
- PR #451 recorded six individually checked and truthful ai-reviewer V2 decisions, correcting both P2 Spring distractor explanations and recomputing their digests before merge; PR #452 fixed the separate @JsonProperty content source without an AI verdict; PR #453 independently reviewed that corrected source and recorded one new AI-attributed digest.
- Issue #392 remains OPEN with **47/208 reviewed and 161 pending**. Interview pack stays DRAFT, no deploy or publication. Human UX/E2E acceptance issue #428 remains OPEN with its active OpenSpec change unarchived.

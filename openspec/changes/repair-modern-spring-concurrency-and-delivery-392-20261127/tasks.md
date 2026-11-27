## Source repair gates

- [x] Audit all four original prompts, answer alternatives, explanations and vendor/author references; confirm correctness defects.
- [x] Modify only four learner-facing question JSON files, retain keys and existing references; add authoritative PostgreSQL, MySQL and Spring MVC sources.
- [x] Strict OpenSpec 11/11 valid, focused review/manifest integrity tests 24/24 passed, diff limited to four source questions and OpenSpec.
- [ ] Open dedicated source-only PR and require exact-head CI/CodeQL and independent Codex review.
- [ ] Squash merge after gates succeed, verify postmerge CI, then archive OpenSpec separately.
- [ ] Schedule four independent fresh V2 editorial reviews after content correction; keep #392, #428 and DRAFT state unchanged.

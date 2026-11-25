## Implementation and qualification

- [x] Reproduce/trace missing Jackson 2 compile API from PR #466 Maven job 139436891598.
- [x] Confirm Springdoc 3.2.1's Jackson 3 transition against its official documentation.
- [x] Verify Spring Boot 4.2.0 and Modulith 2.2.0 integration on main (#461) after 8/8 required CI success.
- [x] Identify both direct Jackson 2 consumers and existing Jackson 3 REST usage.
- [x] Add explicit, Boot-managed Jackson 2 databind compile dependency while keeping Springdoc 3.2.1.
- [x] Preserve existing application classes, pack DRAFT, issues #392/#428 and current JS size budgets.
- [ ] Verify dependency graph / full Maven compilation and existing tests on the combined Boot/Modulith/Springdoc head.
- [ ] Verify 8/8 CI + CodeQL + security + release image + Playwright, and clean exact-head Codex review.
- [ ] Squash merge the fixed PR, document outcome on #475 and archive the completed OpenSpec separately.

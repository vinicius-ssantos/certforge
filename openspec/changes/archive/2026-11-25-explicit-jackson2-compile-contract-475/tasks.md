## Implementation and qualification

- [x] Reproduce/trace missing Jackson 2 compile API from PR #466 Maven job 139436891598.
- [x] Confirm Springdoc 3.2.1's Jackson 3 transition against its official documentation.
- [x] Verify Spring Boot 4.2.0 and Modulith 2.2.0 integration on main (#461) after 8/8 required CI success.
- [x] Identify both direct Jackson 2 consumers and existing Jackson 3 REST usage.
- [x] Add explicit, Boot-managed Jackson 2 databind compile dependency while keeping Springdoc 3.2.1.
- [x] Preserve existing application classes, pack DRAFT, issues #392/#428 and current JS size budgets.
- [x] Verify dependency graph / full Maven compilation and existing tests on the combined Boot/Modulith/Springdoc head. Local Maven dependency:tree on source-equivalent Boot 4.2.0/Springdoc 3.2.1 POM: direct `com.fasterxml.jackson.core:jackson-databind:jar:2.21.7:compile`, `BUILD SUCCESS`; GitHub Java 25 Maven verify (including existing Java regression tests) SUCCESS on exact PR #466 head.
- [x] Verify 8/8 CI + CodeQL + security + release image + Playwright, and clean exact-head Codex review. Exact head `f32bfd8d4798f3527957e6f5e31954e8f9031994` passed all 8/8; Codex completed without findings; 0 unresolved threads.
- [x] Squash merge fixed PR #466 into `main` as `175717584fa058adce0ccd2c09a01042311e30da`; document on #475. Move this completed OpenSpec change into `openspec/changes/archive/` in an independent documentation-only PR; leave #477 and #428 untouched.

### Verified closeout (2026-11-25)

- Regression mechanism: `pom.xml` now contains a direct versionless compile dependency on Jackson 2 databind, with the project-managed 2.21.7 Jackson-2 BOM version; removing Springdoc's transitive Jackson 2 usage no longer removes the imports in `LabSpecRegistry` and `JobDescriptionTerms`.
- GitHub PR #466 was merged after all 8 CI/CodeQL/Playwright/release-image checks were green and the exact-head Codex review completed cleanly, without new review threads.
- Independent Maven `dependency:tree` on the combined source tree resolved `com.fasterxml.jackson.core:jackson-databind:jar:2.21.7:compile` as a direct dependency, `BUILD SUCCESS` (2026-11-25). Maven repository metadata queries for unrelated Flyway repositories emitted 401 warnings but did not affect the successful local dependency tree resolution.
- The retained full CI Maven verification provides the compile/regression assertion for Jackson 2 API consumers; no redundant source-only test or forced migration is introduced.
- No release, deploy, interview editorial status change, loosening of JS budgets, or acceptance of human accessibility issue #428.

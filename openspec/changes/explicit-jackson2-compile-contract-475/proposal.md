## Why

Dependabot PR #466 upgraded Springdoc OpenAPI 3.2.0 to 3.2.1. The first two CI runs, including exact head `22caa58caac59242972c59c36235b8953da6776a`, failed Java 25 compilation: `com.fasterxml.jackson.databind.JsonNode` and `ObjectMapper` are absent from the classpath. Springdoc 3.2.1 changed to Jackson 3, exposing an accidental dependency on Jackson 2 imported transitively by Springdoc 3.2.0. Independently, the Spring Boot 4.2.0 + Spring Modulith 2.2.0 combination was verified by 8/8 CI on PR #461 and squash-merged into `main` as `c86bfb3eda74b7076e1b08fbbedcb9f91dfb5dcd`.

## What Changes

- Upgrade `org.springdoc:springdoc-openapi-starter-webmvc-api` to 3.2.1 on the already verified Boot 4.2.0 baseline.
- Add one **explicit**, versionless `com.fasterxml.jackson.core:jackson-databind` compile dependency, managed by the existing Spring Boot Jackson 2 BOM and its project-level `jackson-2-bom.version` security override. No arbitrary pinned versions.
- Preserve standalone Jackson 2 mappers used by `LabSpecRegistry` and `JobDescriptionTerms`; the existing `VercelSandboxClient` and Spring MVC's Jackson 3 behavior are unchanged.
- Record durable dependency-contract requirements for avoiding transitive library leakage across major Jackson upgrades.

## Boundaries

Dependency contract and OpenSpec only. Do not migrate JSON behavior, revise interview question verdicts, adjust frontend size budgets, weaken any CI gate, publish/deploy or mark accessibility issue #428 accepted. Issue #475 tracks this independently.

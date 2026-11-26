## Evidence and dependency choice

The exact failure in #466 (CI run 45679769073, Maven job 139436891598) reports unresolved Jackson 2 `JsonNode` and `ObjectMapper` after Springdoc 3.2.1 is introduced. The classpath regression is reproducible independently of the HTTP client. The relevant source files are:

- `src/main/java/dev/certforge/study/internal/JobDescriptionTerms.java` — `com.fasterxml.jackson.databind.JsonNode` / `ObjectMapper` for a standalone JSON dictionary
- `src/main/java/dev/certforge/labs/internal/LabSpecRegistry.java` — `com.fasterxml.jackson.databind.ObjectMapper` for eager lab-spec registry validation
- `src/main/java/dev/certforge/labs/internal/VercelSandboxClient.java` — `tools.jackson.databind.JsonNode` on the Jackson 3 REST client path (intentionally unmodified)

Springdoc upstream documents a Jackson 3 transition beginning in 3.2.1: https://springdoc.org/. Spring Boot's 4.0 migration guide explicitly preserves separately managed Jackson 2 dependencies for compatibility: https://github.com/spring-projects/spring-boot/wiki/Spring-Boot-4.0-Migration-Guide.

### Decision

Declare `com.fasterxml.jackson.core:jackson-databind` as a **direct compile dependency** with no version element. Spring Boot 4.2.0 still manages Jackson 2 via `jackson-2-bom.version`, which this project already overrides to `2.21.7` for known security advisories. This stabilizes the direct code dependency instead of depending on the documentation library's implementation details, avoids migration of two independent JSON catalog codepaths in an unrelated dependency PR, and preserves the Jackson 3 REST path. Re-evaluate a separate deliberate Jackson 3 migration later.

### Test and review gate

- Confirm `mvn dependency:tree` effective classpath contains direct Jackson 2 databind and the Springdoc 3.2.1 + Jackson 3 dependency chain without runtime classpath collisions.
- Compile all Java modules (both Jackson 2 source imports must resolve); run full Maven verification and all 8 CI/CodeQL, Playwright, release image and secret-scan gates.
- Check mapped JSON catalog behavior through existing JUnit/regression tests; no change to shipped catalog files, API schemas, or Jackson configuration.
- Codex must review the exact updated PR head; no merge until all gates and unresolved threads are clear.

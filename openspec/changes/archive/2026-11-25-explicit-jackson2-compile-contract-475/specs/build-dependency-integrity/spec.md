## ADDED Requirements

### Requirement: Explicit direct JSON compile dependencies survive documentation-library upgrades

Java application sources that import Jackson 2 `com.fasterxml.jackson.databind` APIs SHALL declare their needed Jackson 2 compile dependency directly and SHALL NOT rely on a transitive dependency of the OpenAPI documentation generator. The version SHALL be managed by the approved Spring Boot Jackson 2 BOM, while Jackson 3 `tools.jackson` usage remains isolated and compatible.

#### Scenario: Springdoc switches its internal mappers to Jackson 3

- **WHEN** Springdoc is upgraded to 3.2.1 on Spring Boot 4.2.0
- **THEN** `LabSpecRegistry` and `JobDescriptionTerms` still compile with an explicit managed Jackson 2 `jackson-databind` dependency
- **AND** the existing Jackson 3 REST client and OpenAPI contract generation continue to pass verification
- **AND** no Jackson 2 version override, catalog migration or unrelated API behavior change is introduced.

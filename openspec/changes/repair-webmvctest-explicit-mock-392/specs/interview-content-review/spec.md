## ADDED Requirements

### Requirement: Spring MVC slice content SHALL identify explicit collaborators

Question explanations about `@WebMvcTest` SHALL distinguish the MVC slice and `MockMvc` auto-configuration from explicitly supplied service collaborators. The content SHALL NOT claim the slice automatically mocks all service or repository beans.

#### Scenario: Isolated controller request/response test

- **GIVEN** a Spring MVC controller with required service dependencies
- **WHEN** `@WebMvcTest(MyController.class)` is used
- **THEN** the test loads selected MVC components and provides `MockMvc`
- **AND** test authors supply required collaborators using `@MockitoBean` or equivalent explicit configuration
- **AND** the test does not inadvertently require a real persistence context.

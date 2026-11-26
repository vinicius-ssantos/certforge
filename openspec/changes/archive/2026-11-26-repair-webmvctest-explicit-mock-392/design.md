## Semantics

Spring Boot `@WebMvcTest` loads only MVC-related components with a configured `MockMvc` test client; it is not a full application context. Dependencies on ordinary service/repository beans are not automatically injected or mocked; an MVC test must provide required collaborators explicitly. Spring Framework `@MockitoBean` is the modern replacement for deprecated `@MockBean` in recent Spring Boot versions. Explain that controller advice and JSON converters are part of the relevant slice, while full persistence infrastructure is excluded unless deliberately imported.

Primary evidence: https://docs.spring.io/spring-boot/reference/testing/spring-boot-applications.html and https://docs.spring.io/spring-framework/reference/testing/annotations/integration-spring/annotation-mockitobean.html

Preserve correct answer D, distractors, and source-bound independent review process.

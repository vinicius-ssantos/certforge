## ADDED Requirements

### Requirement: Spring bean scope explanations SHALL not equate prototype with HTTP request

A content question about shared mutable singleton state SHALL distinguish singleton, prototype and web request scopes. It SHALL NOT imply that a prototype injected once into a singleton automatically refreshes for each incoming HTTP request.

#### Scenario: Per-request accumulator leaks between calls

- **GIVEN** a singleton holds mutable request data
- **WHEN** a refactor proposes request isolation
- **THEN** a method-local accumulator or correctly request-scoped state is acceptable
- **AND** a prototype is acceptable only when a new instance is explicitly acquired as needed
- **AND** `synchronized`, `volatile` or a thread-safe list alone do not establish per-request isolation.

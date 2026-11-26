## ADDED Requirements

### Requirement: Spring circular-dependency evidence SHALL identify lazy injection-point proxy semantics

A Spring Framework interview question that recommends structural removal of circular dependencies over lazy injection SHALL cite the official `@Lazy` annotation behavior and accurately distinguish deferred resolution from the underlying dependency graph.

#### Scenario: Lazy injection on constructor parameter

- **GIVEN** two services depend on each other via constructor injection
- **WHEN** a candidate suggests `@Lazy` on one constructor parameter
- **THEN** the question explanation cites the official lazy-resolution proxy semantics
- **AND** it distinguishes a runtime workaround from removing bidirectional coupling
- **AND** it does not incorrectly imply all cycle-free dependency graphs are trees.

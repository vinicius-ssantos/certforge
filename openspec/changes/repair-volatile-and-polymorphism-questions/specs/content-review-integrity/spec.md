## ADDED Requirements

### Requirement: Concurrent increment examples distinguish permitted races from guaranteed outcomes
Interview questions about a volatile read-modify-write operation SHALL state that
lost updates **can** occur, not that they **must** occur in every execution.
They SHALL distinguish visibility from atomicity with a Java Memory Model reference.

#### Scenario: Evaluate the volatile counter race
- **WHEN** ten threads each execute 100 increments of a volatile int without compound synchronization
- **THEN** the question allows a final count of 1000 or a smaller count
- **AND** answer B explains non-atomic read-modify-write behavior.

### Requirement: Console-output polymorphism examples compile on Java 21
A Java interview question that asks for a program's printed output SHALL
show an executable compilation unit and retain the unique correct answer.

#### Scenario: Run the Animal and Dog override sample
- **WHEN** a learner compiles PolymorphismDemo with Java 21
- **THEN** it compiles and prints Woof
- **AND** answer B identifies runtime virtual method dispatch.

### Requirement: JUnit shared-instance questions declare their lifecycle
When a test-isolation question assumes an instance field survives multiple
JUnit 5 test methods, its scenario SHALL explicitly select PER_CLASS lifecycle
and SHALL cite versioned official JUnit 5 references instead of a moving latest link.

#### Scenario: Diagnose order-dependent test pollution
- **WHEN** one JUnit test leaves mutable instance state visible to another
- **THEN** the question specifies PER_CLASS and distinguishes it from the PER_METHOD default
- **AND** answer C recommends fresh independent test state.

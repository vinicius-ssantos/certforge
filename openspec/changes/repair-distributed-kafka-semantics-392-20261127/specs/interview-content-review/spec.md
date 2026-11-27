## ADDED Requirements

### Requirement: Distributed deadline and causal clocks SHALL not overclaim behavior

The deadline question SHALL distinguish upstream timeout enforcement from downstream wasted work and require remaining-budget propagation. The clocks question SHALL distinguish Lamport scalar causality ordering from vector-clock concurrency detection.

#### Scenario: Distributed timeout and concurrency

- **GIVEN** a five-second caller deadline and later independent child call
- **THEN** the user-visible answer SHALL NOT claim the caller necessarily waits ten seconds and SHALL explain cancellation/remaining budget
- **AND** vector clocks SHALL detect concurrent events while Lamport scalars alone SHALL NOT.

### Requirement: Kafka processing examples SHALL explain actual offset and external effect semantics

Auto-commit SHALL be described in relation to KafkaConsumer polling and the completed position, not an independent timer interrupting a single synchronous handler. External effects SHALL use atomic remote-idempotency contracts where required; Kafka transactions and outbox relays SHALL not be claimed to provide global exactly-once external effects.

#### Scenario: Unfinished asynchronous work and redelivery

- **GIVEN** an auto-commit poll loop advances beyond asynchronous effects
- **THEN** a crash after committing the position MAY lose unfinished work
- **AND** the correct answers SHALL describe durable effect-level idempotency, polling versus CDC relays and at-least-once redelivery.

### Requirement: RYW, Java Streams, and modern Spring Boot semantics SHALL remain conditional

Read-your-writes SHALL require routing to a primary or a replica proven caught up to the client's last write; thread-safe synchronizedSet SHALL not imply deterministic stateful parallel stream results; field-injection cycle tolerance SHALL be explicitly conditioned on circular references being enabled, recognizing Boot 2.6+ defaults.

#### Scenario: A replica lags longer than a timer

- **GIVEN** replication lag exceeds a fixed primary-routing window
- **THEN** the answer SHALL NOT claim a strict read-your-writes guarantee merely from the timer.

#### Scenario: Parallel map with shared synchronized set

- **GIVEN** duplicate values under parallel execution
- **THEN** the answer SHALL describe schedule-dependent output even after data-race safety is restored.

#### Scenario: Spring Boot 2.6+ startup

- **GIVEN** default circular reference prohibition
- **THEN** field and constructor injection cycles SHALL fail without an explicit override.

### Requirement: Source-only changes SHALL preserve editorial integrity

Correct keys SHALL remain A/A/B/B/A/A/D/B/B respectively. No APPROVED AI record, human signoff, pack publication or deployment SHALL be produced.

#### Scenario: Future V2 signoff

- **GIVEN** these source questions are corrected and integrated
- **THEN** each future V2 approval SHALL require separate content-bound digest and review evidence.

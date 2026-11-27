## ADDED Requirements

### Requirement: Transaction isolation interview question SHALL state accurate database defaults

The source SHALL distinguish PostgreSQL's default READ COMMITTED from MySQL/InnoDB's default REPEATABLE READ, and SHALL give a concrete separate read and unguarded decrement race. The correct key SHALL remain B and explain SERIALIZABLE-with-retry or equivalent safe concurrency control.

#### Scenario: Two stock decrements race

- **GIVEN** two concurrent PostgreSQL READ COMMITTED transactions both read stock 1
- **WHEN** each separately applies an unguarded arithmetic decrement
- **THEN** the learner-facing answer explains why extra locking, serialization retry or conditional update is needed

### Requirement: Spring MVC validation question SHALL reflect native Spring 6.1 support

The controller constraint question SHALL explain that direct parameter constraints receive built-in MVC method validation on Spring Framework 6.1+ with an appropriate Validator. The correct key SHALL remain B; class-level `@Validated` SHALL not be falsely described as required for native MVC validation.

#### Scenario: Direct request parameter constraint

- **GIVEN** a Spring MVC 6.1+ controller with an `@Min` constraint on `@RequestParam long`
- **THEN** the correct answer identifies built-in method validation rather than requiring a proxy

### Requirement: Payment redelivery question SHALL specify safe idempotency

The charge idempotency answer SHALL state that a stable unique key and the effect must be enforced atomically, or by the payment provider's equivalent idempotency guarantee, rather than through a racy check-then-charge.

#### Scenario: Two consumers process duplicate event

- **GIVEN** redelivered charge messages run concurrently
- **THEN** only one charge may succeed for the same stable payment key

### Requirement: Garbage collection question SHALL avoid unproved memory-leak certainty

A rising live-set floor after full GC SHALL be described as evidence of retention growth warranting diagnosis, potentially a cache or a leak, without presuming every retained object is unwanted.

#### Scenario: Old-generation occupancy rises after GC

- **GIVEN** an increasing retained live set
- **THEN** the answer recommends heap histograms/dumps and cause analysis before increasing capacity

### Requirement: Source-only content changes SHALL remain unapproved

The repair SHALL retain the original four answer keys and SHALL NOT alter `review.json` or invent a review digest. It SHALL leave the pack DRAFT, with issue #392 and human accessibility #428 open.

#### Scenario: Editorial gate after source correction

- **GIVEN** this change edits learner-facing questions
- **THEN** subsequent AI-reviewer approvals require separate content-bound V2 recording after merge

# content-review-integrity Specification

## Purpose
Ensure interview content makes accurate technical claims and that each revised question carries a truthful, digest-matched editorial verdict rather than inheriting a stale approval.

## Requirements

### Requirement: Spring strategy registry examples must use supported injection
The interview content SHALL distinguish Spring's injection of matching
strategy beans into a typed collection from the explicit construction of a
Map keyed by the PaymentType enum. It SHALL NOT assert that Spring automatically
constructs that enum-keyed map. The explanation SHALL reference the specific
official Spring Framework autowiring documentation.

#### Scenario: The learner selects Strategy for OCP
- **WHEN** the learner reads option B in the OCP question
- **THEN** it describes injecting a strategy list, explicitly building a
  registry and dispatching without a new PaymentService conditional.

### Requirement: Technical corrections receive a truthful versioned review
An amended question SHALL NOT inherit an earlier review of different text.
Its verdict SHALL be recorded with the V2 digest of its current source and
the actual reviewer identity, without suggesting human approval or publication.

#### Scenario: An AI reviewer approves a corrected question
- **WHEN** the reviewer checks all options against the official source
- **THEN** the review record names ai-reviewer, records the current digest,
  and leaves unrelated questions and the pack publication status unchanged.

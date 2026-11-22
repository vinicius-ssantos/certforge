## ADDED Requirements

### Requirement: Dependency recovery
Interview evidence and plan creation SHALL distinguish pending, failed and empty prerequisite catalogues and offer retry for failures without indefinite disabled-query loading.

#### Scenario: The prerequisite catalogue is empty or fails
- **WHEN** the prerequisite catalogue is empty or fails
- **THEN** a finite empty state or retryable error replaces loading

### Requirement: Private guided comparison
Guided writing SHALL remain in memory through reference comparison, warn before navigation discards it and clear on advancement or session closure. The text SHALL NOT enter requests or persistent storage.

#### Scenario: Reveal a guided reference after writing
- **WHEN** reveal a guided reference after writing
- **THEN** the original writing remains visible with the reference and leaving requires an explicit discard decision

### Requirement: Explicit completion and pending answers
Interview completion SHALL have distinct wording from abandonment. Mock submission SHALL count pending local selections and offer return to them without treating them as saved.

#### Scenario: Submit a mock containing a pending selection
- **WHEN** submit a mock containing a pending selection
- **THEN** the confirmation identifies pending selections and offers return to the first pending item

### Requirement: Honest learning signals
Plans SHALL NOT promise unsupported weight editing. Evidence SHALL offer topic-specific practice and disclose unavailable original-answer navigation. Progress SHALL describe observed practice with attempt counts rather than claim mastery.

#### Scenario: Read a plan, evidence or a small-sample result
- **WHEN** read a plan, evidence or a small-sample result
- **THEN** wording matches available controls and actions preserve topic context

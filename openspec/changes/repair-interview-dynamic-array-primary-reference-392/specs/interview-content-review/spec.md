## ADDED Requirements

### Requirement: Source correction and editorial verdict are separate transitions

When an interview question's references are replaced to meet an authoritative-evidence gate, the source-correction PR SHALL preserve any existing editorial status and SHALL NOT insert an AI review verdict as a side effect.

#### Scenario: Unreviewed dynamic-array question receives stronger sources

- **GIVEN** `iv154-dynamic-array-growth` has no entry in the pack's `review.json`
- **WHEN** its references are replaced with verifiable university lecture material explaining table doubling
- **THEN** the question's existing answer and options remain unchanged
- **AND** the pack stays DRAFT and the question remains unreviewed until a subsequent independent exact-source V2 assessment.

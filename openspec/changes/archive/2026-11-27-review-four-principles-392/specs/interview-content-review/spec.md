## ADDED Requirements

### Requirement: Four interview principles SHALL each receive a source-backed, exact-content individual V2 review

The product-policy duplication, speculative payment abstraction, concrete MySQL dependency, and consumer-driven contract questions SHALL be checked individually for correctness and distractor exclusivity against original technical references. The resulting `review.json` entries SHALL each be recorded by the canonical `record-ai-review.mjs` script using V2 digests against current question and manifest. The pack SHALL remain unpublished and `DRAFT` while unanswered questions exist.

#### Scenario: DRY and avoiding premature abstraction

- **GIVEN** three copies of a shared email-format policy or a speculative payment-provider abstraction
- **THEN** answer D consolidates the one rule and answer A defers speculative unneeded capabilities.

#### Scenario: Control dependencies and service contracts

- **GIVEN** service code directly constructs its MySQL repository or a consumer relies on a portion of provider API
- **THEN** answer C decouples persistence behind an injected abstraction and answer A encodes provider-verifiable consumer contracts.

#### Scenario: Auditability and publication

- **GIVEN** reviews are recorded against the current interview manifest
- **THEN** independent V2 digests, disclosed `ai-reviewer`, `APPROVED`, date, and checklist are present for each verified question.
- **AND** existing reviewer entries and learner-facing content are untouched, with no human approvals, publication or deployment.

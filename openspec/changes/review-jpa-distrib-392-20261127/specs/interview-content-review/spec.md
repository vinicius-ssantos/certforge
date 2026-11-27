## ADDED Requirements

### Requirement: Twenty-eight Hibernate/JPA and distributed systems questions SHALL have independent content-bound V2 review evidence

Only the exact twenty-eight question identifiers documented in the per-question design audit SHALL receive `ai-reviewer` V2 approved records. Each record SHALL bind to the canonical current question, pack manifest, checked key, full explanation, primary source and all distractors; review artifacts SHALL never be bulk-generated from unverified answer flags.

#### Scenario: Hibernate and JPA persistence semantics

- **GIVEN** entity state, fetching, version, flush, projection and query-derivation questions
- **WHEN** the reviewer independently verifies the exact prompt and all four alternatives
- **THEN** the canonical V2 record SHALL include a content digest, date, reviewer identity and four-item checklist.

#### Scenario: Distributed reliability and consistency

- **GIVEN** timeout, tracing, circuit-breaker, saga, idempotency, CAP, bulkhead and consistency problems
- **THEN** their individual gabaritos SHALL be verified against original technical references before recording approval.

#### Scenario: Unverified source content

- **GIVEN** a source question overstates a default or guarantee
- **THEN** that question SHALL NOT be approved until separately corrected and rechecked.

#### Scenario: Publication safety

- **GIVEN** only a subset of 208 questions is reviewed
- **THEN** pack editorial status SHALL remain DRAFT; #392 and human #428 SHALL stay OPEN, and no deploy/publication occurs.

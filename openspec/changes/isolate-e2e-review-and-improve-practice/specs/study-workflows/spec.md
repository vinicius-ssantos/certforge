## ADDED Requirements

### Requirement: Separation of test fixtures from learner review data
Local release, review and end-to-end test stacks SHALL use separate database projects/volumes. E2E fixture seeding SHALL require a disposable test environment, and review stack startup SHALL NOT publish unreviewed or synthetic questions.

#### Scenario: Start review beside an existing release database
- **WHEN** a developer starts the isolated review stack with an existing release stack
- **THEN** the review uses its own volume and ports without changing release sessions, objectives or questions

#### Scenario: Launch E2E locally
- **WHEN** E2E global setup is invoked without disposable-environment opt-in
- **THEN** it fails before creating questions or modifying exam objectives

### Requirement: Resume announcements shall be transient
The learner SHALL receive a brief status when joining an existing practice or mock session, and SHALL NOT see stale resume notices throughout subsequent questions.

#### Scenario: Answer the first question after resuming
- **WHEN** a resumed practice session records a successful answer
- **THEN** its resume announcement disappears and answer feedback remains available

### Requirement: Study availability for general-knowledge topics
An authenticated learner SHALL be able to obtain learner-eligible published question counts for the topics of an active general-knowledge track, including nested topics. The response SHALL omit answer keys and editorial details, refuse unauthenticated access, and return not-found for an inactive or unknown general track.

#### Scenario: Active general track with mixed published coverage
- **WHEN** an authenticated learner opens its topics
- **THEN** practice is offered only on topics whose eligible published question count is greater than zero, without revealing any answer material

#### Scenario: Unknown or inactive general track
- **WHEN** an authenticated learner requests its topic availability
- **THEN** the endpoint reports not found without disclosing any unpublished content

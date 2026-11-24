## ADDED Requirements

### Requirement: Versioned testing-library interview references match the scope
An interview question about JUnit 5's test instance lifecycle SHALL cite
a fixed version of the official JUnit 5 documentation rather than a moving
current/latest link. It SHALL make clear whether the global lifecycle default
has been overridden, so a standard PER_METHOD answer is unambiguous.

#### Scenario: Review default JUnit 5 class instance state
- **WHEN** the learner encounters the JUnit Jupiter test instance question
- **THEN** it specifies no global lifecycle override and cites the versioned JUnit 5 guide
- **AND** the correct answer remains C (PER_METHOD), without editorial publication.

## Purpose

Help learners resume study, preserve unsubmitted mock choices, and follow up on practice results using authoritative session state and available study opportunities.

## ADDED Requirements

### Requirement: The timed mock shall retain a draft on navigation
The timed mock SHALL retain a draft on navigation.

#### Scenario: Navigate away from an unsaved question
- **WHEN** the learner chooses an option and returns to that question
- **THEN** the selection remains pending until the server accepts it

#### Scenario: A session becomes terminal
- **WHEN** the server closes or expires the session
- **THEN** its stored draft is removed and the result remains accessible

### Requirement: The learner shall have actions based on real study state
The learner SHALL have actions based on real study state.

#### Scenario: Select the next activity
- **WHEN** the home page has active sessions or due review
- **THEN** it offers continuation before review and keeps the catalogue accessible

#### Scenario: The mock is unavailable or a result is finalized
- **WHEN** the learner cannot start a mock or wants to improve after a result
- **THEN** practice remains available and the result can be narrowed to incorrect and unanswered questions

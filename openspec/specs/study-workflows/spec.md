# study-workflows Specification

## Purpose
Help learners resume study, preserve unsubmitted mock choices, and follow up on practice results using authoritative session state and available study opportunities.

## Requirements

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

### Requirement: Review practice shall respect the configured session size
The review queue SHALL expose the configured maximum number of questions per study session. The practice action SHALL start the first permitted batch of the selected topic after applying the active reason filter, preserve server priority order, and show the submitted batch size in its accessible and visible labels. Remaining loaded questions SHALL stay visible for later study.

#### Scenario: Expand a topic beyond one session
- **WHEN** a learner expands the queue to 40 questions in a topic and the configured session maximum is 20
- **THEN** the practice action submits only the first 20 revision IDs and all 40 questions remain visible before navigation

#### Scenario: Use a custom session policy and reason filter
- **WHEN** a deployment limits sessions to 7 questions and the learner filters a larger topic group by review reason
- **THEN** the action submits the first 7 matching revision IDs in server order and labels the action with 7

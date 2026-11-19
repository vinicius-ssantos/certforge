## ADDED Requirements

### Requirement: Review practice shall respect the configured session size
The review queue SHALL expose the configured maximum number of questions per study session. The practice action SHALL start the first permitted batch of the selected topic after applying the active reason filter, preserve server priority order, and show the submitted batch size in its accessible and visible labels. Remaining loaded questions SHALL stay visible for later study.

#### Scenario: Expand a topic beyond one session
- **WHEN** a learner expands the queue to 40 questions in a topic and the configured session maximum is 20
- **THEN** the practice action submits only the first 20 revision IDs and all 40 questions remain visible before navigation

#### Scenario: Use a custom session policy and reason filter
- **WHEN** a deployment limits sessions to 7 questions and the learner filters a larger topic group by review reason
- **THEN** the action submits the first 7 matching revision IDs in server order and labels the action with 7

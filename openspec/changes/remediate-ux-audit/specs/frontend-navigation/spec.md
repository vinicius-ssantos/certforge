## ADDED Requirements

### Requirement: Visible choices and safe confirmations
Choice controls SHALL expose persistent non-color selection indicators. Destructive confirmations SHALL initially focus cancellation and restore focus on dismissal.

#### Scenario: Select an option and open a destructive confirmation
- **WHEN** select an option and open a destructive confirmation
- **THEN** selection remains identifiable without color and cancellation receives initial focus

### Requirement: Contextual and compact navigation
Topic actions SHALL preserve topic context. Narrow-screen decision rows SHALL keep the topic and primary action together; mock navigation SHALL prioritize the question with a collapsible map.

#### Scenario: Open progress or a mock on a narrow screen
- **WHEN** open progress or a mock on a narrow screen
- **THEN** topic actions target that topic and the question is reachable before the expanded map

### Requirement: Catalogue and access orientation
The catalogue SHALL disclose empty availability before study calls to action and offer unobtrusive name/provider search. The brand SHALL link to the appropriate entry. Access help SHALL disclose a configured support route or its absence.

#### Scenario: Explore an empty catalogue or request access help
- **WHEN** explore an empty catalogue or request access help
- **THEN** no unavailable study action is promised and the next available step is stated

### Requirement: Editorial orientation
Editorial question titles SHALL identify content and revision. Authors SHALL be able to navigate form sections without losing entered fields.

#### Scenario: Open or edit a revision
- **WHEN** open or edit a revision
- **THEN** content identifies the page and section navigation retains fields

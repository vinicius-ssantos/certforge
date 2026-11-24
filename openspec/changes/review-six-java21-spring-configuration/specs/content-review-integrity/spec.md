## ADDED Requirements

### Requirement: Java Collections and Spring interview verdicts remain technically source-bound
A Java backend interview AI reviewer SHALL validate the exact question prompt,
all answer options and explanations against a primary Java or Spring reference
before recording a V2 digest tied to the current source. An answer SHALL NOT
be approved if a distractor explanation materially misstates the reference.
Recorded decisions SHALL disclose ai-reviewer and keep the interview pack
DRAFT until the remaining editorial queue is completed.

#### Scenario: Six Java and Spring Boot source-backed reviews
- **WHEN** the specific questions `iv286-arraylist-vs-linkedlist-access-pattern`, `iv288-self-invocation-bypasses-transactional-proxy`, `iv288-profile-specific-bean-missing-from-active-profile`, `iv288-component-scan-bean-not-found`, `iv288-property-source-precedence-env-vs-yaml`, and `iv288-transactional-propagation-required-vs-requires-new` are reviewed in that order
- **THEN** their exact correct keys respectively remain B, B, B, B, C, B
- **AND** every newly recorded V2 digest matches its corresponding unchanged question source
- **AND** all prior 40 review decisions remain intact
- **AND** `editorialStatus` is DRAFT, with no implied human acceptance or publishing.

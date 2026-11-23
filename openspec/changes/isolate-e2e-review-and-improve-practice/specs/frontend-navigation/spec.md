## ADDED Requirements

### Requirement: Catalogue search shall have a visible disclosure affordance
The catalogue SHALL indicate that name/provider search is expandable and SHALL keep its input accessible to keyboard users.

#### Scenario: Find a track
- **WHEN** a learner explores the catalogue with keyboard or mouse
- **THEN** the search summary visibly indicates expansion and opening it reveals an operable named search field

### Requirement: Practice sessions shall identify their track and topic
When catalogue data is available, the practice session SHALL show the current track and nested topic, including a link back to the correct track kind.

#### Scenario: Resume a nested topic session
- **WHEN** a learner resumes a practice question for a topic
- **THEN** the track is identified by name and links to its catalogue page and the topic is identified alongside the question

### Requirement: Unavailable certification practice shall not imply available questions
When per-topic published-question counts are available, the certification catalogue SHALL disable starting practice for a topic with zero published questions and SHALL display a readable explanation. If availability cannot be determined, the UI SHALL retain server-side validation rather than invent a count.

#### Scenario: An approved but empty certification catalogue
- **WHEN** no questions have been published for the selected certification topic
- **THEN** the learner sees an unavailable practice control and a reason, rather than starting an empty session

### Requirement: Empty catalogue states shall guide rather than mislead
The study home SHALL guide learners to inspect available content. An all-empty track SHALL show one clear notice instead of repeated per-topic messages. A partially available track SHALL disable individual unavailable topics and explain their status. The catalogue SHALL clarify that UI language does not translate authored content.

#### Scenario: Certification topics without questions
- **WHEN** all certification topics have zero published questions
- **THEN** one track-level status explains unavailable study and all zero-content practice actions remain disabled

#### Scenario: Partially available general knowledge track
- **WHEN** some general topics have published questions and others do not
- **THEN** only the unavailable actions are disabled and learners can still start eligible topics

### Requirement: Secondary study navigation shall use the product-action visual language
Navigation to the review queue, learner progress, and in-progress study sessions SHALL remain native links with their original destination and accessible name, but SHALL be visually distinguished from inline editorial hyperlinks. These actions SHALL use neutral text, a subtle control outline, a consistent minimum touch target, a decorative, non-text chevron and clear hover and keyboard focus cues; the shared styling SHALL work in dark mode and forced-colors mode.

#### Scenario: Study dashboard secondary actions
- **WHEN** a learner views the queue and progress actions on the study dashboard
- **THEN** those links use the tertiary product-action appearance and still navigate to their original routes

#### Scenario: Resume a session from history
- **WHEN** a learner opens History with an ongoing practice or mock session
- **THEN** a distinct tertiary action offers continuation while preserving its link destination, keyboard support and the accessible session name

### Requirement: Touch-friendly links in study data tables and return navigation
Navigational row headings in study history and progress tables, and stand-alone
return links SHALL have a minimum 44 CSS px clickable height without changing
their original URL, accessible name, semantic anchor element or table header
association. Their visual presentation SHALL align with the existing neutral
tertiary-action system; inline editorial references SHALL remain ordinary links.

#### Scenario: History table on desktop and small screens
- **WHEN** a learner navigates a recorded study session using a linked row title
- **THEN** the link has a touch-friendly target and keyboard-visible focus
- **AND** the destination and accessible name remain unchanged

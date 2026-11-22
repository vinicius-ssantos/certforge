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

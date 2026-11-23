## ADDED Requirements

### Requirement: Interview delegation examples account for indirect mutations
The Java backend interview question on composition over inheritance SHALL explain
that replacing a subclass with a List delegate does not automatically intercept
all mutations. It SHALL distinguish direct `add`/`addAll` calls from positional
inserts and additions through list iterators or writable sublist views.

#### Scenario: A learner chooses a delegating logging wrapper
- **WHEN** the learner selects option A in the EventLoggingList question
- **THEN** the answer describes intercepting or preventing all supported
  insertion paths, including `ListIterator.add` and writable sublists
- **AND** the authoritative Java SE API references cover those mutation routes.

### Requirement: Unreviewed content remains unapproved after source edits
A technical correction to an unreviewed interview question SHALL NOT grant
an editorial approval without a separate genuine review of the corrected text.

#### Scenario: Correct an unanswered technical review finding
- **WHEN** an unreviewed interview question is edited to resolve a finding
- **THEN** its review.json entry remains absent until a proper digest-matched
  verdict is intentionally recorded, and the pack stays DRAFT.

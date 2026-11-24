# content-review-integrity Specification

## Purpose
Ensure interview content makes accurate technical claims and that each revised question carries a truthful, digest-matched editorial verdict rather than inheriting a stale approval.

## Requirements

### Requirement: Spring strategy registry examples must use supported injection
The interview content SHALL distinguish Spring's injection of matching
strategy beans into a typed collection from the explicit construction of a
Map keyed by the PaymentType enum. It SHALL NOT assert that Spring automatically
constructs that enum-keyed map. The explanation SHALL reference the specific
official Spring Framework autowiring documentation.

#### Scenario: The learner selects Strategy for OCP
- **WHEN** the learner reads option B in the OCP question
- **THEN** it describes injecting a strategy list, explicitly building a
  registry and dispatching without a new PaymentService conditional.

### Requirement: Technical corrections receive a truthful versioned review
An amended question SHALL NOT inherit an earlier review of different text.
Its verdict SHALL be recorded with the V2 digest of its current source and
the actual reviewer identity, without suggesting human approval or publication.

#### Scenario: An AI reviewer approves a corrected question
- **WHEN** the reviewer checks all options against the official source
- **THEN** the review record names ai-reviewer, records the current digest,
  and leaves unrelated questions and the pack publication status unchanged.

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

### Requirement: Runnable Java interview examples compile as complete programs
When a Java interview prompt presents an entire program whose console output
is the subject of a question, the program SHALL compile for the designated
Java release without requiring the learner to guess missing method wrappers.
The correction SHALL preserve the unique valid answer and its explanation.

#### Scenario: Review class instance state and method dispatch
- **WHEN** the learner compiles the Counter and OverloadDemo programs with Java 21
- **THEN** both compile and run without preview features
- **AND** their outputs are `2 1` and `Special: hello`, respectively
- **AND** the correct options remain C and A without auto-publishing the pack.

### Requirement: Versioned testing-library interview references match the scope
An interview question about JUnit 5's test instance lifecycle SHALL cite
a fixed version of the official JUnit 5 documentation rather than a moving
current/latest link. It SHALL make clear whether the global lifecycle default
has been overridden, so a standard PER_METHOD answer is unambiguous.

#### Scenario: Review default JUnit 5 class instance state
- **WHEN** the learner encounters the JUnit Jupiter test instance question
- **THEN** it specifies no global lifecycle override and cites the versioned JUnit 5 guide
- **AND** the correct answer remains C (PER_METHOD), without editorial publication.

### Requirement: AI-reviewed OOP and Map questions retain source-backed exact verdicts
The Java backend interview pack SHALL record `AI_APPROVED` verdicts only
for individually verified questions with exact source-matched V2 review digests,
clear `ai-reviewer` attribution, and primary references for technical claims.
The questions about HashMap ordering, encapsulation and abstract classes
SHALL retain exactly one defensible correct option each, respectively A, B and D.

#### Scenario: A source-backed review batch is recorded
- **WHEN** the three verified Java/OOP questions gain AI review verdicts
- **THEN** each review matches the current V2 digest, references and answer key
- **AND** unrelated review entries remain intact and the pack remains DRAFT.

### Requirement: AI review batches contain only individually verified decisions
The Java backend interview pack SHALL record an AI review verdict only for
questions whose correct answer, distractors, explanations and primary
references were individually checked; it SHALL use the current V2 digest
and the disclosed `ai-reviewer` identity. An AI review batch SHALL NOT
change the pack editorialStatus to published while other questions remain
unreviewed or require correction.

#### Scenario: A reviewed batch contains three verified questions
- **WHEN** DIP versus DI, ConcurrentHashMap check-then-act, and Spring Boot
  ConditionalOnMissingBean questions receive technically justified verdicts
- **THEN** review.json records only those three new AI_APPROVED entries with
  source-matched V2 digests and leaves all other verdicts unchanged
- **AND** the interview pack remains DRAFT.

### Requirement: Corrected interview questions receive independent V2 AI reviews
The Java backend interview pack SHALL record a `review.json` verdict only
after verifying the corrected question's exact source, answer key,
distractors, explanatory rationale and primary references.
An approved question SHALL have its current V2 source digest and
explicit `ai-reviewer` attribution, without implying human sign-off.

#### Scenario: Six corrected and primary-sourced questions are reviewed
- **WHEN** the four recently corrected Java/JUnit questions and the two independently checked OOP/testing/DDD concepts receive AI verdicts
- **THEN** their six answer keys remain C, A, A, C, A, A respectively
- **AND** all other review entries remain unchanged and the pack is still DRAFT.

#### Scenario: Unreviewed content remains outside the fast lane
- **WHEN** the 208-question pack has fewer than 208 current verified approvals
- **THEN** the editorial status remains DRAFT and the unreviewed remainder is not represented as approved.

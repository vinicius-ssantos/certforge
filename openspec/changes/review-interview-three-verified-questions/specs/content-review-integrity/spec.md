## ADDED Requirements

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

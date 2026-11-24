## ADDED Requirements

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

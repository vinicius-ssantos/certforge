## ADDED Requirements

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

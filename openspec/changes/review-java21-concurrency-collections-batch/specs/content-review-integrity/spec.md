## ADDED Requirements

### Requirement: Java concurrency and priority-queue reviews use exact verified sources
A Java backend interview AI review verdict SHALL correspond to the question's
current V2 digest and an independently verified correct answer, distractors,
explanatory rationale and authoritative Java or JLS reference.
The reviewer SHALL be disclosed as ai-reviewer, never as a fabricated human.
No question SHALL be promoted to published while the pack is incomplete.

#### Scenario: Six Java 21 concurrency and collections questions receive approved verdicts
- **WHEN** the questions `iv286-reentrantlock-vs-synchronized`, `iv286-synchronized-happens-before`, `iv286-system-gc-no-guarantee`, `iv286-stream-laziness-short-circuit-infinite`, `iv286-deadlock-inconsistent-lock-order`, and `iv154-heap-priority-queue` are individually reviewed in that exact order
- **THEN** their correct keys are respectively B, A, B, A, B and D
- **AND** the six V2 digests match current source content, without changing the 32 existing entries
- **AND** `editorialStatus` remains DRAFT; no deployment or human sign-off is implied.

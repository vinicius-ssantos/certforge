## ADDED Requirements

### Requirement: SOLID, simplicity, testing and DDD interview items SHALL have independent exact-content V2 review evidence

The twenty explicitly identified questions in this change's technical design SHALL each receive a separate approval record only after independently inspecting every answer and distractor, overall explanation and primary published reference. The canonical review tool SHALL bind approval to the exact question content and current pack manifest. Learner-facing questions, answer keys and pack metadata SHALL remain unchanged in the review-only change.

#### Scenario: Independent principles and testing reviews

- **GIVEN** a reviewer has verified the twenty listed prompts, options, explanations and primary references
- **WHEN** the canonical V2 recorder is applied separately for each item
- **THEN** each new review record contains an exact digest, disclosed `ai-reviewer`, review date, `APPROVED` verdict and four integrity checklist items.

#### Scenario: Unsafe concurrency wording is excluded

- **GIVEN** the `iv157-protect-invariant-aggregate` explanation implies that a normal transaction alone prevents concurrent lost updates
- **THEN** that item SHALL not receive an APPROVED record until its content is separately corrected and reverified.

#### Scenario: Publication and acceptance safety

- **GIVEN** this is one partial batch for issue #392
- **THEN** the pack remains `DRAFT`, issue #392 and human a11y issue #428 remain OPEN, and no publication/deploy occurs.

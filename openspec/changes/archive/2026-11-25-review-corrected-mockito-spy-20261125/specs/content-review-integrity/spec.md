## ADDED Requirements

### Requirement: Corrected Mockito-specific test spy sources receive independent review

A Java interview question comparing mock, stub, fake and spy SHALL clarify whether it refers to the Meszaros/Fowler recording-stub test spy or to Mockito.spy(Object) with copied-state real-method behavior. An `AI_APPROVED` verdict SHALL occur only after a separate, independent review of the **exact merged corrected question source**, including all options, explanatory rationale and authoritative references, with current V2 SHA-256 digest and truthful ai-reviewer attribution.

#### Scenario: Review the fixed Mockito.spy question after its source correction
- **WHEN** `iv155-mock-stub-fake-spy` receives an independently verified AI review after PR #472
- **THEN** unique answer D explicitly refers to `Mockito.spy(existingObject)` rather than generalizing all test spies
- **AND** the review digest matches the current post-repair source, with `ai-reviewer` named as the actual reviewer
- **AND** all prior 54 decisions remain unchanged
- **AND** issue #392 remains open and the pack stays DRAFT, with no human-signoff, publication or deployment.

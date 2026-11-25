## ADDED Requirements

### Requirement: Mockito-specific spy questions distinguish recording stubs from copied-state real-method spies

When a Java testing question claims the real-method behavior of `Mockito.spy(Object)`, its learner-facing prompt SHALL **explicitly scope** the term to Mockito and distinguish the classic Meszaros/Fowler test-spy meaning (a recording stub). It SHALL NOT assert that all test spies delegate calls or invoke real methods by default. A corrected question SHALL remain unapproved until the exact merged source receives a separate verified V2 AI-reviewer verdict.

#### Scenario: Interpret a Mockito spy and classic test spy correctly
- **WHEN** a learner evaluates `iv155-mock-stub-fake-spy`
- **THEN** the prompt specifies `Mockito.spy(existingObject)` rather than an undefined generic spy
- **AND** option D preserves its unique correct key while stating that Mockito copies state and calls unstubbed real methods on the spy, not by delegation to the original
- **AND** the rationale distinguishes the classic recording-stub test spy from Mockito's concrete implementation using primary and author-origin sources
- **AND** no new review verdict, human approval or publication occurs in the source correction PR.

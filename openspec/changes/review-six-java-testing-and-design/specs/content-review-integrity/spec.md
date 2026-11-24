## ADDED Requirements

### Requirement: Testing and asynchronous interview reviews preserve primary-source semantics
An AI reviewer approving Java interview questions about testing, concurrency,
design principles, data structures or Spring scopes SHALL independently
verify the current entire question, answer distractors and explanation
against author-origin or first-party technical sources. Source-bound V2
digests SHALL reflect exact current source text; uncorrected technical
overclaims SHALL prevent review rather than receive blanket approval.

#### Scenario: Six distinct Java and testing sources receive vetted decisions
- **WHEN** the questions `iv154-stack-lifo-use-case`, `iv155-flaky-vs-deterministic`, `iv286-completablefuture-exception-propagation`, `iv152-similar-but-different-rules`, `iv288-request-scope-proxy-mode`, and `iv155-when-mocking-hurts` receive individually verified verdicts in that order
- **THEN** their correct keys respectively remain D, B, C, B, A, D
- **AND** the six current V2 SHA-256 digests match their source objects
- **AND** all previous 47 reviews remain unchanged, and reviewer identity is disclosed as ai-reviewer
- **AND** `iv286-completablefuture-async-thread` and `iv155-mock-stub-fake-spy` remain without verdicts until corrected
- **AND** the pack remains DRAFT with issue #392 open, no publication, deploy or human sign-off.

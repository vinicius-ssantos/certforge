## ADDED Requirements

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

## ADDED Requirements

### Requirement: CompletableFuture continuation questions describe permitted executor behavior
A Java 21 interview question contrasting `thenApply` with
`thenApplyAsync(fn, executor)` SHALL not guarantee the thread identity for
non-async completion actions. The explanation SHALL account for execution by
the completing thread or another caller of a completion method, and SHALL
distinguish this from executing a continuation via a supplied explicit Executor.

#### Scenario: Compare a non-async and explicit-executor async continuation
- **WHEN** a continuation is registered using `thenApply` on a stage from `supplyAsync`
- **THEN** the non-async function is not guaranteed to run on only the source executor thread
- **AND** `thenApplyAsync(fn, executorB)` uses the supplied executorB for the function
- **AND** the correct key remains D, with no premature review verdict before correcting the source.

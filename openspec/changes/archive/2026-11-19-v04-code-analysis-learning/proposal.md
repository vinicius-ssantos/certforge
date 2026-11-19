## Why

The v0.4.0 Code Analysis roadmap promises useful learning about compilation, runtime behavior and program output—not an interactive Java executor. The audited `main` already has deterministic proof for 150 Java SE 21 content-pack examples and CSP-compatible Java syntax highlighting; repeating those tasks would misallocate effort. The remaining question is whether explanations and learner follow-up are clear, complete and appropriately withheld during active mock exams.

## What Changes

- Establish a measured baseline and a representative, owner-approved gap audit for code-centric practice and finalized mock feedback.
- Define how reviewed explanations connect source, the Java language rule, expected compilation/runtime behavior and distractor misconceptions, reusing existing question fields where possible.
- Verify that code-specific feedback remains accessible and never leaks solutions during an active timed mock.
- Implement only gaps demonstrated in the audit, with deterministic content evidence and formal human editorial approval. No implementation or release is authorized by this planning PR.

## Capabilities

### New Capabilities

- `code-analysis-feedback`: approved explanations and source-to-result learning flow for fixed Java examples, after feedback is permitted.

### Modified Capabilities

None initially. The existing `question-presentation` contract already specifies highlighting and line-ending behavior. Any genuinely missing rendering behavior must be introduced through a reviewed spec delta, not restated as unimplemented here.

## Impact

Potentially existing learner feedback and mock result components, the Java SE 21 content pack, editorial evidence/checklists and browser tests. No database migration, new arbitrary-execution endpoint, additional external service or credential change is proposed.

## Scope decision

This is a **proposal** for milestone v0.4.0, not release approval. Evidence and constraints: `docs/release/v0.4.0-scope-baseline.md`, roadmap, ADR 0006/0011 and issue #391.

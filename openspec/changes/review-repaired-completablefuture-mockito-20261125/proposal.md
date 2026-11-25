## Why

Issue #392 is an individual, primary-source-backed editorial review of all 208 Java backend interview questions. Before this change, 53 current V2 AI approvals existed, and 155 questions were pending. Two previously blocked questions were **corrected first, without review verdicts**, in separately merged PRs #457 (`CompletableFuture`) and #458 (`Mockito.spy`), after 8/8 checks and Codex review each. The exact corrected sources now require independent V2 decisions.

## What Changes

Record precisely two individually verified AI reviewer V2 decisions against the sources as merged on `main`:
- `iv286-completablefuture-async-thread`: **D**; non-async `thenApply` actions may run on the completing thread or another caller of a completion method, whereas `thenApplyAsync(fn, executorB)` uses the explicit executor.
- `iv155-mock-stub-fake-spy`: **D**; stub/mock/fake/spy test-double roles, and Mockito's normal `spy(Object)` copies state rather than forwarding calls to the original.

## Boundaries

Exactly two new entries in `content/java-backend-interview/review.json` plus this scoped OpenSpec. All **53** previous verdict entries are preserved and `reviewer: ai-reviewer` reflects the actual reviewer, not the owner. After integration **55/208** individually reviewed with **153 pending**; #392 stays OPEN and pack `editorialStatus: DRAFT`. No question.json edits, pack publication, deployment, UI changes, unrelated human accessibility acceptance (#428), or mass approval.

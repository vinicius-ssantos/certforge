## Why

Issue #392 requires source-bound review of the 208-question Java backend interview pack. Source correction PR #457 fixed the non-async CompletableFuture execution-thread overclaim without assigning a review. PR #458 similarly repaired Mockito spy copied-state semantics, **but the independent Codex review of this editorial PR identified a new P2**: its generic prompt conflates the Fowler/Meszaros recording-stub meaning of a test spy with Mockito's default real-method behavior. That second question must be corrected in a separate source PR before any approval.

## What Changes

Record exactly **one** individually checked AI reviewer V2 verdict against the **already merged** source of `iv286-completablefuture-async-thread`:
- Answer **D**: non-async `thenApply` dependent actions can run on the completing thread or another caller of a completion method; `thenApplyAsync(fn, executorB)` uses its explicitly provided executor, without a particular worker-thread identity guarantee.
- Current source digest `sha256:d58aa0f4430128f4c26b1085acc85c90e8368f258a843d234d2f3f9f568066ad`.
- Review is attributed truthfully to `ai-reviewer`; all 53 preceding verdict objects are unchanged.

**Explicit exclusion:** `iv155-mock-stub-fake-spy` receives NO verdict in this PR; fix its learner-facing generic spy-versus-Mockito ambiguity in a new correction-only PR before separate post-repair review.

## Boundaries

One added V2 review entry plus this OpenSpec. If merged, **54/208** individually reviewed, **154 pending**; issue #392 remains OPEN and `editorialStatus` stays DRAFT. No `question.json`, `pack.json`, application, CI, deployment or publication edits. Issue #428 accessibility acceptance remains separately open and untouched.

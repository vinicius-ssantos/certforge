## Why

The source-only PR #458 corrected Mockito.spy(Object) copied-state/non-delegation behavior but retained an ambiguity: a generic `test-double terminology` prompt still made a spy's default real-method execution sound universal. Independent Codex P2 on review PR #471 identified a taxonomy conflict: Martin Fowler's Meszaros-derived **test spy is a recording stub**, whereas Mockito's concrete `spy(existingObject)` uses copied state with unstubbed real-method calls. PR #471 removed the premature Mockito approval. A new exact source correction is necessary before separate editorial review.

## Change

- Scope the **learner-facing prompt explicitly to `Mockito.spy(existingObject)`** and distinguish it from the classic recording-stub test spy.
- Update correct option **D** to state copied state, real-method defaults and no delegation to the original; retain the unique correct answer key D and incorrect option texts A/B/C.
- Update overall explanation and wrong-option B/C rationales to preserve this distinction and avoid unscoped generalization.
- Keep pinned first-party Mockito 5.24.0 and author-origin Fowler references; no review verdict is granted in this correction.

## Boundaries

Only `iv155-mock-stub-fake-spy/question.json` and this OpenSpec change. No `review.json`, `pack.json`, app, CI, deployment or publication edits. Issue #392 remains OPEN with **53/208** reviews on main at branch creation; PR #471 separately proposes one CompletableFuture-only review (conditional 54/208). Human UX accessibility issue #428 remains open and unrelated. A fresh, independent V2 digest is required *after this source-only repair is merged*.

## Independent post-repair CompletableFuture review

- Question: `iv286-completablefuture-async-thread`, unique correct answer **D**.
- Exact corrected source on `main`: Git blob `81a38e97a3073f4e9610b770b9808a2e0025937d`, merged by source-only PR #457 at `defe04783c296a028135e2bce73baba73dfd3d9c`.
- Primary reference: official Oracle Java SE 21 `CompletableFuture` Javadoc, https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/util/concurrent/CompletableFuture.html
- Technical check: dependent non-async actions **may** be performed by the completing thread or another caller of a completion method; inline execution after completion is possible. `thenApplyAsync(fn, executorB)` uses the supplied executor, not a promised specific worker-thread ID.
- Distractor **A** wrongly ignores the explicit executor; **B** wrongly guarantees original caller thread; **C** wrongly claims async executes synchronously outside the executor; **D** correctly contrasts the permitted non-async execution paths with supplied-executor execution. Full prompt, all four alternatives, individual explanations and overall rationale checked.

### Exact V2 evidence

The canonical `content/manifest-pack.mjs::reviewDigestV2` ordered JSON tuple was independently SHA-256-hashed with UTF-8 serialization after validating the `sha256("abc")` test vector and the previously approved `iv155-when-mocking-hurts` digest.

`iv286-completablefuture-async-thread` → `sha256:d58aa0f4430128f4c26b1085acc85c90e8368f258a843d234d2f3f9f568066ad`.

All **53** previous V2 decisions are retained. No question text is modified by this review, and the interview pack remains DRAFT.

### Deliberate exclusion based on independent Codex P2

`iv155-mock-stub-fake-spy` is **not** approved. Although its copy-state behavior for `Mockito.spy(Object)` was corrected by #458, the learner-facing generic test-double question still describes real-method default as a general test spy property. Martin Fowler's *Mocks Aren't Stubs* (https://martinfowler.com/articles/mocksArentStubs.html) uses the classic Meszaros meaning: a **recording stub**. Mockito 5.24.0's concrete `spy(Object)` (https://javadoc.io/static/org.mockito/mockito-core/5.24.0/org.mockito/org/mockito/Mockito.html) can invoke unstubbed real methods on the spy's copied state, not forward to original. The phrase `(as with Mockito.spy)` in option D does not sufficiently scope its generic assertion. A separate source-only correction must clarify the prompt, option D and rationale before a fresh independent digest-bound review. This is the P2 finding raised on PR #471, not a human sign-off.

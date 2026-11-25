## Source verification

The Java SE 21 `java.util.concurrent.CompletableFuture` Javadoc says: non-async dependent actions **may be performed by the thread that completes the future, or by any other caller of a completion method**. In contrast, explicit `thenApplyAsync(function, executorB)` uses the supplied executor for the dependent action. The contract concerns executor selection, not a guaranteed worker thread name.

The earlier option D and overall rationale were too narrow when they stated a plain continuation runs on whichever thread completed the source stage, while allowing an inline caller only if the source was already completed. Correct option D retains the intended distinction but now explicitly includes other completion-method callers.

### Independent OpenJDK 21 smoke test

Compiled with `javac --release 21` on OpenJDK 21.0.12.1:
- `CompletableFuture.supplyAsync(() -> "input", executorA).thenApply(...).join()` produced `plainThenApplyThread=main` when the upstream stage had already completed before continuation registration.
- The corresponding `thenApplyAsync(..., executorB)` produced `explicitAsyncThread=parse-B`, the thread supplied by executorB.
- A separate exceptional-completion test produced `thenApplyCalls=0` and `thenAcceptCalls=0` after completing upstream exceptionally; this sanity-checks general continuation semantics, but is not used as proof of the thread-selection rule.

The smoke test illustrates permitted outcomes, but **does not prove every possible non-async scheduler interleaving**; the authoritative thread selection contract is the versioned Java 21 Javadoc itself.

### Editorial separation

Answer **D** remains correct. Its source-bound V2 SHA-256 digest changes, so the new digest must be recomputed from the exact merged question source in a **separate review PR**. Leave `review.json` untouched in this repair PR, `editorialStatus` DRAFT and issue #392 OPEN.

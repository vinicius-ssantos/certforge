## Why

The ongoing individual AI review for issue #392 found that the unreviewed `iv286-completablefuture-async-thread` question overstates the thread choice for plain `thenApply`. The question describes its action as running on *whichever thread completed the previous stage*, but Java SE 21 `CompletableFuture` Javadoc also permits a **different caller of a completion method** to execute a non-async dependent action. A continuation registered after the source completes may also execute inline in the registering thread. Accurate wording is necessary before source-bound V2 approval.

## What Changes

- Keep the example comparing `supplyAsync(fetch, executorA).thenApply(parse)` with `thenApplyAsync(parse, executorB)`.
- Rephrase correct option **D**, its explanation, and the overall rationale to state the precise permitted non-async execution threads while preserving explicit executorB selection for async.
- Correct distractor B's explanatory assumption to avoid promising a single thread.
- Keep all other options, keys and references unchanged. No new review verdict in this source correction PR.

## Boundaries

Only one unreviewed `question.json` and this scoped OpenSpec change. Issue #392 remains open, `pack.json` DRAFT, UX #428 open; no content publication, fake human sign-off or deployment. Recompute exact post-repair V2 digest **only in a subsequent source-review PR after this correction is merged**.

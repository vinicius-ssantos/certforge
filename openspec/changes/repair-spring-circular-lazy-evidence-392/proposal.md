## Why

During individual review of `iv288-circular-dependency-two-beans` in issue #392, the existing citation documents circular dependencies but not the exact behavior of `@Lazy` at a constructor injection point. The explanation also incorrectly calls the resulting graph a tree, though breaking cycles yields a DAG, not necessarily a tree.

## What changes

Add official Spring Framework `@Lazy` API documentation as a second primary citation and change `tree` to `acyclic` in the explanation. Keep correct option D and all other editorial data unchanged. Do not record any AI or human approval in this source-repair PR.

## Impact

One source-backed question.json and OpenSpec files. Pack DRAFT, no deploy, no changes to `review.json`.

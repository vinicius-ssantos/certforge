## Why

Three Java Backend Interview JPA questions plus one design-pattern question in issue #392 have answer explanations that overclaim guarantees of Spring Data pagination, JPA pessimistic locking or native result mapping. The source text must be corrected before any AI V2 approval.

## Change

- `iv290-pageable-page-count-query` key C: explain `Page` total-count metadata typically uses a COUNT query, but PageableExecutionUtils may omit it when the total can be inferred (e.g. partial page), rather than claiming two SQL statements on every invocation.
- `iv290-pessimistic-write-lock-when-needed` key D: explain PESSIMISTIC_WRITE blocks competing writers/conflicting row locks but not every ordinary MVCC snapshot SELECT.
- `iv290-query-jpql-vs-native-tradeoffs` key B: explain dialect-portability trade-off and supported native scalar, Tuple, projection and DTO-result mapping options, rather than asserting @SqlResultSetMapping is mandatory.
- `iv156-template-method-report-pipeline` key C: fix the false claim that Strategy composition cannot enforce a fixed sequence; rewrite alternative A to explicitly lack a shared run() skeleton and acknowledge that another form of Strategy composition *can* preserve the same order. Codex found this P2 defect during PR #520 and the approval was withdrawn.

Source-only: original answer keys remain C/D/B, no `review.json`, no human approvals or DRAFT pack/publishing changes. Individual V2 review will be a separate PR after source correction merge.

## Why

Issue #392 tracks individual, source-bound review of 208 Java backend interview questions. After PR #453 merged, 47 V2 AI-reviewed entries existed and 161 were pending. Six additional questions across data structures, test reliability, CompletableFuture exceptional completion, DRY design, Spring request scopes and brittle Mockito tests were independently evaluated against their full prompts, all four answer alternatives, explanations and primary documentation. Incorrect or ambiguous questions are explicitly excluded rather than bulk approved.

## What Changes

Record precisely six genuine AI-attributed `AI_APPROVED` decisions with current V2 source digests:

1. `iv154-stack-lifo-use-case`: D — LIFO matching of nested brackets.
2. `iv155-flaky-vs-deterministic`: B — uncontrolled nondeterminism as the cause of flaky tests.
3. `iv286-completablefuture-exception-propagation`: C — downstream dependent stages are skipped after exceptional completion.
4. `iv152-similar-but-different-rules`: B — distinct independently-owned business rules should not be abstracted solely because code happens to match.
5. `iv288-request-scope-proxy-mode`: A — without scoped proxy, eager singleton constructor injection cannot resolve request-scoped dependency outside an active request.
6. `iv155-when-mocking-hurts`: D — exact internal interaction assertions make tests fragile under semantics-preserving refactors.

## Boundaries

Only `content/java-backend-interview/review.json` and this OpenSpec change. All 47 existing reviews remain unchanged, every new decision has `reviewer: ai-reviewer`. On integration total becomes **53/208**, leaving **155** unreviewed. Pack DRAFT, issue #392 OPEN, UX issue #428 OPEN, no publication/deploy or human approval claim.

Explicitly excluded `iv286-completablefuture-async-thread` (overly restrictive description of non-async continuation-thread possibilities; separate source repair branch prepared), and `iv155-mock-stub-fake-spy` (incorrect claim Mockito spy delegates calls to the original instance, whereas Mockito copies object state; issue #392 records the blocker). Neither receives a verdict in this batch.

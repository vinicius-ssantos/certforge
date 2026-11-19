## Context
ReviewQueue supports an independent display limit of 100, while StudyProperties configures the maximum number of revisions accepted per session. The current practice action conflates display and session sizes.

## Goals / Non-Goals
Allow every loaded topic to start a valid batch with an accurate action label. Changing review priority, persisted attempts, editorial approval and study policy is outside this correction.

## Decisions
Expose the existing maximum through the public StudyLimits read contract and add maxSessionQuestions to the queue response. ReviewService depends only on the public study API. Slice each topic after applying the current reason filter and before building the practice action. Display all loaded items, but use the batch size for both button labels and request contents. For an older cached response missing the field, use one question as a conservative compatibility fallback rather than guessing the deployment policy.

## Risks / Trade-offs
The queue response is additive; cached clients continue to work. A policy change between reading the queue and starting a session is still validated by the server. Tests must cover non-default limits, a queue expansion beyond 20 items, and filtering before batching.

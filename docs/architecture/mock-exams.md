# Mock Exams

Issue: #97 — build a timed 1Z0-830 mock-exam mode without weakening the guarantees of ordinary study sessions.

## Why this is a separate mode

Topic practice gives feedback after every accepted answer. A mock exam must keep the answer key hidden until the run closes, preserve one fixed set and order of questions, enforce a server-side deadline and grade unanswered questions as misses in the final score.

Chaining ordinary practice sessions would break that invariant: the ordinary attempt endpoint returns correctness, explanations and references immediately. Mock exams are consequently a distinct study aggregate. They reuse the catalog and published question revisions, but not the ordinary attempt response contract.

## Initial 1Z0-830 blueprint

| Property | Practice blueprint |
|---|---:|
| Exam code | `1Z0-830` |
| Questions | 50 |
| Time limit | 120 minutes |
| Practice pass threshold | 68% |
| Top-level topics | 10 |
| Questions per topic | 5 |
| Correct answers needed at that threshold | 34 |

> **Format verification, 2026-10-07.** Oracle's official [Java certification overview on dev.java](https://dev.java/learn/java-cert-overview/) lists the Java SE 21 Developer Professional exam (`1Z0-830`) as **50 questions in 120 minutes with a 68% passing score**, matching this blueprint. Dev.java describes itself as the official Java platform and language website maintained by the Java Platform Group at Oracle.
>
> The JavaScript-rendered Oracle University storefront at `education.oracle.com/java-se-21-developer-professional/pexam_1Z0-830` still rejects automated clients, so #113 continues to track a direct human browser comparison of that page. The values above are therefore no longer source-less, but this record does not pretend that the storefront itself was observed on 2026-10-07.

The values live in `MockExamBlueprintCatalog`. A future exam version must opt in explicitly; it never inherits another exam's timing or distribution by accident. Its question count, duration and passing score must be checked again against an Oracle-maintained source and recorded with a date.

The equal five-per-topic distribution is a CertForge practice blueprint. It deliberately gives every published objective meaningful exposure and is not presented as an Oracle-published objective weighting.

## Foundation

`MockExamPlanner` resolves the active track, requires an explicit blueprint for its active exam version and reads only learner-safe published questions from `QuestionBank`.

For each top-level topic it:

1. requires at least the configured number of published questions;
2. chooses that many distinct questions with the server's unpredictable `RandomGenerator`;
3. records the topic next to each selected revision;
4. rejects a duplicate revision across topics as an internal integrity failure;
5. shuffles the combined set so topic blocks are not visible to the learner.

The planner fails instead of silently shortening or rebalancing a mock. Tests use a seeded generator, so the complete selection and order are reproducible.

The current Java SE 21 authorial pack contains 15 questions per topic, but most later additions still await technical review. The mock becomes startable only after enough questions in every topic are actually published.

## Persistence

The persisted aggregate contains learner, track and exam-version ids; status; the blueprint values used for that run; `createdAt`, fixed `expiresAt`, and `closedAt`; an immutable ordered snapshot of `(position, topicId, revisionId)`; and one immutable submitted response per position.

`V12__mock_exams.sql` introduces separate `mock_exam_session`, `mock_exam_question` and `mock_exam_response` tables. There is at most one in-progress mock per learner and track, which gives the later start endpoint a safe resume contract even under concurrent requests.

The snapshot can be inserted only in the same database transaction that creates the aggregate root and cannot later be updated, deleted or extended. The repository also rejects incomplete, non-contiguous, duplicate or topic-unbalanced plans before persistence.

Response rows are immutable evidence. The database verifies that a response belongs to the learner, targets the exact revision snapshotted at that position, is written only while the mock is in progress, and is not timestamped after the persisted deadline. Idempotency keys are unique per learner. Closing the mock and inserting a response synchronize on the session row so a response cannot slip in after the run is closed.

A started run therefore never gains newly published questions and never swaps a deprecated revision. The exact revision the learner saw remains recoverable for post-exam review.

## Delayed-feedback API rule

While a mock is `IN_PROGRESS`, no endpoint may return correctness, correct option keys, option correctness flags, explanations or references. Submitting an answer returns only a receipt that confirms the stored selection. Detailed answer material becomes readable only after the mock is `COMPLETED` or `EXPIRED`.

This is a server rule, not a front-end convention.

## Timing and scoring

The browser will display the countdown, but the server owns the deadline. Once `expiresAt` has passed, later answers are rejected and the run expires lazily, matching ordinary study-session behavior.

The final score denominator is the blueprint's full question count, not the number answered. Results will expose total, answered and correct counts; percentage; whether the configured practice threshold was reached; elapsed duration; per-topic breakdown; and detailed post-close review.

A mock result describes that run. It is not a readiness forecast or a probability of passing the real exam.

## Relationship to ordinary progress

Mock responses remain separate from ordinary topic-practice attempts. Mixing them into the existing progress projection would silently change the meaning of `attempted`, `correct` and confidence-based review evidence.

Mock history therefore has its own read model under `/api/study/history/mock-exams`. While a run is active, history exposes participation only. Once terminal, it exposes the run score and per-topic aggregates; topics below that run's configured practice target are marked `needsReview`. These markers are historical mock evidence and do not mutate ordinary progress or the adaptive-review queue.

## Learner API

The timed lifecycle is exposed under `/api/study/mock-exams`:

- `POST /api/study/mock-exams` starts a balanced run. A second start for the same learner and track returns a conflict carrying the existing session id rather than silently replacing its snapshot or deadline.
- `GET /api/study/mock-exams/{sessionId}` resumes the exact stored order and server deadline.
- `POST /api/study/mock-exams/{sessionId}/questions/{position}/response` accepts one idempotent response. Its response is only a receipt: it deliberately contains no correctness, answer key, explanations or references.
- `POST /api/study/mock-exams/{sessionId}/finish` closes a live run.
- `GET /api/study/mock-exams/{sessionId}/result` is available only after completion or expiration. It then exposes the score, topic breakdown and full revision evidence needed for review.
- `GET /api/study/history/mock-exams` pages the learner's mock runs separately from topic-practice history. Active rows omit correctness; terminal rows include aggregate score and weak-topic markers.

Expiration is based on the persisted deadline and the server clock. Unanswered items remain unanswered evidence and count against the full question-count denominator rather than disappearing from the score. The OpenAPI contract test explicitly checks that active-run schemas do not grow answer material by accident.

## Learner flow

The certification track links to a dedicated mock runner. The runner shows the server-backed countdown, direct question navigation, answered state, browser-local review flags and an irreversible submit confirmation that calls out unanswered questions. It never renders correctness while the run is active.

Terminal runs open a result screen with the practice score, elapsed time, named topic breakdown and full answer review. The History page lists mock exams separately from topic practice, resumes active runs, links terminal runs back to their result, and surfaces topics below the run's configured practice target without feeding that signal into ordinary progress.

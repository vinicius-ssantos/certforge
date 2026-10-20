# Study Sessions

Issue: #9 — Implement topic-focused study sessions and question selection. Depends on the [preparation catalog](preparation-catalog.md) and the [question bank](question-bank.md).

## What a session is

A learner starts a session for one topic and receives an ordered set of published questions. The set and its order are fixed when the session starts. Answering questions is described in [answer submission](answer-submission.md); this document covers starting, inspecting, completing and abandoning a session. The session view shows which questions are `answered` and the session list shows `answeredCount`, neither of which reveals correctness.

## Starting a session

`POST /api/study/sessions` with `{"topicId": "...", "questionCount": 5}` (`questionCount` is optional).

1. The topic must be active in the catalog, otherwise `404 topic_not_found`. Draft and inactive topics are indistinguishable from unknown ones.
2. The count must be between 1 and the server maximum (default 10 questions when omitted, at most 20), otherwise `400 question_count_out_of_range`.
3. The question bank returns the eligible questions: published, non-deprecated revisions of that topic that are bound to the topic's current active exam version.
4. If fewer are available than requested the start fails with `409 insufficient_content`, reporting `requested` and `available` so the client can retry with a smaller number. A session is never silently shortened.
5. The selector picks that many distinct questions in a random order, using an unpredictable source of randomness. The client cannot influence it.
6. The session and its question snapshot are stored, and the session is returned.

A learner has at most one session in progress per topic. A second start returns `409 active_session_exists` with the `sessionId` of the one in progress. This is enforced by a partial unique index, so concurrent starts are safe: exactly one succeeds.

## The order the options are shown in

The questions of a session are shuffled; the options were not, and they are stored in the order they
were authored in. That turned an authoring habit into information: no four-option question in the
Java SE 21 pack has a correct D, in all 147 of them, so a learner who noticed eliminated an option
for free in every exam built from it, and the score and the weakness report measured the pack rather
than the learner (#233). Rebalancing the keys is not available, because a reviewed question's
verdict is recorded against its text and editing one to improve its optics discards a person's
review ([ADR 0005](../adr/0005-ai-not-source-of-truth.md)).

So a learner's options are presented in an order derived from their session id and the revision id,
by `PresentedOrder`:

- it is **derived, not drawn**, so every payload about the same question in the same session agrees
  — the question as it is answered, the answer as it is read afterwards, the attempt in the history
  — across a refetch, a restart and a later visit, with nothing stored and no migration;
- each option keeps the **key the author gave it**, which is what an answer submits and what grading
  compares, so nothing about correctness depends on the order;
- the interface shows the **position** rather than the key, because a badge reading "D, A, C, B"
  would put the authored order back on the screen. After an answer, when the learner's own option is
  moved to the top, its letter stays the one it had when the question was answered.

The editorial desk is deliberately the exception: a reviewer sees the authored keys, which are the
letters the pack and the review record use.

This removes an accidental tell from the examination. It does not hide the answer key: the packs are
published in a public repository, and anyone reading them sees what every question answers.

## Snapshot and stability

The session stores the revision ids and their positions. Question revisions are immutable, so the snapshot is enough to keep a session stable:

- later publication of new questions never adds to an existing session;
- replacing or deprecating a question does not change it: a session keeps showing the revisions it was created with, in the same order. The question bank exposes these through a dedicated learner-safe read for revisions that were once published;
- the snapshot table is frozen by the database: rows cannot be updated or deleted, and can be inserted only by the transaction that creates the session.

## Lifecycle

```
IN_PROGRESS --complete--> COMPLETED
IN_PROGRESS --abandon---> ABANDONED
IN_PROGRESS --time up---> EXPIRED
```

All other states are terminal. `complete` and `abandon` are explicit learner actions. Any further transition on a closed session returns `409 session_not_in_progress`, or `409 session_expired` for an expired one. Two requests racing to close the same session have exactly one winner.

Completing a session does not require answering every question.

## Expiration policy

A session expires when it has been in progress longer than `certforge.study.session-ttl` (default 24 hours from its start). Expiration is lazy and needs no scheduled job: when a session is read, or when the learner lists sessions or starts a new one, every session of that learner whose time is up becomes `EXPIRED`. This means an abandoned session never blocks the learner's next start, and the recorded close time is the moment it was detected. How expired and abandoned sessions count toward progress is defined in [history and progress](history-and-progress.md): their accepted answers count, and sessions without answers add nothing.

## Endpoints

All require the `STUDY` permission. A session belongs to its learner: anyone else receives `404 session_not_found`.

| Endpoint | Description |
|---|---|
| `POST /api/study/sessions` | Start a session |
| `GET /api/study/sessions[?status=]` | The learner's sessions, newest first |
| `GET /api/study/sessions/{id}` | One session with its questions |
| `POST /api/study/sessions/{id}/complete` | Complete it |
| `POST /api/study/sessions/{id}/abandon` | Abandon it |

## Privacy

Questions in a session are the learner-safe `PublishedQuestion` projection: prompt, type, difficulty, Java release, topic and option keys and texts. There is no correctness flag, option or overall explanation, reference, author, reviewer or rationale, in a fresh session or in an old one. The answer key stays in the question bank and is read server-side when an answer is submitted (#10).

## Testing selection

In production the random source is `SecureRandom`. Tests register a primary seeded `RandomGenerator` bean and a controllable `Clock`, which makes sessions reproducible and lets expiration be tested without waiting. There is deliberately no seed, parameter or header in the API.

## Configuration

| Property | Default | Meaning |
|---|---|---|
| `certforge.study.session-ttl` | `24h` | Time a session may stay in progress |
| `certforge.study.default-question-count` | `10` | Questions when none is requested |
| `certforge.study.max-question-count` | `20` | Largest allowed session |

## Deferred

Answer submission and attempts (#10), history and progress (#11), adaptive selection, spaced repetition, mock-exam blueprints, retries, question-performance weighting, and offline synchronization.

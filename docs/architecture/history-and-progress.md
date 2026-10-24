# History and Progress

Issue: #11 — Build attempt history and reproducible topic progress. Builds on [answer submission](answer-submission.md) and [study sessions](study-sessions.md).

## Principle

Persisted attempts are the evidence. Everything shown here is derived from them and can be recomputed, so a learner's progress is never a manually maintained score and no number is shown whose inputs are not visible.

## History

Both endpoints return only the current learner's data, need the `STUDY` permission, and are `Cache-Control: no-store` because attempt history contains answer keys (for answers already given).

### Attempt history

`GET /api/study/history/attempts` returns accepted attempts, newest first. Each item has the session, position, topic, submission time, the selected options, whether it was correct, confidence and elapsed time, plus the **exact revision that was answered**: revision id and number, its status, type, prompt, overall explanation, every option with its correctness and explanation, and the references. The revision is read by id from the question bank, so it keeps showing the original wording and answer key after the question has been corrected or deprecated, and `question.revisionStatus` says when a revision has since been replaced.

Filters: `topicId`, `sessionId`. Questions that were never answered never appear, so history cannot be used to read an answer key early.

### Session history

`GET /api/study/history/sessions` returns sessions newest first with their status, requested count, `answeredCount` and `correctCount`, and timestamps. It contains no question content. In-progress sessions whose time is up are expired first, as in the session list.

### Pagination

Pages use a keyset cursor, not an offset. `size` is 1 to 50 (default 20), `cursor` is the opaque `nextCursor` of the previous page, and `nextCursor` is `null` on the last page. Order is `(timestamp, id)` descending, where the id is a total-order tie-breaker. Because a cursor names a row instead of counting rows, new attempts or sessions arriving at the front while a learner pages through never make a later page skip or repeat an item. Invalid values return `400 invalid_page_size` or `400 invalid_cursor`.

## Topic progress

`GET /api/progress/topics` returns one entry per topic of the active tracks, in catalog order (topics with no activity included), followed by any topic that has data but is no longer in an active track.

| Field | Meaning |
|---|---|
| `attempted` | Accepted attempts in the topic |
| `correct` | Of those, how many were correct |
| `incorrect` | `attempted - correct` |
| `accuracy` | `correct / attempted`, four decimals; `null` until something has been attempted |
| `lastActivityAt` | Time of the most recent accepted attempt; `null` if none |
| `topicName`, `trackSlug` | From the catalog |

There is no readiness, mastery or prediction field. Tests assert the exact set of fields.

### What counts, and what does not

These rules are the definition of progress:

- **Every accepted attempt counts**, whatever the status of its session. Answers in a session that was later abandoned or expired are real evidence and stay counted.
- **A question that was never answered is neither attempted nor incorrect.** Unanswered questions, in any session, add nothing.
- **A session with no answers adds nothing**, however it ended.
- **The same question answered in several sessions counts each time.** Each is a separate accepted attempt. A first-attempt metric is a different view and is deferred.
- **Attempts are attributed to the topic of their session.** The session is topic-focused, so this is unambiguous and unaffected by later changes to a question.
- A rejected or replayed submission is not an attempt and is not counted.

## How the projection is kept

Progress is stored in `progress_topic` (learner, topic, attempted, correct, last activity). The `study` module publishes an `AttemptRecorded` event inside the transaction that records a new attempt, and the `progress` module updates the row synchronously in that same transaction. The attempt and its progress therefore commit or roll back together, and an idempotent replay, which records nothing, changes nothing.

A per-learner advisory lock serializes recording an attempt and rebuilding, so a rebuild can never lose or double-count an attempt that is being written.

### Reconciliation and rebuild

- `GET /api/progress/reconciliation` recomputes the expected progress from the attempts, compares it with the stored rows within a single consistent snapshot, and returns `{"consistent": bool, "differences": [...]}` listing every topic that differs (wrong counts, a missing row, or a row with no attempts behind it).
- `POST /api/progress/rebuild` replaces the learner's rows with the recomputed ones and returns the number of topics and how many were corrected. It is idempotent: rebuilding a healthy projection changes nothing.
- Rebuilding every learner (removing rows whose attempts no longer exist) is available to the application for operations and is covered by tests.

The projection should never drift in normal operation; these exist to detect and repair the effects of a bug or a manual change.

## Endpoints

| Endpoint | Description |
|---|---|
| `GET /api/study/history/attempts` | Attempt history with exact revisions |
| `GET /api/study/history/sessions` | Session history |
| `GET /api/progress/topics` | Topic progress |
| `GET /api/progress/reconciliation` | Compare stored progress with the attempts |
| `POST /api/progress/rebuild` | Recompute stored progress |
| `GET /api/study/interviews/evidence` | What interview practice has shown, per topic, with the responses behind each number |

## Interview evidence, which is not a score

Interview practice has its own evidence, and deliberately no readiness number.
`GET /api/study/interviews/evidence?trackSlug=…` reports, per topic the learner has practised:

- **objective items**: how many were answered, how many were right, and — the two a single accuracy
  figure hides — the responses where the learner was **sure and wrong**, and those where they were
  **right but unsure**. Being confidently wrong is a different problem from guessing correctly, and
  a percentage would average them into neither;
- **guided items**: how many were practised, and which expected concepts the learner **said** their
  own answer did not cover, most often first, in the reviewer's own words for each.

Four properties hold, and #23 asked for each of them:

1. **Every number can be explained from what is stored.** Each count carries the ids of the
   responses behind it, so a learner can read the answers rather than trust the count.
2. **Nothing is stored.** The whole view is derived from the responses when it is asked, so
   "rebuilding gives the same result" is true because there is nothing to rebuild.
3. **Guided evidence is never presented as correctness.** The two kinds are counted separately and
   never added, because one is graded and the other is not ([ADR 0019](../adr/0019-behavioural-preparation-is-guidance-not-grading.md)).
4. **There is no score.** No readiness percentage, no probability, no hiring or employability
   signal, and no field for one to be added into. A topic never practised is absent rather than
   reported as zero: no evidence is not evidence of weakness.

### Where concept coverage comes from

The product cannot judge what a guided answer covered, because it never receives the answer. So it
asks: when a learner answers a guided item they may mark which expected concepts they think they
covered, and those marks are recorded beside the response and frozen with it. Marking nothing means
only that they did not say.

That makes every statement about coverage a statement the learner made, on a date, about a
question — "you marked *durable duplicate detection* as not covered twice" — rather than a
measurement of a person. A mark about a concept the question does not list is refused, and an
objective question has options rather than concepts, so marking one there is refused too.

## Deferred

Spaced repetition, mastery levels, readiness forecasts, streaks, leaderboards, cross-user analytics, mock-exam reports, and first-attempt accuracy.

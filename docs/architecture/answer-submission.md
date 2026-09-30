# Answer Submission

Issue: #10 — Implement idempotent attempt submission and answer privacy. Builds on [study sessions](study-sessions.md) and the [question bank](question-bank.md). The threat it addresses is premature answer disclosure in the [threat model](threat-model.md).

## Submitting an answer

```
POST /api/study/sessions/{sessionId}/questions/{position}/attempt
Idempotency-Key: 7f3c2c9a-5d3e-4d57-9a1c-0d0c4a2b1e11
Content-Type: application/json

{"selectedOptions": ["A", "C"], "confidence": "HIGH", "elapsedMillis": 4200}
```

- `selectedOptions`: option keys of the question. A single-choice question takes exactly one; a multiple-choice question takes one or more. Repeating a key is rejected.
- `confidence`: `LOW`, `MEDIUM` or `HIGH`, the learner's own certainty.
- `elapsedMillis`: time the learner reports spending, from 0 to 24 hours. It is informational evidence and is not trusted for correctness.
- There is no `correct` field. Correctness is computed on the server, and any such field sent by a client is ignored.

The response is `201 Created` with the result below. The position is the question's index in the session, as returned when the session was started.

## Correctness

The server compares the selected set with the correct set of the revision stored in the session snapshot. They must be equal: there is no partial credit, so selecting only some of the correct options, or extra options, is incorrect. The revision used is the exact one the learner was shown, even if the question was replaced or deprecated afterwards, and the attempt stores that revision's id.

## What is disclosed, and when

Nothing about the answer is sent before an answer is accepted. Until then the session payload, the error responses, and the attempt read endpoint contain no correctness flag, explanation or reference.

After acceptance the result includes the answer:

```json
{
  "position": 1,
  "revisionId": "…",
  "selectedOptions": ["A", "C"],
  "correct": true,
  "confidence": "HIGH",
  "elapsedMillis": 4200,
  "submittedAt": "…",
  "answer": {
    "correctOptions": ["A", "C"],
    "explanation": "overall explanation",
    "options": [{"key": "A", "text": "…", "correct": true, "explanation": "why"}],
    "references": [{"title": "…", "url": "https://…"}]
  }
}
```

`GET /api/study/sessions/{sessionId}/questions/{position}/attempt` returns the same result later, and `404 attempt_not_found` (with no details) until an answer has been accepted. Both responses are `Cache-Control: no-store`. The session view shows only whether each question is `answered`, and the session list shows `answeredCount`; neither reveals correctness.

## Idempotency contract

Every submission must carry an `Idempotency-Key` header of 8 to 64 letters, digits, hyphens or underscores (`400 idempotency_key_required` or `idempotency_key_invalid` otherwise). Keys are scoped to the learner. A client generates one key per answer and reuses it when it retries.

| Situation | Result |
|---|---|
| First request with a key | `201`, the attempt is recorded |
| Same key, same request (session, position, options, confidence, elapsed time) | `200` with `Idempotency-Replayed: true` and the original result; no new attempt |
| Same key, any difference in the request | `409 idempotency_key_reused`; nothing changes |
| New key for a question that already has an answer | `409 already_answered`; the first answer is kept |

A retry is recognised before anything else, so it is answered with the original result even if the session has since been completed, abandoned or expired. The identical result includes the timestamp, which is stored with microsecond precision so a replay is byte-for-byte equal to the original response.

There is exactly one accepted attempt per session question. This holds under concurrency: simultaneous requests with the same key produce one attempt and the rest are replays; simultaneous requests with different keys produce one attempt and the rest `already_answered`. Both are enforced by unique constraints in PostgreSQL, not only by application checks.

## Errors

| Status | `code` | Meaning |
|---|---|---|
| 400 | `idempotency_key_required`, `idempotency_key_invalid` | Missing or malformed key |
| 400 | `invalid_option` | An option key does not belong to the question |
| 400 | `duplicate_option` | The same key was selected twice |
| 400 | `single_choice_requires_one_option` | A single-choice question needs exactly one option |
| 400 | `validation_failed` | Missing or out-of-range fields (`fields` lists their names only) |
| 404 | `session_not_found` | Not the learner's session, or no such session |
| 404 | `question_not_found` | The position is not in the session |
| 404 | `attempt_not_found` | No accepted answer yet (attempt read only) |
| 409 | `already_answered` | The question already has an accepted answer |
| 409 | `idempotency_key_reused` | The key was used for a different request |
| 409 | `session_not_in_progress`, `session_expired` | The session no longer accepts answers |

Error bodies never contain answer material. A session that belongs to another learner behaves exactly like one that does not exist.

## Evidence is immutable

An attempt stores the learner, session, position, the exact revision, the selected options, the computed correctness, confidence, elapsed time, submission time, the idempotency key and a fingerprint of the request. PostgreSQL triggers guarantee that attempts are never updated or deleted, that an attempt can only be inserted for a session that belongs to the learner and is in progress, and, through a row lock, that closing a session waits for an answer being written. No answer can therefore be recorded in a closed session, even when a submission and a close race.

## Logs and telemetry

No code path logs request bodies, selected options, answer keys or idempotency keys. This is covered by a test that exercises accepted, replayed, rejected and invalid submissions and asserts that the captured log output contains none of the answer material or keys. Structured telemetry, metrics and traces are defined in #12 and must keep to the same rule.

## Deferred

Retry mode, partial credit, free-text answers, adaptive scoring, mock exams, arbitrary code execution, history and progress views (#11), and metrics for submissions (#12).

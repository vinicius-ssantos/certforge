# Question Bank

Issue: #7 — Implement versioned question bank and editorial workflow. Decisions: [ADR 0003](../adr/0003-version-published-questions.md), [content policy](../product/content-policy.md).

## Model

- `Question` is the logical identity. It never changes and owns no content.
- `QuestionRevision` is the unit of content and review: type, topic, Java release, difficulty and rationale, prompt, overall explanation, options, references, author, and review decisions. Attempts reference a revision, never the logical question.
- Each option has a key (`A`–`H`), text, a correctness flag, and its own explanation of why it is correct or incorrect.
- References are authoritative sources with a title and an `https` URL.
- `ContentReview` records each technical review decision (`APPROVED` or `CHANGES_REQUESTED`) with the reviewer and a comment.

## Lifecycle

```
DRAFT --submit--> TECHNICAL_REVIEW --approve--> APPROVED --publish--> PUBLISHED --deprecate--> DEPRECATED
  ^                      |
  +---request changes----+
```

| Transition | Permission | Rules |
|---|---|---|
| create, edit, start a correction, submit | `CONTENT_AUTHOR` | Only the revision's author may edit or submit. Edits only in `DRAFT`. Submission requires a complete revision |
| approve, request changes | `CONTENT_REVIEW` | Only from `TECHNICAL_REVIEW`. The reviewer must not be the author (see below). Requesting changes needs a comment |
| publish | `CONTENT_PUBLISH` | Only from `APPROVED`. Re-checks completeness, requires an active topic, and that the revision's Java release equals the exam's |
| deprecate | `CONTENT_PUBLISH` | Only from `PUBLISHED` |

A draft may be saved incomplete. It can leave `DRAFT` only when it satisfies every rule below.

## Invariants

A complete revision has:

- a prompt, a topic, a Java release, a difficulty and a difficulty rationale, and an overall explanation;
- at least two options with unique keys, each with text and an explanation;
- exactly one correct option for `SINGLE_CHOICE`, at least one for `MULTIPLE_CHOICE`;
- at least one reference, each with a title and an `https` URL.

Violations are returned together as stable codes (`revision_incomplete` with a `violations` list), for example `prompt_missing`, `options_too_few`, `single_choice_requires_exactly_one_correct_option`, `references_missing`.

Other rules:

- A question has at most one revision being authored, reviewed or approved at a time (`open_revision_exists`).
- A question has at most one `PUBLISHED` revision per exam version. Publishing a correction deprecates the revision it replaces in the same transaction.
- Deprecated revisions never enter new selection but stay retrievable.

## Immutability

Content is editable only while a revision is `DRAFT`. This is enforced twice:

1. In the service, which rejects edits outside `DRAFT`.
2. In PostgreSQL triggers on the revision, option and reference tables. Once a revision leaves `DRAFT`, changing its content, options or references, or deleting it, fails for every writer, including direct SQL. Only lifecycle columns (status, timestamps, exam version, publisher) may change.

A correction is a new revision (`POST /api/admin/questions/{id}/revisions`) copied from the latest one. Existing revisions and the attempts that reference them are never modified.

## Reviewer separation (decision)

The domain model left open whether editor and reviewer must be different people. By default a reviewer cannot review a revision they authored (`reviewer_must_differ_from_author`). A single-maintainer deployment can turn this off explicitly with `certforge.question-bank.require-reviewer-separation=false`. The default is on because independent review is what makes published content trustworthy.

## Learner-safe projections

The module contract `QuestionBank` exposes three reads to other modules:

| Method | Returns | Use |
|---|---|---|
| `eligibleForTopic(topicId)` | `PublishedQuestion`s | Selecting questions for a session |
| `findPublished(revisionId)` | `PublishedQuestion` | Showing a question to a learner |
| `findRevision(revisionId)` | `RevisionEvidence`, any status | Checking correctness and showing a historical attempt |

`PublishedQuestion` is safe to serialize to a learner before an answer is submitted: it has the prompt, type, difficulty, Java release, topic and option keys and text. It has no correctness flags, option explanations, overall explanation, references, reviewer, author or editorial data. Only published revisions are returned.

`RevisionEvidence` contains the answer key and explanations. It is server-side evidence and must never be serialized to a learner before an answer has been accepted. No learner-facing HTTP endpoint serves questions yet; session and attempt APIs (#9, #10) will use these contracts.

## Audit facts

Approval, publication, replacement and deprecation publish an `AuditFact` (actor, action, subject `question-revision:<id>`, time) as an in-process event inside the same transaction. Actions: `QUESTION_REVISION_APPROVED`, `QUESTION_REVISION_PUBLISHED`, `QUESTION_REVISION_REPLACED`, `QUESTION_REVISION_DEPRECATED`. The `audit` module will persist them in #12; until then the facts are emitted but not stored.

## Endpoints

| Endpoint | Permission |
|---|---|
| `GET /api/admin/questions[?status=]`, `GET /api/admin/questions/{id}` | any of `CONTENT_AUTHOR`, `CONTENT_REVIEW`, `CONTENT_PUBLISH` |
| `POST /api/admin/questions` | `CONTENT_AUTHOR` |
| `POST /api/admin/questions/{id}/revisions` | `CONTENT_AUTHOR` |
| `PUT /api/admin/question-revisions/{id}`, `POST .../{id}/submit` | `CONTENT_AUTHOR` (author only) |
| `POST .../{id}/approve`, `.../request-changes` | `CONTENT_REVIEW` |
| `POST .../{id}/publish`, `.../deprecate` | `CONTENT_PUBLISH` |

Every command returns the editorial view of the question. These responses include the answer key and are for editors, reviewers and publishers only.

## Deferred

Community submission, bulk import, AI publication, question analytics, arbitrary Java execution, mock-exam blueprints, persisting audit facts (#12), a learner-facing question endpoint (#9, #10), and compare-revisions tooling for reviewers (#14).

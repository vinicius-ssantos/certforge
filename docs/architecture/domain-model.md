# Initial Domain Model

## Aggregate and entity candidates

### Certification catalog

- `CertificationTrack`
- `ExamVersion`
- `ExamTopic`

A track contains exam versions. An exam version owns its ordered topic taxonomy and lifecycle. Topic identifiers are stable so progress evidence remains interpretable.

### Question bank

- `Question`
- `QuestionRevision`
- `QuestionOption`
- `ContentReview`
- `SourceReference`

`Question` is the logical identity. `QuestionRevision` is the immutable publishable artifact. Options, expected answers, explanations, references, declared compatibility, and review evidence belong to the revision.

Core invariants:

- a revision belongs to exactly one logical question;
- a published revision cannot be edited;
- only an approved revision can be published;
- a question has at most one active published revision per declared exam-version context unless an explicit variant model is introduced;
- a single-choice revision has exactly one expected option;
- a multiple-choice revision has at least two options and at least one expected option;
- every published revision has an explanation and authoritative reference;
- deprecated revisions cannot enter new sessions.

### Study

- `StudySession`
- `SessionQuestion`
- `QuestionAttempt`

A session snapshots the selected question revision identifiers. Selection changes after session creation do not mutate the session.

Core invariants:

- an attempt references a question revision present in its session;
- one accepted submission exists per session question unless an explicit retry mode is introduced;
- correctness is computed against the referenced immutable revision;
- selected options, confidence, elapsed time, and submission timestamp are persisted;
- correct-answer details are disclosed only after accepted submission;
- completed sessions reject new attempts.

### Progress

- `TopicProgressProjection`
- `StudyActivityProjection`

Progress is a derived model built from attempts and sessions. It is not the source of truth for historical answers and must be rebuildable.

## Identity references

Learning aggregates store stable user identifiers rather than embedding identity records. Personal profile data is minimized and separated from attempt evidence.

## Important value objects

- `CertificationTrackId`
- `ExamVersionId`
- `TopicId`
- `QuestionId`
- `QuestionRevisionId`
- `StudySessionId`
- `AttemptId`
- `JavaRelease`
- `Difficulty`
- `QuestionType`
- `ConfidenceLevel`
- `ElapsedTime`
- `ContentStatus`

## Domain events candidates

- `QuestionRevisionApproved`
- `QuestionRevisionPublished`
- `QuestionRevisionDeprecated`
- `StudySessionStarted`
- `QuestionAttemptSubmitted`
- `StudySessionCompleted`

Events initially support modular decoupling, projections, and auditability. They do not imply Kafka or external messaging.

## Open design questions for implementation

- Whether an exam version may reuse one revision directly or requires an explicit compatibility association.
- Whether editor and reviewer separation must be enforced for the first private operating model.
- Whether abandoned sessions expire through a scheduled policy or explicit user action.
- Whether progress projections are synchronous initially or updated through reliable internal events.

These questions must be decided before the affected implementation issue is accepted, not abstracted prematurely.

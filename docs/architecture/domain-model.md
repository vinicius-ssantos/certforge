# Initial Domain Model

## Aggregate and entity candidates

### Preparation catalog

- `PreparationTrack`
- `Topic`
- `CertificationProfile`
- `ExamVersion`

`PreparationTrack` is the stable learner-facing preparation target. A track has a `TrackKind`, initially `CERTIFICATION` and reserved for future `INTERVIEW` use.

The committed `v0.1.0` track is a Java certification track. Its `CertificationProfile` owns provider/exam metadata and its `ExamVersion` owns the objective/version lifecycle required for certification correctness.

Topics belong to a preparation track and have stable identifiers so progress evidence remains interpretable. Certification-specific objective mappings remain explicit metadata rather than being hidden inside generic topic fields.

This generalization is intentionally narrow: it avoids making certification the permanent root abstraction while adding no interview behavior to `v0.1.0`.

### Question bank

- `Question`
- `QuestionRevision`
- `QuestionOption`
- `ContentReview`
- `SourceReference`

`Question` is the logical identity. `QuestionRevision` is the immutable publishable artifact. Options, expected answers, explanations, references, declared compatibility, and review evidence belong to the revision.

For `v0.1.0`, supported question types remain single-choice and multiple-choice with deterministic correctness.

Future Interview Prep may introduce guided-response metadata such as expected concepts, reference answers, common mistakes, follow-up prompts, and seniority expectations. Those fields are not part of the first release and must not be simulated through nullable certification fields.

Core invariants:

- a revision belongs to exactly one logical question;
- a published revision cannot be edited;
- only an approved revision can be published;
- a question has at most one active published revision per declared track/exam context unless an explicit variant model is introduced;
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
- objective correctness is computed against the referenced immutable revision;
- selected options, confidence, elapsed time, and submission timestamp are persisted;
- correct-answer details are disclosed only after accepted submission;
- completed sessions reject new attempts.

Future guided interview responses require a distinct evaluation contract. They must not overload objective `correct` semantics.

### Progress

- `TopicProgressProjection`
- `StudyActivityProjection`

Progress is a derived model built from attempts and sessions. It is not the source of truth for historical answers and must be rebuildable.

Future interview progress may include evidence such as expected-concept coverage or recurring weakness categories, but opaque AI readiness scores are not a source of truth.

## Identity references

Learning aggregates store stable user identifiers rather than embedding identity records. Personal profile data is minimized and separated from attempt evidence.

## Important value objects

- `PreparationTrackId`
- `TrackKind`
- `CertificationProfileId`
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

- Whether certification compatibility belongs directly to a question revision or to an explicit track/exam association.
- Resolved: `CertificationProfile` is a one-to-one record of its track and `ExamVersion` carries its own lifecycle. See [Preparation catalog](preparation-catalog.md).
- Whether editor and reviewer separation must be enforced for the first private operating model.
- Whether abandoned sessions expire through a scheduled policy or explicit user action.
- Whether progress projections are synchronous initially or updated through reliable internal events.

Interview-only design questions are tracked separately and do not block the first release unless they expose a harmful irreversible coupling.

These questions must be decided before the affected implementation issue is accepted, not abstracted prematurely.

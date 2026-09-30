# ADR 0007: Generalize the preparation catalog without generalizing v0.1 behavior

## Status

Proposed

## Context

CertForge was founded around Java certification preparation. Before implementation began, a second credible product direction emerged: technical interview preparation for software engineers, beginning with Java backend roles.

The existing learning primitives — topic catalog, reviewed question revisions, study sessions, attempts, confidence, progress, and adaptive review — can plausibly support both use cases.

However, certification and interview preparation are not identical:

- certifications have providers, exam versions, objectives, and deterministic answer expectations;
- interviews may target roles, seniority, job descriptions, trade-off reasoning, and guided responses without one binary correct answer.

If `CertificationTrack` becomes the permanent catalog root, later interview support may require awkward naming or migration. If the whole domain is generalized now, the first release risks unnecessary abstraction and scope growth.

## Decision

Generalize only the catalog root and stable topic identity before implementation:

- use `PreparationTrack` as the root preparation target;
- introduce `TrackKind`, initially supporting `CERTIFICATION` and reserving `INTERVIEW`;
- use stable `Topic` identities under a preparation track;
- keep certification-specific metadata explicit through a certification profile/exam-version model;
- keep the committed `v0.1.0` behavior exclusively certification-oriented;
- do not implement interview-specific persistence, APIs, question types, evaluation, or UI in `v0.1.0`.

Question and attempt semantics remain objective in the first release. Future guided interview responses require explicit contracts rather than overloading certification correctness.

## Consequences

### Positive

- The core catalog does not permanently equate all preparation with certification.
- Topic, session, attempt, and progress concepts can be reused where evidence supports reuse.
- Certification-specific rules remain visible and enforceable.
- Interview Prep can be added later without renaming the top-level catalog concept.
- The first release does not gain interview-specific behavior.

### Negative

- The initial terminology is slightly more abstract than a certification-only product.
- Issue and documentation language must distinguish generic catalog concepts from certification-specific profiles.
- Implementation must resist adding unused `INTERVIEW` fields merely because the enum value exists.

## Rejected alternatives

### Keep `CertificationTrack` permanently

Rejected because a second concrete preparation mode is already identified before code exists, making the naming cost avoidable now.

### Generalize the entire domain before v0.1

Rejected because guided responses, job targeting, seniority metadata, and interview evaluation are not required to prove Study Core.

### Build Interview Prep as a separate product

Rejected for now because the learning workflow and evidence model overlap substantially. Separation can be reconsidered if real implementation or usage shows incompatible domain needs.

## Implementation guidance

Issue #6 should implement the narrow catalog generalization while exposing only the Java certification journey required by `v0.1.0`.

Interview-specific capabilities belong to a separate future backlog and must not become hidden acceptance criteria for the first release.

# ADR 0016: Shape the interview track as a versioned taxonomy, and keep it small

- Status: **Proposed.** Nothing is built. It is written as a recommendation with its reasoning so it can be accepted, or changed and then accepted.
- Date: 2026-10-04

## Context

[#18](https://github.com/vinicius-ssantos/certforge/issues/18) asks for a reviewed `INTERVIEW` track for Java Backend Pleno/Sênior, with a stable taxonomy, explicit seniority expectations, and canonical weights that a job-specific blueprint can reference without mutating. [ADR 0014](0014-one-topic-one-track.md) already sent data structures, algorithms, SOLID, design patterns and object-oriented design here, and left one question open for #18: how a question can be offered under more than one topic without being written twice.

Read from the code rather than remembered, four things decide most of this.

**1. Publishing a question requires an active exam version.** `QuestionBankService.doPublish` calls `findActiveTopicContext`, and refuses with `topic_not_active` when it finds nothing. `TopicContext` is `(topicId, trackId, examVersionId, int javaRelease)` — both of the last two are non-nullable. Serving questions then goes through `findPublishedByTopic(topicId, examVersionId)`, and the published-uniqueness index is `(question_id, exam_version_id) WHERE status = 'PUBLISHED'`.

So an interview track, which has no exam by design, **cannot have a single question published or served today.** Not one line of that is interview-specific hostility; it is a certification-shaped model doing its job. But it means #18 is not only a taxonomy question, and the issue's scope does not name it.

**2. The schema is more permissive than the code.** `qb_question_revision.java_release` and `.exam_version_id` are both **nullable**. What makes them mandatory is application logic: `RevisionRules.violations` emits `java_release_missing` for every revision, and the publish path needs the context above. That is good news — the first interview question does not need the question bank reshaped, only its rules made conditional.

**3. Topic ordering and weight have nowhere to live for an interview track.** `catalog_topic` has no `position`. Order comes from `catalog_exam_version_topic (exam_version_id, topic_id, objective_ref, position)`, which is keyed by exam version. `objective_ref` lives there too — correctly, because an objective belongs to an exam and not to a topic.

**4. Progress is attributed through the session, not the question.** `study_attempt` carries `session_id` and `revision_id` but no topic; `study_session.topic_id` is what `progress_topic` is keyed by. That matters for the open question ADR 0014 left behind, and it is the one place where the existing model is already general enough.

## Decision

**1. Generalise the exam version into a *track version*, and let the interview track have one.**

`catalog_exam_version` becomes `catalog_track_version` — the thing topics are mapped into, ordered by, weighted by, and that published questions bind to. The exam-specific columns (`exam_code`, `exam_name`, `java_release`, `objectives_url`) move to `catalog_certification_exam`, keyed by track version, exactly as `catalog_certification_profile` already separates certification identity from the track.

This is the decision with real cost, and it is proposed rather than avoided because every alternative is worse:

- It answers four of #18's requirements at once — stable identifiers, ordering, canonical weights, and versioning and deprecation rules — using a mechanism that already exists and is already understood, instead of inventing a second one beside it.
- "At most one active version per track" is already an index. Interview taxonomies need exactly that rule: one canonical version live, older ones kept because published questions bind to them.
- `qb_question_revision.exam_version_id` becomes `track_version_id` and keeps meaning what it means: *the published context this revision was approved for*. [ADR 0003](0003-version-published-questions.md) is preserved rather than bent.

The cost, stated plainly: a migration that renames a table and a column with live data in them, touching the publish path, the session composition path and the mock exam aggregate. It is the largest single change in this ADR and it should be its own pull request, before any taxonomy row is inserted.

**2. `objective_ref` stays certification-only; interview topics carry a `rationale` instead.**

An interview topic has no published objective to cite, and inventing one would be the same mistake ADR 0014 refused when it declined to add "Data structures" to the Java SE 21 track. What an interview topic *can* carry is why it is in the taxonomy — "asked in most Pleno/Sênior backend screens" is a claim about the market, not about a document, and it should read like one.

So `catalog_track_version_topic` keeps `position`, gains a nullable `weight`, and its `objective_ref` becomes nullable with a `CHECK` that a certification version always has one. **A missing objective must be impossible for a certification track, and meaningless for an interview one.**

**3. The first taxonomy is twelve topics, not twenty-three.**

The [product direction](../product/interview-prep.md) lists twenty-three candidate topics. #18 asks for something "small enough to support a first reviewed content pack", and the evidence for how small is in this repository: **one certification track has 150 questions of which 130 are still unreviewed by a human**, months in. Review is the bottleneck, it is one person, and a taxonomy is a promise to fill it.

Twelve top-level topics, with the twenty-three folded into them as subtopics:

| # | Topic | Covers |
|---|---|---|
| 1 | Java language and runtime | Java core, collections, generics, streams, functional APIs, JVM fundamentals |
| 2 | Concurrency | threads, virtual threads, memory visibility, coordination |
| 3 | Object-oriented design | SOLID, design patterns, object-oriented modelling (ADR 0014) |
| 4 | Data structures and algorithms | the gap ADR 0014 identified |
| 5 | Spring | Spring, Spring Boot, Spring Security |
| 6 | Persistence | JPA, Hibernate, SQL, transactions |
| 7 | Testing | unit, integration, test doubles, what a test is evidence of |
| 8 | Domain boundaries | DDD fundamentals, ownership, contracts between modules |
| 9 | Distributed systems | microservices, synchronous versus asynchronous integration, failure |
| 10 | Messaging | Kafka and RabbitMQ concepts, idempotency, retries, DLQ, ordering, consistency |
| 11 | Cloud and operations | AWS for backend engineers, Docker, Kubernetes, observability, resilience |
| 12 | System design | composing the above under constraints |

Concurrency is split out of topic 1 rather than folded in, because it is where candidates most often fail and the one subject where topic-level progress is worth reading on its own.

**4. Behavioural communication and financial-system concerns are not in the first taxonomy.**

Both are in the epic, and both are deferred here for the same reason stated two different ways.

*Behavioural communication* has no deterministic correctness **and no authoritative reference**. The [content policy](../product/content-policy.md) requires references sufficient for independent verification, and ADR 0011 built mechanical reference checking around that. A question about how to describe a conflict with a colleague cannot cite a specification. Including it would either break the policy or quietly exempt one topic from it, and the second is worse. **What has to be decided first is whether the content policy admits a class of question whose evidence is editorial judgement alone** — a real decision, not a formality, and not one to make while writing a taxonomy table.

*Financial-system concerns* — auditability, precision, traceability, duplicate prevention — are genuinely citable and genuinely valuable, and they are deferred for the narrower reason that they cut across topics 6, 9, 10 and 12 rather than sitting beside them. A question about monetary precision is a `BigDecimal` question; one about duplicate prevention is an idempotency question. Making it a thirteenth topic would split progress for a subject that is a lens, not an area. **Revisit as a job-blueprint dimension (#22), where a lens is exactly the right shape.**

**5. Seniority is a property of a question, not only of the track.**

The interview profile declares a target — `PLENO` or `SENIOR` — because a track is a preparation target and that is what the learner chose. But "Pleno/Sênior expectations are explicit rather than inferred from free text" cannot be satisfied at track level: the same topic is asked at both depths, and the difference is what the answer has to contain.

So a revision gains a nullable `seniority` for interview tracks, with the same conditional treatment as `java_release`: **required when the track is an interview, meaningless when it is a certification.** A learner targeting Pleno is served Pleno questions; one targeting Sênior is served both, because a Sênior is expected to answer a Pleno question.

**6. `java_release` becomes conditional on the track kind.**

`RevisionRules` requires it on every revision today. A question about Kafka ordering has no Java release, and giving it one to satisfy a validator would be a lie in a field the certification path trusts. The rule becomes: required for a certification track, refused for an interview track.

**7. Canonical weights live on the track version; a job blueprint never writes to the catalog.**

`weight` on `catalog_track_version_topic` is the canonical expectation. A job-specific blueprint (#22) is a **read-only overlay**: it stores its own weights against topic ids and renders them beside the canonical ones, so "this posting emphasises messaging more than the canonical track does" is a sentence the product can say. #18's requirement that a blueprint "reference the taxonomy without mutating it" becomes a schema fact — the blueprint table has no write path into `catalog_*` — rather than a convention someone has to remember.

**8. A question still belongs to exactly one topic, and the same ground is written twice.**

This is the question ADR 0014 left open, and the answer is the one it was hoping to avoid.

The mechanism exists: progress is attributed through `study_session.topic_id`, not through the revision, so one revision served under two topics would attribute correctly. What does not survive is review. A revision's topic is part of `RevisionContent` and part of what the reviewer passed; `reviewDigest` includes `topicId`. A question approved as a Java SE 21 collections question **has not been reviewed as an interview collections question**, because the two have different standards — one is judged against an exam objective, the other against what an interviewer expects to hear. Offering it under both would present one review as two.

So: when a certification objective and an interview topic cover the same ground, the question is written again for the second framing, and reviewed again. That is a real cost, and ADR 0014 already accepted its twin for topics. The alternative — one review doing the work of two — is the kind of quiet overclaim this project has been built to avoid.

## Consequences

- **Nothing in this ADR is buildable without decision 1**, which is a migration on live tables. The honest ordering is: generalise the track version, then make the two rules conditional, then insert the taxonomy, then author content. An interview track inserted before that would be a track that cannot hold a question.
- **The interview track will be visibly empty for a long time.** Twelve topics with no reviewed questions is what this produces at first, and the tracks page would show a track a learner cannot practise. Either the track stays `DRAFT` until some topics have content, or the interface says plainly that a topic has none — the second is more honest and is what the empty states already do elsewhere.
- ADR 0014's naming problem gets worse, not better: a track called "interview" now owns data structures, SOLID and system design. "Java Backend — Pleno/Sênior" as the track *name*, with `INTERVIEW` as the kind, is the least-bad reading, and the kind is the thing the code branches on.
- Deferring behavioural communication means the first interview track does not do the thing the epic's name most suggests to a reader. That should be said in the product documentation rather than discovered.
- Seniority on a revision adds a dimension to content authoring that the editorial desk does not have a field for yet. It is small, and it is work.

## Rejected alternatives

- **Giving the interview track a fake exam version** to satisfy the publish path. It would put `exam_code` and `objectives_url` on something that is not an exam, and the catalog's own admin page explains publishing in terms of exam versions to an administrator. A lie in the model becomes a lie in the interface.
- **Making `examVersionId` nullable in `TopicContext` instead of generalising it.** Cheaper, and it spreads the question "is this a certification?" across every call site that touches the context, where a null means *interview* only if you already know that. The type stops carrying its meaning.
- **All twenty-three topics now.** It is a promise this project cannot currently keep: 130 questions are waiting for a human on the track that already exists. A taxonomy nobody can fill makes the product look larger and be emptier.
- **Behavioural communication with AI-evaluated answers.** [ADR 0005](0005-ai-not-source-of-truth.md) forbids AI as the source of correctness, and a behavioural answer has no reviewed criteria to compare against unless someone writes them. It is not a shortcut around the content policy; it is the content policy's hardest case.
- **A separate `foundation` track for topics 3 and 4.** ADR 0014 rejected this and nothing has changed; it is noted only because a taxonomy that owns data structures makes the temptation stronger.
- **Deciding the taxonomy during content authoring.** The gap ADR 0014 found was found by asking the question early. The expensive version of this is discovering at question 40 that the topic boundaries do not hold.

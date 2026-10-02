# ADR 0014: Keep one topic in one track, and put fundamentals in the interview track

- Status: **Proposed.** Nothing is built. It is written as a recommendation with its reasoning so it can be accepted, or changed and then accepted.
- Date: 2026-10-02

## Context

The question that prompted this: where does a learner study data structures, SOLID and object-oriented design? Those are not certification objectives and they are not obviously interview-only either. Studying `Queue` for an exam, for an interview, and for its own sake are three intentions about one subject.

What the model says today, read from the schema rather than remembered:

- `catalog_topic.track_id` is `NOT NULL`, with `UNIQUE (track_id, slug)`. **A topic belongs to exactly one track.** Sharing one across tracks is not possible without a schema change.
- `catalog_track.kind` is `CHECK (kind IN ('CERTIFICATION'))`. [ADR 0007](0007-generalize-preparation-catalog.md) says it reserves `INTERVIEW`, but the database does not accept it yet, so **any new kind of track needs a migration**, not just a row.
- `catalog_certification_profile` is a separate table keyed by track, so a track without an exam version and without objectives is already structurally possible.
- The certification track's topics and their objective wording come from Oracle's published objectives, compared against Oracle's page in a browser on 2026-10-02 (#68).

That last point settles half the question on its own. **Adding "Data structures" to the Java SE 21 track would invent an objective Oracle does not publish**, and the catalog records an `objective_ref` per topic precisely so each one is traceable to a public source. The verification we just did would become false.

## Decision

**1. A topic stays owned by exactly one track.** Topics are not shared, and the schema is not changed to allow it.

The reason is progress, which is the product's primary output. Progress is per topic. If one "Queues" topic were reachable from a certification track and an interview track, a learner's accuracy in it would mean "for the exam" or "for an interview" depending on which questions they happened to be served. A topic that means two things cannot produce an explainable number, and principle 4 is that progress is explainable.

**2. Data structures, algorithms, SOLID, design patterns and object-oriented design belong to the interview track.** SOLID and design patterns are already in the [interview prep taxonomy](../product/interview-prep.md). Data structures and algorithms are not, and that is a gap rather than a deliberate exclusion: the taxonomy goes from "Collections and generics" straight to design, and the only occurrence of the word queue in it is about messaging.

**3. No `FOUNDATION` track kind now.** A track is a preparation *target*: something with an assessment behind it that a learner is preparing for. A body of knowledge is not a target, and a track with no profile, no version and no objectives would be a different shape wearing the same name.

**4. The consequence is stated rather than hidden**: until an interview track exists, there is nowhere in CertForge to study SOLID or data structures. That is a real limitation of the product, and the honest response is to say so, not to bolt the topics onto a certification track where they do not belong.

## Consequences

- The interview track (#17, #18) becomes the home of a larger body of material than its name suggests, which is a naming problem worth revisiting when it is built. "Interview" describes the occasion rather than the subject.
- Some subjects will legitimately exist twice, once per track, when a certification objective and an interview topic genuinely cover the same ground — `Collections` being the obvious case. Two topics with separate progress is the intended outcome, not duplication to be removed: progress toward an exam and readiness for an interview are different claims.
- Questions, however, should not be written twice. How a question can be offered under more than one topic without duplicating its text or its review is unresolved and belongs with #18, which already lists "define how a topic may be shared across certification and interview tracks without sharing lifecycle ownership accidentally".
- If a fundamentals track is ever wanted, this ADR is what it supersedes, and the cost is explicit: a migration widening the `kind` constraint, a track with no certification profile, and an answer to the progress-ambiguity problem above.

## Rejected alternatives

- **Adding the topics to the Java SE 21 certification track.** It would invent objectives Oracle does not publish and falsify the objective verification recorded in #68. The track's topic list is not ours to extend.
- **Sharing one topic across tracks.** It makes topic-level progress ambiguous, which is the one number this product has been careful to keep meaningful.
- **A third `FOUNDATION` track kind now.** Possible, and not obviously wrong, but it adds a track shape with no assessment before anyone has asked to study without a goal. The decision can be made later with evidence; making it now costs a migration and a precedent.
- **Waiting to decide until the interview track is built.** The gap in the taxonomy is real today and would otherwise be found during content authoring, which is the most expensive moment to find it.

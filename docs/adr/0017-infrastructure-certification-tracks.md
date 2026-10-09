# ADR 0017 — Infrastructure, general knowledge and exam snapshots

Status: Proposed (#165, #166)

## Existing foundations
ADR 0007, migrations V13–V15 and the existing Java Backend interview taxonomy already generalize the track root. Preserve these semantics and the original Java SE 21 IDs.

## Decision
1. Add `GENERAL` as a distinct `TrackKind` beside `CERTIFICATION` and `INTERVIEW`. A general track has no certification profile or exam row. Initially such tracks are catalog-only; no create/activate UI is enabled by this change.
2. Permit a certification exam without `java_release`; it remains populated for Java SE 21 and null for non-Java exams. Do not use a synthetic Java release for Kubernetes or AWS.
3. Record an **optional, explicitly verified** objective snapshot per certification track version. Its source, verification date, version label and digest distinguish verified objectives from unspecified legacy data. Existing Java version is **not** silently marked verified.
4. Model objectives and topic mappings many-to-many. Preserve `catalog_track_version_topic.objective_ref` for compatibility, until readers and importers adopt the new mapping.
5. Do **not** claim readiness from topic presence. Question-to-objective evidence, weighting, version changes, and practical assessments are separate follow-on work.
6. Content pack identifiers must include track and version context, with no change to canonical review digests for existing Java 21 questions.

## Invariants and follow-ups
- Old track/version/topic/question IDs and attempts are unchanged.
- Source verification is an editorial decision, never inferred from a URL.
- Objective snapshots are immutable after activation by application policy; database-level enforcement and version lifecycle APIs are future work.
- Foreign keys keep an objective mapped only to topics in its track version; cross-track mapping is rejected.
- New non-Java content remains DRAFT until #166 generalizes validation/import and human review is complete.
- No unofficial question is represented as a real examination item.

## Rollout
Phase 1: schema and enum, migration tests, no new learner exposure.
Phase 2 (#166): multi-pack manifest schema, source policies, evidence runners and review packet.
Phase 3 (#167–#173): authorial question packs and versioned exam blueprints.
Phase 4 (#176): objective coverage and readiness, separately measuring hands-on competence.

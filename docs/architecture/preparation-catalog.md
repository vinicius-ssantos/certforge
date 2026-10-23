# Preparation Catalog

Issue: #6 — Model the preparation catalog and Java certification profile. Architecture: [ADR 0007](../adr/0007-generalize-preparation-catalog.md).

## Aggregate boundary (decision)

The [domain model](domain-model.md) left open whether `CertificationProfile` and `ExamVersion` are separate aggregates. `v0.1.0` uses this boundary:

| Concept | Owns | Lifecycle |
|---|---|---|
| `PreparationTrack` | Stable identity, slug, name, `TrackKind`, topics | `DRAFT` → `ACTIVE` ⇄ `INACTIVE` |
| `CertificationProfile` | Provider and certification name. Exactly one per certification track | Follows its track |
| `ExamVersion` | Exam code and name, the target Java release *if the exam is about one*, official objectives URL, and the explicit topic mapping | `DRAFT` → `ACTIVE` ⇄ `INACTIVE`; at most one `ACTIVE` per track |
| `Topic` | Stable id, slug, display name, optional parent | Belongs to a track; visible only through a mapping |

Why this shape:

- The profile is stable identity and never needs its own lifecycle, so it stays a one-to-one record of the track instead of a separate aggregate.
- The exam version is the unit that changes when an exam is revised, so it carries the lifecycle, the objective mapping and — for an exam that is about one — the target Java release. [ADR 0017](../adr/0017-infrastructure-certification-tracks.md) decided that a Kubernetes or AWS exam carries no release rather than a synthetic one, so the release is optional end to end: the admin request may omit it, the learner view serves null, and the two screens that show it leave it out instead of printing an empty one. A question published to such an exam must carry no release either, which is the same `java_release_mismatch` rule read in the other direction.
- Certification-specific data lives in `catalog_certification_profile` and `catalog_exam_version`. The generic `catalog_track` table holds no certification fields, and no interview fields exist anywhere.

## Learner visibility

Learners see a track only when the track is `ACTIVE` **and** it has an `ACTIVE` exam version. Topics are returned in exam order, as a tree with at most one level of subtopics, each with the objective it maps to. Draft and inactive content is never returned by the learner API or by the public `PreparationCatalog` contract.

## Rules enforced by the module

- Only `CERTIFICATION` tracks can be created. `TrackKind.INTERVIEW` is reserved in code and is rejected by a database constraint; the migration that introduces interview behavior extends it (ADR 0007).
- Slugs are lowercase letters, digits and hyphens, at most 64 characters, unique per track (topics: unique within the track).
- A topic's `id` and `slug` never change. Only the display name can be corrected.
- Topic mappings can be edited only while the exam version is `DRAFT`. An `ACTIVE` exam version is frozen so the taxonomy learners see stays stable; a change needs a new exam version.
- A mapped topic must belong to the exam version's track, a subtopic requires its parent to be mapped, and topics and positions are unique per exam version.
- Subtopics cannot have their own subtopics.
- An exam version can be activated only if its track is `ACTIVE`, it has at least one mapped topic, and the track has no other `ACTIVE` exam version (also guaranteed by a partial unique index).
- Objectives URLs must be `https`.

## Endpoints

Learner (`STUDY` permission):

| Endpoint | Description |
|---|---|
| `GET /api/catalog/tracks` | Active tracks with their active exam version and topics |
| `GET /api/catalog/tracks/{slug}` | One active track; `404 track_not_found` otherwise |

Administration (`CATALOG_MANAGE` permission). Every command returns the updated view of the affected track:

| Endpoint | Description |
|---|---|
| `GET /api/admin/catalog/tracks`, `.../tracks/{id}` | All tracks, including drafts |
| `POST /api/admin/catalog/tracks` | Create a draft certification track and its profile |
| `POST .../tracks/{id}/activate`, `.../deactivate` | Track lifecycle |
| `POST .../tracks/{id}/exam-versions` | Create a draft exam version |
| `PUT .../exam-versions/{id}/topics` | Replace the topic mapping (draft only) |
| `PUT .../exam-versions/{id}/objectives` | Record one verified reading of the provider's objectives page, and the objectives it found |
| `POST .../exam-versions/{id}/activate`, `.../deactivate` | Exam version lifecycle |
| `POST .../tracks/{id}/topics` | Create a topic, optionally under a parent |
| `PUT .../topics/{id}` | Correct a topic's display name |

Failures use the same RFC 9457 problem responses as identity, with stable codes such as `slug_already_exists`, `exam_version_not_editable`, `active_exam_version_exists`, `track_not_active`, `exam_version_has_no_topics`, `topic_not_in_track`, `parent_topic_not_mapped`, `duplicate_topic`, `duplicate_position`, `topic_too_deep`, `objectives_need_an_exam`, `duplicate_objective_key` and `validation_failed`.

### What a question claims, and when it is checked

A question says which exam objectives it prepares for through `objectiveKeys` on its revision — the keys the provider uses, carried by a content pack and stored since #165. Nothing is required to claim one: every question in the Java SE 21 pack and every interview question claims none.

A claim is free text while the question is a draft, and the reason is that a draft is written early: before its topic is mapped into an active exam version, often before anyone has read the exam's objectives at all. A foreign key would refuse ordinary authoring. So the claim is checked at the two moments it can be:

- **publishing** refuses a key the exam's verified snapshot does not list (`objective_not_verified`), and says so plainly when nobody has read the page yet. That is the moment a claim becomes a claim to a learner;
- **recording a new reading** refuses to drop an objective a published question still claims (`objective_claimed_by_published_question`), so the two cannot drift apart afterwards. The catalog asks the question bank through `PublishedObjectiveClaims`, an interface this module declares and content implements, because content depends on the catalog and the dependency cannot run both ways.

### Verified exam objectives

An exam version can exist before anyone has read the provider's objectives page, and the Java SE 21 exam is in that state. `PUT .../exam-versions/{id}/objectives` records a reading: the provider's own version name, the date, the HTTPS page it was read from, a `sha256:` digest of that page, and the objectives found on it. The reading replaces the previous one, because a snapshot is one reading of one page and an objective that is no longer listed is not an objective.

What this is for: [ADR 0017](../adr/0017-infrastructure-certification-tracks.md) requires that no certification is claimed without a verified version and date, and V17 added the tables for it. Until now nothing in the application could write one, so the verification could not be recorded and no objective could exist to be cited. A question citing an objective is the next step (#165), and it will have to refuse a reading that removes an objective some published question still claims.

Two rules the tables cannot state: only a certification version has a provider page to read (`objectives_need_an_exam`), and an objective key appears once in a reading (`duplicate_objective_key`). A reading with no objectives is refused by the request itself, since a verification that found none verified nothing.

Recording a reading does **not** make a question official. It records what the provider published, so that this project's own material can say which objective it prepares for — never that it came from the exam.

## Seed data and traceability

`V4__seed_java_certification_catalog.sql` seeds the `java-certification` track with the Oracle Java SE 21 Developer Professional exam (`1Z0-830`, Java 21) and ten topics, one per published exam objective group:

1. Handling date, time, text, numeric and boolean values
2. Controlling program flow
3. Using object-oriented concepts in Java
4. Handling exceptions
5. Working with arrays and collections
6. Working with streams and lambda expressions
7. Packaging and deploying Java code and using the Java Platform Module System
8. Managing concurrent code execution
9. Using Java I/O API
10. Implementing localization

Each mapping stores the objective text in `objective_ref`, and the exam version stores the official objectives page, `https://education.oracle.com/java-se-21-developer-professional/pexam_1Z0-830`, so every topic is traceable to a public source. Identifiers are fixed so topic identity is the same in every environment.

> **Review required before publishing content.** What is verified and what is not:
>
> - The exam page URL is the canonical one declared by Oracle's own page metadata, and `V6__correct_java_exam_source.sql` corrected an earlier alias.
> - Oracle University's [announcement of the exam](https://blogs.oracle.com/oracleuniversity/announcing-oracle-certified-professional-java-se-21-developer-exam-and-java-se-21-programming-complete-course) confirms the areas the exam covers: date, time, text, numeric and boolean values; program flow and exceptions; object-oriented and functional programming, inheritance, polymorphism, generics, records and lambdas; streams, arrays, collections, concurrency, I/O and localization; modules, packaging and deployment. The ten topics cover these areas.
> - The exact wording of each objective group, and the split into ten groups, was compared with the exam page in a browser on 2026-10-02 and reported to match (#68). That page is rendered by JavaScript and blocks automated clients, so no check keeps it true: it is a match as of that date, to be re-checked when an exam version is added. It also went down for maintenance later the same afternoon, so whoever re-checks should expect the source to be unavailable sometimes and plan for a second attempt rather than treating a failure to load as a discrepancy.
>
> That comparison was done, so questions may be published against these topics. Two things remain open and neither blocks publishing: Generics has no topic of its own, which is a product judgement rather than an error, and a new exam version needs the comparison repeating. Display names and mappings can be corrected without changing topic identity.

## Deferred

Interview tracks, role and seniority profiles, job-description ingestion, guided-response evaluation, several certification providers, community-created tracks, automated objective scraping, and audit events for catalog changes (see #12).

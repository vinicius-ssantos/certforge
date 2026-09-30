# Scope and Non-goals

## Committed scope: `v0.1.0` Study Core

The first release must allow a learner to:

- authenticate and maintain an individual study profile;
- browse the initial Java certification track and its topics;
- start a topic-focused study session;
- answer single-choice and multiple-choice authorial questions;
- see the reviewed answer and explanation after submission;
- record attempt outcome, selected options, elapsed time, and declared confidence;
- review session history;
- see basic progress by topic;
- allow an authorized content editor to manage draft and published questions;
- preserve the exact published question revision used by an attempt.

The implementation may use preparation-track terminology in the catalog where it is no more complex than certification-specific terminology, but no interview behavior is required by `v0.1.0`.

## Required operational scope

- PostgreSQL migrations are versioned and repeatable in test environments.
- Administrative operations are authorized and auditable.
- API errors use stable, non-sensitive problem responses.
- Relevant logs, health checks, metrics, and traces exist.
- Automated tests cover critical domain rules and persistence boundaries.
- The primary learner flows meet baseline accessibility requirements.

## Explicit non-goals for `v0.1.0`

- Technical interview preparation flows.
- Job-description ingestion or job-specific study plans.
- Free-text or guided-response interview evaluation.
- AI-generated or AI-corrected answers.
- Compilation or execution of submitted Java code.
- Timed full mock exams.
- Spaced-repetition scheduling.
- Personalized study plans or readiness forecasts.
- Mobile applications.
- Social login.
- Payments, subscriptions, advertisements, or monetization.
- Community publication of questions.
- Rankings, competitive leaderboards, streak pressure, or advanced gamification.
- Certification tracks other than the initial Java track.
- Microservices, Kafka, Kubernetes, or distributed caches without demonstrated need.

## Future-compatible boundary

Interview Prep is a documented future direction. The initial architecture may preserve reusable concepts such as preparation track, topic, question revision, study session, attempt evidence, and progress projection, but must not implement interview-only behavior prematurely.

Certification-specific concepts such as exam version, provider, objective mapping, and exact answer correctness remain explicit and must not be diluted into generic fields.

## Scope-control rule

A feature that is not required to complete the documented `v0.1.0` learner journey is deferred unless it closes a security, legal, accessibility, data-integrity, or operational blocker.

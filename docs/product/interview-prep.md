# Interview Prep Direction

## Status

**Future product direction — not committed to `v0.1.0`.**

This document defines the intended shape of technical interview preparation so the initial architecture does not make the capability unnecessarily expensive later. It is not permission to implement interview-only behavior before the Study Core is complete.

## Problem

Technical interviews test more than recognition of a correct option. Candidates are expected to explain concepts, compare trade-offs, reason about failures, analyze code, discuss architecture, and respond to follow-up questions at an appropriate depth.

A generic quiz model is therefore insufficient. Interview Prep needs structured evidence without pretending that every answer has one binary truth value.

## First target profile

The initial interview track should be:

**Java Backend — Pleno/Sênior**

Candidate topic taxonomy:

- Java Core;
- Collections and generics;
- Streams and functional APIs;
- concurrency and JVM fundamentals;
- Spring and Spring Boot;
- Spring Security;
- JPA and Hibernate;
- SQL and transactions;
- testing;
- SOLID and design patterns;
- domain boundaries and DDD fundamentals;
- microservices;
- synchronous versus asynchronous integration;
- messaging;
- Kafka and RabbitMQ concepts;
- idempotency, retries, DLQ, ordering, and consistency;
- AWS fundamentals for backend engineers;
- Docker and Kubernetes;
- observability and resilience;
- system design;
- behavioral communication;
- financial-system concerns such as auditability, precision, traceability, and duplicate prevention.

The first content pack should emphasize Java/Spring backend rather than attempt to cover every interview domain.

## Preparation tracks

A future track has a kind:

- `CERTIFICATION`
- `INTERVIEW`

Certification profiles retain exam-specific metadata. Interview profiles may later include:

- role family;
- seniority target;
- technology expectations;
- optional company/job context;
- weighted topic expectations.

A specific job description can produce a temporary study blueprint without becoming the permanent canonical taxonomy.

## Question and assessment modes

### Objective

Objective items have deterministic correctness.

Examples:

- single choice;
- multiple choice;
- code output;
- compilation result;
- deterministic debugging outcome.

Evidence may include:

- selected answer;
- correctness;
- confidence;
- elapsed time.

### Guided response

Guided-response items evaluate coverage and reasoning rather than a binary answer.

Examples:

- explain SOLID;
- compare queue and topic;
- explain how to reduce coupling between domains;
- design an idempotent message consumer;
- discuss REST versus messaging;
- explain a production incident or engineering decision.

A reviewed guided-response revision may contain:

- expected concepts;
- reference answer;
- required versus optional points;
- common mistakes;
- likely follow-up questions;
- seniority expectation;
- authoritative references.

The platform must not convert this automatically into a fake deterministic `correct=true/false` value.

## Example guided-response item

**Prompt:** Why should two domains avoid sharing the same JPA entity or database table?

**Expected concepts:**

- persistence ownership;
- reduced coupling;
- independent schema evolution;
- domain boundaries;
- stable contracts between modules/services;
- explicit consistency trade-offs.

**Reference answer:** A concise reviewed explanation showing those ideas.

**Follow-up:** What if both domains need the same data?

**Common weakness:** treating an ORM entity as the integration contract.

## Job-specific preparation

A future workflow may accept a job description and produce an explicit study blueprint, for example:

- Java — high;
- Spring — high;
- microservices — high;
- messaging — high;
- AWS — high;
- finance-domain concerns — medium.

The generated blueprint must show why each topic was selected. It must not silently rewrite the canonical interview track or fabricate experience requirements.

## Progress evidence

Interview preparation may reuse:

- attempt history;
- confidence;
- elapsed time;
- topic progress;
- error notebook;
- spaced review.

Additional evidence may include:

- expected-concept coverage;
- recurring missing concepts;
- follow-up difficulty;
- self-declared confidence versus reviewed coverage.

Any aggregate readiness indicator must remain explainable.

## AI boundary

AI may later:

- suggest supplementary explanations;
- propose practice variations;
- conduct conversational mock interviews;
- compare a response against reviewed criteria;
- identify possible missing concepts.

AI must not:

- silently publish questions;
- become the authoritative source of technical correctness;
- invent citations;
- assign opaque hiring scores;
- claim that a subjective answer is definitively correct without reviewed criteria.

## Delivery principle

Interview Prep should be introduced only after Study Core demonstrates that the underlying question, session, attempt, progress, editorial, and audit primitives are useful in real study.

Where certification and interview behavior differ, explicit domain types are preferred over nullable generic fields or overloaded semantics.

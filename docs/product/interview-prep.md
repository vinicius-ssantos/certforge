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

### The taxonomy, as seeded

Twelve topics, decided by [ADR 0016](../adr/0016-interview-track-taxonomy.md) and inserted by `V14` as a draft track and a draft taxonomy version. The twenty-three candidates this document used to list are folded in as the subject matter of these twelve, not dropped.

| # | Topic | Weight | What it covers |
|---|---|---|---|
| 1 | Java language and runtime | 5 | Java core, collections, generics, streams, functional APIs, JVM fundamentals |
| 2 | Concurrency | 4 | threads, virtual threads, memory visibility, coordination |
| 3 | Object-oriented design | 5 | SOLID, design patterns, object-oriented modelling |
| 4 | Data structures and algorithms | 3 | the properties underneath the collections, and the cost of an operation |
| 5 | Spring | 5 | Spring, Spring Boot, Spring Security |
| 6 | Persistence | 5 | JPA, Hibernate, SQL, transactions |
| 7 | Testing | 4 | unit, integration, test doubles, what a test is evidence of |
| 8 | Domain boundaries | 3 | DDD fundamentals, ownership, contracts between modules |
| 9 | Distributed systems | 4 | microservices, synchronous versus asynchronous integration, failure |
| 10 | Messaging | 4 | Kafka and RabbitMQ concepts, idempotency, retries, DLQ, ordering, consistency |
| 11 | Cloud and operations | 3 | AWS for backend engineers, Docker, Kubernetes, observability, resilience |
| 12 | System design | 3 | composing the above under constraints |

Weight is an editorial judgement about what a Pleno/Sênior backend screen asks, on a 1 to 5 scale, not a measurement. A job-specific blueprint may disagree with it without rewriting the taxonomy.

**Two subjects in the list above are deliberately absent, and a reader should not have to discover that.** *Behavioural communication* has no authoritative reference, and the [content policy](content-policy.md) requires one; whether the policy admits a question whose evidence is editorial judgement alone has to be decided before the topic exists. *Financial-system concerns* — auditability, precision, traceability, duplicate prevention — are a lens across topics 6, 9, 10 and 12 rather than a thirteenth area, and belong in a job blueprint. So the first interview track does not yet do the thing the word "interview" most suggests.

### Where data structures end and collections begin

Topic 1 absorbed "Collections and generics", so the boundary that matters is between topic 1 and topic 4, and it is this: **topic 1 is the API, topic 4 is the properties underneath it.**

- "Which `Map` keeps insertion order?" and "what does `Collectors.toMap` do with a duplicate key?" are **topic 1**: they are answered by knowing the Java library.
- "Why is a lookup in a hash table not always constant time?", "when does an array beat a linked list even with worse asymptotics?", "what does a tree buy you over a hash table?" are **topic 4**: they are answered by knowing the structure, in any language.

A question that can be answered by reading the Javadoc belongs in topic 1. A question that would read the same in another language belongs in topic 4. When a question genuinely needs both, it goes where the *reasoning* is, not where the type name is.

### What depth a question may assume

**Reasoning about behaviour and cost, never writing an algorithm from scratch.** Two reasons, and the first is structural: the platform does not execute learner code, and will not before `v0.5.0` ([ADR 0006](../adr/0006-isolate-code-execution.md)), so a question has to be answerable without running anything. The second is that an interview for a backend role asks a candidate to *choose* and *justify* a structure far more often than to implement one.

So a question may assume the candidate can read code and reason about complexity, and may not require them to produce a working implementation. "Which of these is O(log n) and why" is in scope; "write a balanced insert" is not, and would not be gradeable here even if it were.

The first content pack should emphasise Java/Spring backend rather than attempt to cover every interview domain.

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

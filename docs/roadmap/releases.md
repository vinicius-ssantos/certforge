# Release Roadmap

## Release policy

Each release must create a demonstrable user outcome. Infrastructure-only milestones are internal implementation slices, not product releases. Later releases remain hypotheses until the preceding release is used and reviewed.

## `v0.1.0` — Study Core

**Outcome:** A learner can study reviewed questions by topic and inspect evidence of progress.

Includes catalog, question delivery, answer submission, explanation, attempt history, basic topic progress, editorial administration, question revisioning, authentication, authorization, auditability, and operational foundations.

## `v0.2.0` — Adaptive Review

**Outcome:** A learner receives a targeted review queue based on mistakes, confidence, recency, and demonstrated mastery.

Candidate capabilities: error notebook, confidence-aware classification, spaced-review scheduling, daily review queue, recurring misconception visibility.

## `v0.3.0` — Mock Exams

**Outcome:** A learner completes timed simulations and receives a blueprint-based weakness report.

Candidate capabilities: timed assessments, question flagging, final submission, controlled topic distribution, unseen-question safeguards, post-exam report.

## `v0.4.0` — Code Analysis

**Outcome:** A learner practices questions about compilation, runtime behavior, and program output with high-quality code presentation.

This release still uses prevalidated content and does not require arbitrary execution.

## `v0.5.0` — Secure Java Runner

**Outcome:** A learner can compile and execute bounded Java snippets with deterministic feedback.

Requires a separately deployed runner, strict resource controls, no network access, disposable execution environments, abuse protection, and runner-specific observability.

## `v0.6.0` — Study Planner

**Outcome:** A learner receives an explainable plan based on goals, available time, weak topics, and review obligations.

## `v0.7.0` — AI Study Assistant

**Outcome:** A learner can request supplementary explanations and reviewed practice variations while correctness remains grounded in deterministic and editorial evidence.

## Release gates

A release can be tagged only when:

- its documented user journey is demonstrable;
- acceptance criteria and critical tests pass;
- security and privacy impacts are reviewed;
- accessibility checks pass for primary flows;
- migrations and rollback considerations are documented;
- observability exists for critical paths;
- README, changelog, and release notes are current;
- there are no unresolved release-blocking issues.

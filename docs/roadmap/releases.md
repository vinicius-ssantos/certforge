# Release Roadmap

## Release policy

Each release must create a demonstrable user outcome. Infrastructure-only milestones are internal implementation slices, not product releases. Later releases remain hypotheses until the preceding release is used and reviewed.

### What the tracker holds, and what is still undecided

This section exists because the roadmap and the issue tracker said different things about what
the project is building, and neither could be read as the plan (#200). The questions it raised were
answered on 2026-10-23 and are recorded below.

`v0.4.0` through `v0.7.0` carry no issues at all, which is this policy working as written: they
are hypotheses, and filing issues against them now would be planning scope the policy says not to
plan yet.

Two directions carry issues and **neither will carry a release number**, decided by the owner on
2026-10-23 (#200):

| Direction | Milestone | Issues | Place |
|---|---|---|---|
| Interview Prep | `Interview Prep — foundation` | 18 | parallel direction, unnumbered |
| Infrastructure, DevOps and Cloud Native | `Infrastructure, DevOps and Cloud Native tracks` | 13 | parallel direction, unnumbered |

**Why neither is numbered.** The numbered sequence is a progression of what the product can *do* —
study, simulate an exam, analyse code, run it safely, plan, assist. Both of these directions are
breadth of *content*: they add subjects to prepare for, not capabilities. Numbering them would claim
the product gains something it does not, and it would make two content directions compete for the
same release slots with the one reviewer this project has.

**The rule that follows from having one reviewer.** A parallel direction may be planned at any time
and is **worked only when no numbered release is in flight**. The constraint is not engineering
capacity; it is review capacity. Every question drafted for a parallel direction joins the queue in
front of the reviews a numbered release is waiting on, and the reviews are the slow part
([ADR 0005](../adr/0005-ai-not-source-of-truth.md)).

**Interview Prep's scheduling condition is met**, and this is what met it: the reusable learning
model stopped being a promise when the infrastructure pack went through the same manifest, evidence
and review machinery as the Java pack, which is what #166 closed. Met is not the same as scheduled —
by the rule above it stays unnumbered and unworked while `v0.3.0` is unfinished, and its eighteen
issues stay open, because a researched backlog is not noise.

**The infrastructure epic no longer contains platform work.** #166 asked for the content machinery to
generalise beyond Java and is closed; #165 — the catalog model, exam-version snapshots and what a
question may claim about an exam objective — is closed with it. What remains under #164 is content
and curriculum, and it is blocked on #177 (source governance) and on review capacity, in that order.

## `v0.1.0` — Study Core

**Outcome:** A learner can study reviewed Java certification questions by topic and inspect evidence of progress.

Includes preparation catalog foundations, the Java certification profile, question delivery, answer submission, explanation, attempt history, basic topic progress, editorial administration, question revisioning, authentication, authorization, auditability, and operational foundations.

Interview-specific question types, evaluation, and job targeting are explicitly excluded from this release.

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

## Parallel product direction — Interview Prep

Interview Prep is intentionally not assigned a release number yet. It may be scheduled after the Study Core is demonstrated and the reusable learning model is validated.

Target outcome: a learner preparing for a Java backend interview can practice role-relevant questions, explain technical decisions, receive structured reviewed feedback, inspect weak topics, and rehearse likely follow-up questions.

Candidate capabilities:

- `INTERVIEW` preparation tracks alongside `CERTIFICATION` tracks;
- Java Backend Pleno/Sênior topic taxonomy;
- objective and guided-response question modes;
- expected-concept rubrics, reference answers, common mistakes, and follow-up questions;
- role/seniority metadata;
- job-description-derived study sessions with an explicit topic weighting;
- interview-specific history and weakness evidence;
- future mock interviewer experience;
- future AI assistance constrained by reviewed criteria rather than opaque scoring.

Interview Prep must reuse proven study primitives where appropriate, but it must not force subjective interview responses into certification-style binary correctness.

See [Interview Prep direction](../product/interview-prep.md).

## Parallel product direction — Infrastructure, DevOps and Cloud Native

#164 and its remaining children — Kubernetes, AWS and Terraform certification paths, Linux and
networking, CI/CD, hands-on labs, source governance and exam-content ethics — are a parallel
direction with no release number, on the same footing as Interview Prep and for the same reason:
they add subjects to prepare for, not capabilities.

The platform half of this direction is finished. #166 generalised content packs, evidence checks and
editorial validation beyond Java, and #165 settled the catalog model, exam-version snapshots, what a
verified reading of a provider's objectives page records, and what a question may claim about an
objective. A Kubernetes or AWS exam can now be registered, which it could not be while the
application demanded a Java release of every certification.

What remains is content and curriculum, and it is ordered: **#177 first** — the source policy, the
version-monitoring mechanism, and the ethics of exam content — because no certification profile
should be authored before the rules about what may be read, cited and claimed are published. Then
the packs, in batches small enough to be reviewed rather than queued.

One boundary that is not a scheduling question: a certification profile here is **authored study
material**. It is never a copy of, derived from, or presented as an exam's own questions, and no
track is labelled official without authorisation that does not exist today.

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

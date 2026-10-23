# ADR 0020: Model interview sessions as a third study aggregate

- Status: **Accepted**
- Date: 2026-10-23
- Issue: #21

## Context

A study session is topic-focused and objective-graded. It snapshots revisions for one topic, hands
over the answer material after every accepted attempt, and contributes each attempt to topic
progress immediately. A mock exam is a separate aggregate, for reasons [ADR
0015](0015-separate-mock-exam-aggregate.md) set out: a different span, a deadline, no answer
material until the run closes, and a cross-topic result.

An interview session is a third set of semantics, and the differences are not presentation:

- it spans a **subset of topics** chosen by the learner or by a blueprint, not one topic and not a
  whole exam;
- it mixes **objective and guided-response** items in one sitting, and the two cannot be evaluated
  the same way. An objective item is right or wrong. A guided item has a reference answer and the
  concepts a reviewer expected, and by [ADR 0019](0019-behavioural-preparation-is-guidance-not-grading.md)
  **nothing about it is scored**;
- it exposes **follow-up prompts** after the primary response, which no other flow has;
- it must not move certification readiness, because preparing for an interview is not preparing for
  an exam.

`QuestionBankReadService` already filters guided-response revisions out of every learner flow, with
a comment naming this issue: the current flows "only know objective answer semantics", and letting an
empty option set fall through objective grading would have graded a free-form answer as wrong.

Three options were available. Overload the study session with a kind column and a nullable topic
subset: that puts three evaluation models in one aggregate and in one progress projection, which is
what ADR 0015 already refused once. Reuse mock exams: wrong in the other direction — a mock hides
everything until it closes, and an interview session is the opposite, it is for talking through an
answer immediately. Or a third aggregate.

## Decision

**Interview sessions are a third aggregate inside the `study` module**, beside ordinary sessions and
mock runs. They share published revisions, catalog identities, the server clock, authentication and
the module's conventions; they have their own persistence and their own response contract.

1. **A session snapshots an ordered set of revision ids**, each with its topic, when it starts.
   Later publication, replacement or deprecation never changes a session in flight, and a completed
   session cannot be rewritten by a later content edit.
2. **An item is either objective or guided, and the contract says which.** An objective item is
   answered and graded exactly as it is in a study session. A guided item records that it was
   answered, with the learner's own text kept locally and never sent, and returns the reviewed
   material: the reference answer, the expected concepts, the common mistakes. It carries **no
   correctness, no score, and no contribution to progress**.
3. **Follow-up prompts belong to the revision** and are returned only after the primary response for
   that item is recorded. They are reviewed content, not generated.
4. **Interview practice does not move certification readiness.** It has its own history, and the
   progress projection that answers "how ready am I for this exam" does not read it.
5. **Objective privacy is unchanged**: nothing about an objective item's answer is available before
   its attempt is accepted, exactly as in a study session.

## Consequences

The learner-safe read for guided items has to exist, which is new: today every learner-facing read
filters them out. That filter stays for study, review and mock, and the interview read is the one
place it does not apply.

A third aggregate is a third set of tables, states and tests, and the module grows. The alternative
was one aggregate whose behaviour depended on a kind column, which is the shape that made ADR 0015
necessary in the first place.

Nothing here scores a guided answer, so an interview session cannot tell a learner how they did. It
can tell them what a reviewer expected, which is the honest version of the same help, and it is what
ADR 0019 decided.

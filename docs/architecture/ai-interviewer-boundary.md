# The boundary a future AI interviewer may not cross

- Status: **Defined, deliberately not implemented**
- Issue: #24
- Decided by: [ADR 0005](../adr/0005-ai-assisted-authoring-human-verified.md),
  [ADR 0011](../adr/0011-grade-content-evidence.md),
  [ADR 0019](../adr/0019-behavioural-preparation-is-guidance-not-grading.md),
  [ADR 0021](../adr/0021-job-description-blueprints-explain-every-weight.md)

## Why this document exists before the feature does

#24 asks for the contract a conversational mock interviewer would consume, and asks for it **now**,
while nothing consumes it. The reason is that the cheapest moment to decide what a model may not do
is before anything depends on it doing so. Every interface below already exists and is already used
by the screens; what this document adds is the statement of what an interviewer may read, what it
may say, and what it may never produce.

A reader who wants the short version: **the model gets the reviewed material and the learner's own
statements, and it may rephrase and ask. It may not judge.**

## What it may read

Exactly what a learner sees, and at the same moment they see it:

| Source | What it carries |
|---|---|
| `GET /api/study/interviews/{id}` | the items of a session, prompts and options, no answer material |
| `POST .../items/{position}/answer` | after the learner commits: the reference answer, the expected concepts, the common mistakes, the reviewed follow-ups |
| `POST .../items/{position}/concepts` | the learner's own marks, which they make after reading the concepts |
| `GET /api/study/interviews/evidence` | counts per topic, the two cases accuracy hides, and signals as kinds with their counts |
| `GET /api/study/interviews/blueprints/{id}` | the weights of a role and the terms behind each one |

Three of those are already closed to it before an answer exists. Nothing in the payload of an
unanswered item contains correctness, an answer key, an option flag, an explanation, a reference or
verification output — the same rule practice and mock runs are held to, and the same tests hold it.

## What it may do

- **Ask a reviewed follow-up.** `followUps` is revision content, written by a person. An
  interviewer may ask one, in the learner's language, and may rephrase it.
- **Ask for more depth in the learner's own words**, without recording the answer. The product never
  receives a guided answer and that does not change because a model is in the conversation: if the
  text reaches a server it is a new decision with its own review, not an implementation detail of
  this one.
- **Restate the reviewed material.** The reference answer and the expected concepts may be
  explained, compared, or broken into steps.
- **Point at what the learner said.** "You marked *durable duplicate detection* as not covered,
  twice" is a restatement of recorded evidence, and the responses behind it are in the payload.
- **Propose terms for the job-description dictionary**, which a human then reviews, exactly as
  ADR 0005 has a model propose content.

## What it may never produce

- **A judgement of whether an answer was right.** A guided answer is graded by nothing (ADR 0019).
  A model saying "that was correct" would be the grading that ADR forbids, with no reviewer behind
  it and no way for the learner to check it.
- **A new canonical answer, concept, mistake or follow-up.** If it is not in the revision, it is not
  reviewed, and unreviewed material presented as what an interviewer expects is exactly the failure
  ADR 0005 exists to prevent.
- **A readiness, fit or hiring number of any kind.** No probability of an offer, no percentage, no
  level, no "you are ready". #22 defers it, #24 defers it, and the blueprint and evidence screens
  both say so to the learner in as many words.
- **A claim about the person.** Not about their communication, their confidence, their seniority or
  their suitability. The evidence carries counts of what they answered and statements they made
  themselves; a sentence about who they are is not derivable from either.
- **A weight with nothing behind it.** If the interviewer suggests what to study, it cites the
  terms, counts or marks it read. ADR 0021's rule is that a learner can disagree with the advice,
  and they can only disagree with something that was shown to them.
- **Anything written to the record.** The interviewer has no write path. Responses, marks, evidence
  and blueprints are written by the learner's own actions, through the endpoints above, and an
  immutability trigger refuses a rewrite of any of them.

## The boundary in one sentence, for the next person who implements it

> It consumes reviewed content and the learner's own statements, and it produces questions and
> restatements — never a verdict, never a number about a person, and never a canonical answer.

## Deferred with it

Live voice, webcam analysis, emotion or personality inference, automated hiring decisions, and
unbounded interviewing with no reviewed material behind it. These are the explicit non-goals of
#24, and none of them become acceptable by being implemented well.

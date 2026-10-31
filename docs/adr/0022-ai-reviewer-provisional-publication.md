# ADR 0022: Let an AI reviewer provisionally approve and publish Asserted-tier content, disclosed and time-boxed

- Status: **Accepted**, with decision 4 (the confirmation window) and decision 5 (derived lapse)
  superseded by [ADR 0025](0025-ai-reviewer-approval-is-final.md): an AI approval is now final, not
  provisional. Decisions 1-3, 6 and 7 below stand as written.
- Date: 2026-10-29
- Issue: none; the product owner asked for this exception directly, aware that it amends [ADR 0005](0005-ai-not-source-of-truth.md), [ADR 0011](0011-grade-content-evidence.md) and [ADR 0018](0018-maintainer-may-review-their-own-work.md)

## Context

[ADR 0011](0011-grade-content-evidence.md) names the real constraint: human review does not scale, and a
bank large enough to be useful needs hundreds of questions. It answers that by grading evidence —
**Verified** questions carry a compiled, run program that mechanically establishes the answer key;
**Asserted** questions rest on prose and references alone and still need the full technical review
[ADR 0005](0005-ai-not-source-of-truth.md) requires of everything. Tiering narrowed the bottleneck. It did
not remove it: the Asserted backlog is still gated one-for-one on a human's time, and that is the
constraint the product owner asked this ADR to relax.

ADR 0005 says plainly: AI "cannot approve content... when deterministic validation is possible," and
"[p]ublished content requires human technical review." That is not a technical limitation being worked
around here — it is the product's central promise, restated in [ADR 0018](0018-maintainer-may-review-their-own-work.md)
as "a person, not a machine, is the source of technical correctness." This ADR carves out one narrow,
disclosed, time-boxed exception to that promise rather than quietly eroding it, because the alternative —
an undisclosed or permanent exception — was rejected outright before this was written (see Rejected
alternatives).

This is not a proposal to wire a live model call into the publish endpoint that judges correctness at
request time. It is a labelled channel: an account representing an AI acting as reviewer, operating
through the same editorial API every human reviewer uses, whose decisions are recorded as what they are
and never disguised as independent human judgement — the same shape ADR 0018 already uses for self-review.

## Decision

**1. Scope: Asserted-tier revisions only.** A revision with verification evidence (a compiled, run
program — the Verified tier) is never eligible for this path; a Verified revision still needs exactly
the human approval ADR 0005 and ADR 0011 already require, unchanged. This targets the actual
bottleneck — content with no mechanical evidence behind it — rather than relaxing the judgement a
compiler cannot supply (plausibility of distractors, completeness of explanations, accessibility),
which Verified content still needs from a human.

**2. A new, narrower permission: `CONTENT_AI_REVIEW`.** Granted to a dedicated account (role
`AI_REVIEWER`) created by the administrator the same way any account is created, never inferred from
`CONTENT_REVIEW`. It is deliberately not `CONTENT_REVIEW`: an account holding only `CONTENT_AI_REVIEW`
can decide on an Asserted revision and nothing else, and its decision is provisional by construction
(decision 4), where a `CONTENT_REVIEW` decision is final.

**3. AI-approval both approves and publishes, in one step, recorded as what it is.** Calling this action
on a `TECHNICAL_REVIEW` Asserted revision records a review decision with a distinct code,
`AI_APPROVED` — never stored as `APPROVED`, for the same reason ADR 0018's self-review is recorded as
what happened rather than disguised as independent review — then publishes immediately through the
same checks `publish` already runs (topic active, Java release agreement, objective verification). The
fast lane is exactly that: one step, not two, because the whole point is to stop a human's calendar from
gating this content's path to a learner.

**4. Provisional, not permanent: a confirmation window.** An `AI_APPROVED` publication is published, but
provisional, for a configured window (`certforge.editorial.ai-review-confirmation-window`, default 14
days). Within that window, any account holding `CONTENT_REVIEW` — other than the revision's author,
under the same separation rule `requireSeparation` already enforces — may record a confirmation decision,
`AI_REVIEW_CONFIRMED`. A confirmed revision carries exactly the trust an ordinarily-approved one does,
permanently, for the same reason a confirmation is a real independent human review of real content
already sitting in front of a learner, which is at least as rigorous a review as one performed on a
draft.

**5. Lapse is derived on read, never a stored, scheduled mutation.** A revision whose latest
`AI_APPROVED` decision has no later `AI_REVIEW_CONFIRMED` and is older than the window stops being
eligible the instant that becomes true, in both reads that pick something new for a learner to study —
`QuestionBank.eligibleForTopic` and `QuestionBank.eligibleForInterview`. Nothing flips a stored status
column and no scheduled job runs; the rule is evaluated from the review history and the clock every time
one of those reads is served, in the same spirit [ADR 0013](0013-derived-review-queue.md) prefers deriving
over storing scheduler state. A learner already mid-session keeps the revision they were already shown —
`findSnapshotQuestion` and `findPublished` are unchanged — because ADR 0003's immutability promise is
about not rewriting what a learner already saw, not about whether to offer it to someone new.

**6. Disclosed, not just recorded — to the learner, not only the editorial desk.** The learner sees
when a question they are looking at was reviewed by AI and not yet independently confirmed by a person,
the same way the editorial desk already discloses a self-review. This is the same transparency
precedent ADR 0018 set: "accepted, never disguised."

**7. What does not change.** Verified-tier publication. The independent-review separation rule for every
other decision. [ADR 0004](0004-authorial-content-only.md) — an AI reviewer judges only authorial
content; it does not author it, and it certainly does not license anything previously disallowed.
[ADR 0011](0011-grade-content-evidence.md)'s tiering itself. The content policy's existing AI-policy
sentence is narrowed by exactly this ADR, not replaced by it: AI may now provisionally approve and
publish, and only in the one path this ADR names, with the one disclosure and the one expiry it
requires.

## Consequences

- This is an explicitly accepted exposure, not a claim of equal safety: unlike every other published
  question in the product, an `AI_APPROVED` revision sitting unconfirmed has not yet been checked by
  anyone who, in ADR 0018's words, "does not already believe the answer." The window bounds how long
  that exposure can last before the content disappears from new study again on its own.
- A learner's eligible-question count for a topic can shrink on its own, with nobody having acted,
  the day an `AI_APPROVED` revision lapses. The editorial desk should surface the pending-confirmation
  queue somewhere a reviewer actually looks; which page and how prominently is an implementation
  decision, not a rule this ADR fixes.
- The review record keeps three decision codes where it had two: `AI_APPROVED` and
  `AI_REVIEW_CONFIRMED` join `APPROVED` and `CHANGES_REQUESTED`. Nothing downstream may ever read
  `AI_APPROVED` as `APPROVED`; they are deliberately different strings precisely so a query cannot
  confuse them by accident.
- A revision can be `AI_APPROVED`, lapse, and later be confirmed anyway — confirmation after lapse is
  still accepted and still upgrades it to permanent trust, because the content did not change, only
  whether it was currently being offered to new learners.
- `deploy/publish-pack.mjs` and the bulk content-pack pipeline are untouched by this ADR: it is a
  statement about the live editorial API's review step, not about the separate static-pack import
  tooling ADR 0011 also discusses.

## Rejected alternatives

- **Permanent AI approval, with no human confirmation ever required.** This was the original shape of
  the proposal. Rejected because it would make the AI's judgement final for an entire tier of content
  with no bound on how long unchecked content could remain in front of learners — the opposite of what
  "provisional" is supposed to mean.
- **Extending the exception to Verified-tier content.** Rejected because Verified content's remaining
  human step is exactly the judgement a compiler cannot make (plausibility, completeness,
  accessibility), which is not the backlog this ADR exists to relieve.
- **An undisclosed flag, visible only to the editorial desk.** Rejected on the same grounds ADR 0018
  rejected disguising self-review: the record would let a learner believe a question was independently
  reviewed when it was not.
- **A stored, scheduled expiry (a batch job that flips status to lapsed).** Rejected in favour of
  deriving the lapse at read time, consistent with [ADR 0013](0013-derived-review-queue.md): there is no
  second source of truth about whether a revision is currently eligible, and nothing can drift from the
  review history that produced it.
- **Wiring a live model call into `publish()` to judge correctness automatically at request time.**
  Out of scope for this ADR. What this decision creates is a reviewer identity and a provisional
  publication state that an agent can use through the existing editorial API; it does not create, and
  should not be read as endorsing, an automated inference step that decides correctness inside the
  request path.

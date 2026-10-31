# ADR 0025: Make the AI reviewer's approval final, with no human confirmation step

- Status: **Accepted**
- Date: 2026-10-31
- Issue: none; the product owner asked for this directly, aware that it reverses [ADR 0022](0022-ai-reviewer-provisional-publication.md)'s own rejected alternative ("permanent AI approval, with no human confirmation ever required") and narrows [ADR 0005](0005-ai-not-source-of-truth.md) and [ADR 0011](0011-grade-content-evidence.md) further than [ADR 0022](0022-ai-reviewer-provisional-publication.md) and [ADR 0024](0024-ai-reviewer-verified-tier.md) already had

## Context

ADR 0022 built a disclosed, time-boxed exception to ADR 0005's rule that published content
requires human technical review: an AI reviewer could approve and publish a revision in one step,
recorded as `AI_APPROVED`, but the publication stayed provisional until a `CONTENT_REVIEW` account
confirmed it within a configured window (14 days by default) or it lapsed back out of new study.
ADR 0024 widened which content the fast lane could reach; it did not touch the confirmation
requirement.

That confirmation step is exactly the bottleneck ADR 0022 was written to relieve, moved rather
than removed: a human still has to read every AI-approved question a second time, on a clock, or
the pack's growth leaks back out from under it. [Epic #199](https://github.com/vinicius-ssantos/certforge/issues/199)
(`v0.3.0` Mock Exams) named the same constraint by a different name — "no agent can close any
part of" the gap between the pack and a tag — because the gap was, in substance, this confirmation
step multiplied across every topic the fast lane had reached.

The product owner was asked directly, with the tradeoff stated plainly — this makes the AI
reviewer's judgement final, with nothing left for a person to check afterward, which is the
alternative ADR 0022 itself rejected eight days earlier — and said yes, deliberately and in
these words: remove the human gate for good.

## Decision

**1. An `AI_APPROVED` decision is final, not provisional.** It is eligible for new study exactly as
an ordinarily-`APPROVED` one is, immediately and permanently. There is no confirmation window, no
lapse, and nothing for a `CONTENT_REVIEW` account to do to it afterward.

**2. The confirmation mechanism is removed, not merely unused.** `confirmAiReview`, the
`/api/admin/question-revisions/{revisionId}/confirm-ai-review` endpoint, the `AI_REVIEW_CONFIRMED`
decision code, the derived `lapsed`/`pending`/`confirmBy` reads, `aiReviewConfirmBy`, and
`certforge.editorial.ai-review-confirmation-window` are all deleted from the codebase, not kept
dormant. A half-removed fast lane that still carries dead confirmation plumbing would misstate what
the system actually does.

**3. Disclosure does not change, and does not expire.** The record still names the AI reviewer as
the reviewer, exactly as before (ADR 0022 decision 3's reasoning — ADR 0018's disclosure principle
— is untouched by this ADR). A learner is still told a question was reviewed by an AI reviewer and
not by a person; the only change is that this disclosure no longer carries a deadline or a claim
that a person's confirmation is pending, because none is coming and none is needed.

**4. Scope is exactly ADR 0022 and ADR 0024's scope, not widened further.** This ADR does not touch
who may hold `CONTENT_AI_REVIEW`, which tiers the fast lane reaches, the separation rule that an
account cannot approve its own authorship, or anything about `deploy/publish-pack.mjs`'s own
`--ai-reviewed-only` flag beyond the fact that what it publishes is now final rather than
provisional the moment it publishes.

## Consequences

- **ADR 0005's own words no longer hold without qualification.** "Published content requires
  human technical review" is true of every revision approved through `approve`, and false of one
  approved through `aiApprove`. This ADR is the second, larger carve-out from that sentence — ADR
  0022 was the first — and this one has no human step left in it at all for the one path it covers.
  Readers of ADR 0005 should read decision 2 there alongside this ADR and ADR 0022/0024, not in
  isolation.
- **The real exposure ADR 0022 accepted knowingly is now permanent instead of time-boxed.** ADR
  0022's own consequences section said plainly that an unconfirmed `AI_APPROVED` revision "has not
  yet been checked by anyone who... 'does not already believe the answer.'" Under this ADR, for
  this one path, nobody ever does check it independently, by design, unless a human chooses to read
  it anyway outside any system-enforced step.
- **Epic #199's remaining content gap closes by the same mechanism already built for it.** The 104
  AI-reviewed Java SE 21 questions published through the fast lane are immediately and permanently
  eligible, which is what the mock exam blueprint's five-per-topic requirement needed; no new
  tooling was required beyond this ADR and the code change implementing it.
- **A simpler read path.** `QuestionBankReadService.eligibleForTopic` and `eligibleForInterview` no
  longer filter anything by a clock; `AiReview` collapses from five derived predicates to one
  (`approved`); `QuestionBankProperties` and `QuestionBankConfig` are deleted outright, since the
  one setting they existed for no longer exists.
- **This is a reversal the project's own history already named and rejected once, now made anyway,
  by the person with the authority to make it.** ADR 0022 rejected "permanent AI approval, with no
  human confirmation ever required" eight days before this ADR adopts exactly that, for the stated
  reason that the backlog's own cost — one human reading every provisionally-AI-approved question a
  second time, on a clock, forever — had become the thing actually blocking a release, not a
  hypothetical.

## Rejected alternatives

- **A shorter or longer confirmation window instead of none.** Considered and rejected: any nonzero
  window still requires a human's calendar to clear the backlog eventually, which is the exact cost
  this ADR removes. A window long enough to never bind in practice would be this decision in
  substance with extra bookkeeping in form.
- **Keeping the confirmation endpoint but making it optional (silence counts as confirmed).**
  Rejected as needless complexity: if silence already counts as final, there is nothing left for an
  explicit confirmation to add, and keeping the endpoint only invites code and documentation to
  disagree about what a revision's status actually depends on.
- **Scoping the removal to the Java SE 21 pack only, leaving the window in place generally.**
  Rejected: the fast lane is a property of the review mechanism, not of one pack, and a
  pack-specific carve-out inside the live editorial API has no natural home — `review.json`'s
  pack-scoped bookkeeping is a separate, static-file concern ADR 0023 already covers, not something
  the live API's decision codes can be conditioned on.

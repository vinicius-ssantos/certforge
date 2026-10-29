# ADR 0024: Extend the AI-reviewer fast lane to Verified-tier content, with its own recorded checklist

- Status: **Accepted**
- Date: 2026-10-29
- Issue: none; the product owner asked directly, after confirming that every one of #80's 104
  currently-unreviewed Java SE 21 questions is Verified-tier and therefore unreachable by
  [ADR 0022](0022-ai-reviewer-provisional-publication.md) and
  [ADR 0023](0023-ai-reviewer-fast-lane-for-content-packs.md) as they stood

## Context

ADR 0022 restricted the AI-reviewer fast lane to Asserted-tier content on purpose: a Verified-tier
revision already has a compiler's proof that the answer key is correct, and what remained was
explicitly the judgement a compiler cannot supply — plausibility of distractors, completeness of
explanations, accessibility of code and prose. ADR 0023 carried that same restriction into the
content-pack scripts. Both were written honestly, and both turned out, once the real backlog was
checked, to restrict the AI reviewer out of the one thing #80 actually needs: every question left
unreviewed in `content/java-se-21` now carries a verified program. There is no Asserted-tier backlog
left to relieve.

The product owner was asked directly whether to lift the restriction, with the tradeoff stated
plainly — the AI reviewer would now be the one making exactly the judgement ADR 0022 had reserved for
a person — and said yes.

## Decision

**1. The Asserted-tier restriction is lifted. The AI reviewer may approve a Verified-tier revision.**
`QuestionBankService.aiApprove` no longer refuses one for carrying verification evidence; the live
`ai-approve` endpoint accepts either tier. `content/record-review.mjs --ai-reviewed` no longer refuses
one either. Everything else about the fast lane is unchanged: `AI_APPROVED`, never disguised as
`APPROVED`; the confirmation window; the derived lapse; the learner disclosure; the separation rule
that an account cannot approve its own authorship.

**2. An AI approval now records which policy checks it actually made, the same way a human's does.**
`aiApprove` gains the same `checklist` field `approve` already has, validated against the same
`ReviewChecklist.ITEMS`. This was optional while the fast lane only reached Asserted content, where a
compiler had already settled the one thing a checklist item like `CODE_VERIFIED` would otherwise be
attesting to. Reaching Verified content changes that: the AI reviewer is now the one vouching for
distractor plausibility and explanation completeness, and a bare `AI_APPROVED` with no stated scope
would be a weaker record than the human path already keeps for the same decision.

**3. The content-pack scripts carry a per-question checklist for an AI review, where the human path
carries one pack-wide.** `record-review.mjs --ai-reviewed --checklist ITEM,ITEM` stores the ticked
items on that question's own `review.json` entry; `reviewStatusOf` reports them; `publish-pack.mjs`
passes them to `ai-approve` instead of an empty list. The pack's single `record.checklist` continues to
describe what its named human reviewer attested to for the pack as a whole — unaffected, and still what
a human-reviewed question in the same pack carries forward to `approve`.

**4. What does not change.** The AI reviewer still never authors; it still never finally approves
anything — every AI-sourced publication is provisional until a `CONTENT_REVIEW` account (never the
author) confirms it within the window, or it lapses back out of new selection on its own. Disclosure to
the learner is identical for either tier: `PublishedQuestion.aiReviewed` does not distinguish which tier
produced it, because the thing being disclosed — unconfirmed AI judgement — is the same claim either
way.

## Consequences

- #80's real backlog — 104 Verified-tier questions — is now reachable by the mechanism this project
  already built for exactly this purpose, rather than needing a third ADR to notice the restriction was
  the wrong one to keep.
- The AI reviewer's record for a Verified-tier approval states, per question, which of the five policy
  checks it made. A reader of `review.json` or the editorial desk's review notes can tell a thin
  AI approval (ticked nothing) from a thorough one, the same way they already can for a human's.
- This is a wider exposure than ADR 0022 originally accepted: the AI reviewer's judgement now stands,
  provisionally, for claims a compiler cannot check at all. The window and the confirmation requirement
  are the same bound that already existed; they are carrying more weight than before, by design, not by
  omission.
- `docs/product/content-policy.md`'s AI-policy paragraph is widened to say so: the fast lane it already
  named now also reaches Verified-tier content, under the same disclosure and the same window.

## Rejected alternatives

- **Leaving the restriction in place and asking a human to review the 104 questions instead.** This was
  the standing answer until the product owner asked for this ADR directly; it remains available by
  simply not using `--ai-reviewed` on a given question, which the tooling still supports exactly as
  before.
- **A shorter confirmation window for Verified-tier AI approvals, on the theory that the exposure is
  larger.** Rejected for now as an unmotivated number: ADR 0022's 14 days was not derived from the
  Asserted tier's risk profile in a way that would make a different number principled here either. If
  evidence later suggests the window should differ by tier, that is what would have to motivate changing
  it, not this ADR's own choice to widen scope.
- **Not recording a checklist for the AI-approve path, as before.** Rejected once the restriction moved:
  a bare approval was tolerable when nothing it attested to needed human-shaped judgement to establish;
  now that it does, the record should say what was actually checked, the same way ADR 0011 already asks
  of a human review.

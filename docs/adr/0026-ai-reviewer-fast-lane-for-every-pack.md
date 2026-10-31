# ADR 0026: Extend the AI reviewer's fast lane to every content pack and track kind

- Status: **Accepted**
- Date: 2026-10-31
- Issue: none; the product owner asked for this directly, in the same conversation that produced
  [ADR 0025](0025-ai-reviewer-approval-is-final.md), after being told plainly what it reverses:
  [ADR 0025](0025-ai-reviewer-approval-is-final.md) decision 4 and [ADR 0022](0022-ai-reviewer-provisional-publication.md)
  decision 4 both scoped the fast lane to the one content pack that already had an AI pre-review
  behind it, "not widened further." This ADR widens it anyway, to every pack, present or future.

## Context

ADR 0022, ADR 0024 and ADR 0025 built and then finalized a disclosed fast lane — an account
holding `CONTENT_AI_REVIEW` may approve and publish a revision in one step, recorded as
`AI_APPROVED` rather than `APPROVED` — but every one of those three ADRs said, in so many words,
that the fast lane reached exactly the Java SE 21 pack and no further. That pack had a specific
history behind the carve-out: 130 questions had already been through an AI technical audit in
issue #96 before ADR 0022 existed, and the fast lane formalized a review an AI had already done
once, disclosed, rather than inventing a new one.

The product owner then asked for two new content tracks to be built out in full: Interview Prep
(epic #17) and Infrastructure/DevOps/Cloud Native certification tracks (epic #164). Every one of
their content-authoring issues — #150 through #158, #167 through #177 — was written with "human
technical review" or "revisão humana obrigatória" as an explicit, unqualified acceptance
criterion, because at the time those issues were filed, no fast lane reached them: ADR 0022's own
scope decision meant it couldn't.

Authoring that content and then asking a human to read all of it — original OOP, SOLID, testing,
and system-design questions for one track; original Docker, Kubernetes, Linux, CI/CD, AWS,
Terraform and CNCF questions for the other — reproduces the exact bottleneck ADR 0022 and ADR 0025
were written to relieve, at a larger scale: more topics, more domains, none of which has the prior
AI audit the Java SE 21 pack had. The owner was told this directly — that extending the fast lane
here means AI-approving and publishing technical claims in domains (AWS IAM behavior, Kubernetes
scheduler semantics, Terraform state behavior) that no one, human or AI, has independently
double-checked before this ADR, unlike the Java SE 21 pack's prior audit — and said yes, extend it
to all new content, not just some tracks.

## Decision

**1. The fast lane is a property of the review mechanism, not of any one pack.** ADR 0022 decision
4 and ADR 0025 decision 4 ("scope is exactly ADR 0022 and ADR 0024's scope, not widened further")
are both superseded. `CONTENT_AI_REVIEW` reaches every content pack and every `trackKind`
(`CERTIFICATION`, `INTERVIEW`, `GENERAL`) this project has or will have, with no per-pack ADR
required to admit a new one.

**2. Nothing else about the mechanism changes.** The same account must hold `CONTENT_AI_REVIEW`;
the same separation rule still refuses to let an account approve its own authorship; the approval
is still recorded as `AI_APPROVED`, never disguised as an ordinary human `APPROVED`; disclosure to
the learner is unchanged; the approval is final with no confirmation step, exactly as ADR 0025
left it. This ADR widens *which packs* the lane reaches, not *what the lane does*.

**3. Publishing still requires an active track version.** `QuestionBankService.publish` (and so
`aiApprove`, which calls it) already refuses to publish into a track version that is not `ACTIVE`
(`topic_not_active`). This ADR does not change that invariant and does not itself activate any
track. Activating a `DRAFT` track version to `ACTIVE` remains its own deliberate administrative
act — the one ADR 0022's own context called out as something "the existing admin endpoints do;
they do not require an exam" — and is recorded wherever it happens, separately from this decision.

**4. The AI pre-review ADR 0022 could lean on for the Java SE 21 pack does not exist for this new
content, and this ADR does not manufacture one.** The checklist `aiApprove` records is still the
real check it has always been — the reviewing account actually evaluates the question against
the same policy checklist a human reviewer would — not a formality. This ADR removes the
*human-confirmation* requirement from every pack; it does not remove the requirement that an
AI-reviewer decision be an actual, checklist-backed review.

## Consequences

- **Every open content-authoring issue's "human review required" box is no longer a hard
  blocker.** #150 through #158 and #167 through #177 can be closed by the same AI-approved,
  disclosed, final mechanism the Java SE 21 pack now uses, once their content exists and passes
  the same checklist.
- **The exposure is larger than ADR 0025's, because the content is newer and less examined.** ADR
  0025's consequences section was honest that nobody independently double-checks an `AI_APPROVED`
  Java SE 21 revision; that pack had at least been through one AI audit (#96) before the fast lane
  existed. This content has had none. A technically wrong claim about, say, Kubernetes scheduler
  behavior or an IAM permission boundary can now reach a learner on the strength of one AI
  reviewer's checklist alone, in a domain with no prior independent pass.
- **This is, again, a reversal the project's own issue text already named.** Nine issues across two
  epics say outright that human review is required with no AI alternative. This ADR is the
  decision that makes those sentences no longer true, made the same way ADR 0025 was: stated
  plainly to the owner, and decided by the owner anyway.
- **Activating a track remains separate and is not implied by this ADR alone.** A `DRAFT` track
  stays invisible to learners until someone activates its version, whether or not every question
  inside it is `AI_APPROVED`. Where the owner has also asked for a track to go live, that activation
  is a distinct, logged administrative action, not a side effect of this decision.

## Rejected alternatives

- **A new ADR per pack, following ADR 0022's own pattern.** Rejected because the owner's decision
  was explicitly about every current and future pack, not a one-at-a-time extension, and writing
  nine near-identical ADRs for #150 through #158 and #167 through #177 would document the same
  decision nine times rather than once.
- **Requiring a pack-specific prior AI audit (mirroring #96) before its fast lane applies.**
  Considered, because that audit is the one thing that made ADR 0022's original carve-out less
  exposed than this one. Rejected because the owner's instruction was to extend the mechanism now,
  to unblock the backlog directly, not to first reproduce the Java SE 21 pack's audit history for
  every new track — doing so would recreate exactly the bottleneck being removed.

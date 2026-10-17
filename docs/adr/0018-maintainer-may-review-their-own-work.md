# ADR 0018: Let the maintainer review their own work, and say so in the record

- Status: **Accepted**
- Date: 2026-10-17
- Issue: none; raised while reviewing the editorial worklist against the real backlog

## Context

Two promises have been running together in this project as if they were one.

The first is [ADR 0005](0005-ai-not-source-of-truth.md): **a person, not a machine, is the source of technical correctness.** It is the only promise the product makes about its content, and it holds with one maintainer.

The second is **independent review**: the person who approves a question is not the person who wrote it. The editorial API enforced it with `reviewer_must_differ_from_author`, and until now that rule had no exception other than a deployment-wide switch, `certforge.question-bank.require-reviewer-separation`.

The second promise has never been true here, and the project's own records say so. The Portuguese interface wording was reviewed by "the project's own author, not an independent reviewer" ([ADR 0012](0012-interface-language.md)). The seventy-question DevOps pack records in its own `review.json` caveats that it is "not independent second-reviewer validation". The project is one person, and the rule was refusing the only reviewer it has.

The switch was the wrong shape for fixing it. It turns separation off for *everybody*: the day a contributor is added as an author, that contributor can approve their own questions, and nothing in the product would notice. A project reaches for that switch because of the maintainer and silently loses the rule for everyone else.

Two accounts held by the same person is worse than either. It satisfies the check and writes a decision whose reviewer id differs from the author id — which is exactly the shape of an independent review. The record would then claim something that did not happen.

## Decision

**A revision may be reviewed by its author only by an account holding `CONTENT_SELF_REVIEW`, a permission granted by the administrator role alone. Every other author still needs someone else.**

The deployment-wide switch and the `certforge.question-bank` properties that carried it are removed. One mechanism replaces two, and the narrower one survives.

The permission is named rather than inferred from the role, because `Permission` states that roles only group permissions and are never checked directly, and because the two things are genuinely different: `CONTENT_REVIEW` is "may check work", `CONTENT_SELF_REVIEW` is "whose judgement is final when there is nobody else to check it".

**A self-review is accepted, never disguised.** No new column was needed: a review whose `reviewer_id` equals the revision's `author_id` is a self-review, and the database already recorded both. What was missing was anyone saying it. The editorial desk now reads a decision by the author as "self-review: the reviewer wrote it", the publish confirmation names the approver as "reviewing their own work", and the review worklist tells the reviewer, before the press, that approving their own revision will be recorded as a self-review.

## Consequences

A one-maintainer instance works without configuration and without pretending. The maintainer approves their own questions, and every record of those approvals says who made them and that the reviewer and the author were the same person.

A project with two people keeps the strong rule for free: an author who is not the administrator cannot approve their own work, and no switch exists to let them.

The end-to-end suite no longer relaxes anything for review separation. Its fixtures publish as the bootstrap administrator, which holds the permission, so the relaxation it used to need is gone from `compose.e2e.yaml`, `ci.yml` and the web README.

What this does **not** do is make a self-review as good as an independent one. It is not: the value of a second reader is that they do not already believe the answer. The project should say, in whatever it publishes about its content, that approvals on a single-maintainer instance are self-reviews. This ADR is what makes that statement checkable rather than a matter of memory.

## Rejected alternatives

**Keep the switch and turn it off.** Simplest, and the most dangerous: it removes the rule for every future author, and it leaves the record unable to tell a self-review from an independent one.

**Check the `ADMINISTRATOR` role in the editorial service.** Same behaviour today, but it contradicts the rule that roles are never checked directly, and it ties an editorial authority to an operational one: an account made administrator to run deployments would silently gain the right to approve its own questions.

**A second account held by the same person.** Satisfies the check by falsifying the record. Rejected on the same grounds as ADR 0005: the provenance has to describe what actually happened.

**Record a flag on each decision.** Unnecessary. `reviewer_id` and `author_id` are both stored; the distinction is derivable, and a derived fact cannot drift from the data it is derived from.

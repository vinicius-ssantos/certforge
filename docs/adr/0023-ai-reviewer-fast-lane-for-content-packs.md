# ADR 0023: Extend the AI-reviewer fast lane to the content-pack publishing scripts

- Status: **Accepted**
- Date: 2026-10-29
- Issue: none; the product owner asked directly for ADR 0022's exception to reach the content-pack
  backlog (#80 and its per-topic sub-issues), after confirming it is a different system from the live
  editorial desk ADR 0022 was written against

## Context

[ADR 0022](0022-ai-reviewer-provisional-publication.md) built the AI-reviewer fast lane against the
live editorial HTTP API: an account holding `CONTENT_AI_REVIEW` can approve and publish a
`TECHNICAL_REVIEW` Asserted-tier revision in one step, provisionally, disclosed to the learner. #80 and
its ten per-topic sub-issues (#141–#148 among them) ask for exactly the kind of review that bottleneck
describes — 130 unreviewed Java SE 21 questions — but they are not a request against that live API.
They are a request against `content/java-se-21/review.json`, read by `content/record-review.mjs`,
`content/pack.mjs` and `deploy/publish-pack.mjs`.

Those scripts turned out, on inspection, not to be a second storage system. `deploy/publish-pack.mjs`
reads a verdict a reviewer already recorded in `review.json` and then drives the *same* live editorial
API `submit` → `approve` → `publish` sequence a browser would, using an account's own credentials
passed on the command line. The content pack is authored text waiting to be pushed through that API by
script instead of by hand; ADR 0022's mechanism is squarely reachable here, once these scripts know the
new path exists.

One real difference from ADR 0022's own text matters: `record-review.mjs` already refuses a second
reviewer identity on purpose — "a second reviewer is a claim about who read the question; add them to
review.json deliberately rather than through this tool." That refusal is correct and stays; this ADR is
the deliberate addition it was written to require, not a way around it.

## Decision

**1. `review.json` gets one new, optional, per-question field: `reviewer`.** Absent, an entry still
means exactly what it always has — reviewed by the pack's named human reviewer at the top of the file.
Present and equal to the literal string `"ai-reviewer"`, it means this one question's entry was reviewed
and recorded by the AI reviewer instead, for exactly the same reason ADR 0022 records `AI_APPROVED`
rather than `APPROVED` in the live database: disclosed, never disguised as the human reviewer's own
verdict. `content/pack.mjs`'s `reviewStatusOf` reports `entry.reviewer ?? record.reviewer`, so every
existing call site that reads `.reviewer` already reports the right name without change.

**2. `content/record-review.mjs` gets a new flag, `--ai-reviewed`, not a relaxed check.** It writes
`reviewer: "ai-reviewer"` into the entry instead of leaving the field absent, and it is incompatible
with `--reviewer` — passing both is refused, the same way an unknown verdict is refused, because the
identity this flag records is not a free-text claim, it is a fixed, disclosed one. Every other rule in
the tool is unchanged: the digest is still recomputed from the question as it stands, not trusted from
the caller, and nothing here lets this flag claim a verdict about a question nobody actually read.

**3. Scope: Asserted-tier questions only, exactly as ADR 0022 restricts.** A question with a runnable
program and a verified output (the Verified tier, ADR 0011) is not eligible for `--ai-reviewed`; the
tool refuses it the same way the live endpoint refuses a Verified revision passed to `ai-approve`. Of
the 130 unreviewed Java SE 21 questions #80 counts, this reaches the Asserted-tier conceptual/reference
questions among them; the Verified-tier ones still need exactly the human review ADR 0011 and ADR 0022
already require, unchanged.

**4. `deploy/publish-pack.mjs` drives two paths through the same pack, by what each question's entry
says.** A question whose `reviewStatusOf(...).reviewer` is `"ai-reviewer"` is published through
`submit` (as the author/admin account already in use) then a single `ai-approve` call, using a
dedicated account holding `CONTENT_AI_REVIEW` — `--ai-reviewer-email`/`--ai-reviewer-password` (or
`CERTFORGE_AI_REVIEWER_EMAIL`/`CERTFORGE_AI_REVIEWER_PASSWORD`), new flags beside the existing
`--reviewer-email`/`--reviewer-password`. A question reviewed by the pack's named human still goes
through `submit` → `approve` → `publish` exactly as before. Either credential pair is required only
when the current run actually has a question that needs it — a pack reviewed entirely by the AI
reviewer never needs `--reviewer-email` at all, and vice versa. The self-review refusal that already
exists for the human reviewer (`reviewerEmail === adminEmail`) gets the same check for the AI-reviewer
account.

**5. A new script, `deploy/grant-ai-reviewer.mjs`, mirrors `deploy/grant-reviewer.mjs`.** It creates or
finds an account and grants it `AI_REVIEWER`, refusing if that account already holds `REVIEWER` or
`ADMINISTRATOR` — the same thing [Role.java](../../src/main/java/dev/certforge/identity/Role.java)'s
own Javadoc already asks of this role: never the same account as a human reviewer, because that would
make its approvals final, which is exactly what this path does not allow.

**6. What does not change.** The live database mechanics ADR 0022 already built — `AI_APPROVED`,
`AI_REVIEW_CONFIRMED`, the confirmation window, the derived lapse, the learner disclosure — apply
identically to a question published this way, because publishing it calls the very same endpoint. A
human confirming it within the window, or letting it lapse back out of new selection, works exactly as
ADR 0022 already describes; nothing about *that* half of the mechanism needed to change for a
script-driven caller instead of a browser.

## Consequences

- `#80`'s 130-question backlog splits into two queues by tier: the Asserted-tier ones this ADR reaches,
  and the Verified-tier ones that still need a human reviewer regardless, the same restriction ADR 0022
  already drew.
- A published, AI-reviewed question from this pipeline is exactly as provisional as one approved
  through the browser: disclosed to the learner, and excluded from new selection again if nobody with
  `CONTENT_REVIEW` confirms it within the window. Running this script is not the end of the story for
  that question; confirming it still is.
- `review.json`'s existing single-human-reviewer shape is preserved for every question this path does
  not touch. A reader of the file who has never heard of this ADR still reads the ordinary entries
  exactly as before; only an entry that says `"reviewer": "ai-reviewer"` is new, and it says so plainly.
- `content/review-integrity.mjs` and the manifest-pack scheme it checks are untouched: this ADR amends
  the digest-based scheme `java-se-21`'s `review.json` already uses, not the git-blob scheme a manifest
  pack uses, which still has no AI-reviewer path at all.

## Rejected alternatives

- **Treating `review.json`'s top-level `reviewer` field as overridable per run.** Rejected: the pack's
  named human reviewer is a fact about who has reviewed most of the pack, and changing it for one
  invocation would misstate every other entry's provenance along with it. A per-question field says
  only what changed.
- **Skipping `review.json` and calling `ai-approve` directly from a one-off script, never touching the
  pack's own review record.** Considered, and rejected: #80's own definition of done is a `review.json`
  entry per question, the same artifact a human reviewer would produce, and the commit history of that
  file is itself part of the record this project keeps. Bypassing it would publish real content while
  leaving the backlog issue's own tracked state saying the question was never reviewed.
- **Letting `--ai-reviewed` also accept Verified-tier questions, since the live endpoint's own guard
  would refuse them anyway and the script could just surface that error.** Rejected in favour of
  refusing earlier, at the point the record is written: a `review.json` entry that would be refused the
  moment anyone tried to publish it is a worse record than no entry at all.

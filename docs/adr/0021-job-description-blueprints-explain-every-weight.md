# ADR 0021: Weigh a job description with a reviewed dictionary, and explain every weight

- Status: **Accepted**
- Date: 2026-10-24
- Issue: #22

## Context

A learner preparing for a specific role does not want the whole taxonomy evenly. The advert in front
of them names Kafka four times and never mentions concurrency, and their preparation should follow
that. #22 asks for a job description to become weighted preparation.

The obvious implementation is to hand the advert to a model and let it return weights. #22 rules
that out in a single line — opaque AI-only weighting is deferred — and [ADR
0005](0005-ai-assisted-authoring-human-verified.md) and [ADR
0011](0011-grade-content-evidence.md) say why in general: in this product an AI is never the source
of technical correctness, and a claim nobody can check is not evidence. A weight is a claim. "Study
concurrency harder than persistence" is advice about where a learner spends a week of their life,
and if the only answer to *why* is that a model said so, the learner cannot disagree with it,
because there is nothing to disagree with.

There is a second trap. The taxonomy already carries weights — `V14` seeds them on a 1 to 5 scale as
an editorial judgement about what a Pleno/Sênior screen asks. A blueprint that wrote into those rows
would let one learner's advert rewrite the taxonomy for everyone, and the next learner would inherit
a judgement that was never editorial.

## Decision

**A blueprint is a learner's own reading of one role, weighing the canonical taxonomy without
changing it, and every weight it carries can be explained by a word from the description.**

1. **The mapping is a reviewed dictionary**, `interview/job-description-terms.json`: terms per topic,
   matched case-insensitively on word boundaries. It is content, reviewed like content. Adding
   "WebFlux" to Spring is an editorial change with a diff, not a model's opinion.
2. **The weight is a count**: one point per distinct term of that topic found in the description,
   capped at 5, the scale the taxonomy itself uses. Deliberately the dullest rule that could work.
   Anything cleverer — weighting by emphasis, by position, by how senior the advert sounds — would be
   a judgement the learner cannot check.
3. **The terms are stored with the blueprint**, with where each was read: the description or a
   requirement the learner listed. "Why is Messaging weighted three?" is answered with three words.
4. **A requirement nobody recognises is named back to the learner, not guessed at.** The dictionary
   has never heard of an in-house framework, and saying so is more useful than silently dropping it
   or mapping it to the nearest-sounding topic.
5. **The learner may overrule any weight, and the record says they did.** An overridden topic is
   stored as `LEARNER`, never as something the description said, and it keeps the terms that were
   actually found — what changed is the weight, not the facts.
6. **A blueprint never writes to the taxonomy.** It references topic ids and carries its own weights,
   and it is refused outright if applied to a different taxonomy than the one it was built for.
7. **A blueprint says nothing about the learner.** No fit, no readiness for the role, no probability
   of an offer, no inferred experience. It weighs topics; it does not assess people.

## Consequences

The dictionary is now a maintained asset: a role that uses vocabulary it does not contain gets a
thinner blueprint, visibly, with the unmatched requirements listed. That is the failure mode we
want — it is legible, and it tells the maintainer exactly which term to add.

The weighting is cruder than a model's would be. It cannot tell that "deep Kafka expertise
essential" matters more than "Kafka a plus", and it will never notice a skill the dictionary lacks a
word for. The trade is deliberate: a learner can read the whole rule in one sentence and argue with
it, and overrule it when they disagree.

Keeping blueprint weights out of `catalog_track_version_topic` means a session has to combine two
sources — the taxonomy's topics and the blueprint's weights — at the moment it draws its questions.
That is where the weight has to reach, and a test draws five sessions in a row to prove it does,
because a single draw of two questions from a pool of four would come out right one time in six by
chance alone.

This ADR does not close the door on a model. It fixes where a model may stand: proposing terms for
the dictionary, which a human then reviews, exactly as [ADR
0005](0005-ai-assisted-authoring-human-verified.md) has content authoring work. What it forbids is a
model handing a learner a number with nothing behind it.

## Rejected alternatives

**Let a model weigh the description directly.** Deferred by #22, and it is the one thing ADR 0005 and
ADR 0011 exist to prevent. It would also be unreproducible: the same advert twice would give two
plans, and a learner could not tell which was wrong.

**Write the weights into the taxonomy version.** One learner's advert would become everyone's
curriculum, and the editorial scale in `V14` would stop meaning anything.

**Match on embeddings instead of terms.** Better recall, no explanation. "Why is this weighted four"
would be answered with a cosine distance, which is the opaque weighting under another name.

**Skip weights and just filter topics in or out.** Simpler, and it loses the thing the learner asked
for: an advert that mentions Kafka four times and Spring once wants more Kafka, not both equally.

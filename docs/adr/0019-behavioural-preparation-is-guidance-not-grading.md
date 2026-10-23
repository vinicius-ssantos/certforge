# ADR 0019: Behavioural preparation is reviewed guidance, and nothing about it is scored

- Status: **Accepted**
- Date: 2026-10-23
- Issue: #159

## Context

Two documents in this project disagreed about behavioural interview content.

[#20](https://github.com/vinicius-ssantos/certforge/issues/20) describes an interview pack that includes behavioural prompts — explaining a trajectory, an incident, a trade-off, something learned. `docs/product/interview-prep.md` excludes Behavioural Communication from the seeded taxonomy, because the content policy requires an authoritative reference for every claim and behavioural judgement has none to offer.

Both are defensible and they cannot both be built. The content policy is the load-bearing promise of the product: a question's answer is correct because a named person checked it against a published source, and [ADR 0005](0005-ai-not-source-of-truth.md) puts that check in a human's hands. "Was that a good answer about a production incident?" has no published source, and never will.

The temptation is to let behavioural content in with a weaker evidence story and keep the same machinery around it — the same topics, the same correctness, the same readiness percentage. That would quietly convert a reviewer's opinion into the same kind of fact as `Boolean.parseBoolean("TRUE")`, in the same number, on the same screen.

The opposite temptation is to exclude it, which is what the product document does today. That costs a real part of interview preparation, and it is not required: the project already has machinery for exactly this shape of content. `guided_response` (V16) carries a reference answer, the concepts a reviewer expected, the mistakes people commonly make, and follow-up questions — and it **computes no score**. It was built for free-form technical answers that a person judges. Behavioural material is the same shape with a weaker source.

## Decision

1. **Reviewed editorial guidance is a valid evidence source, and only in the guided-response shape.** Behavioural content is authored as guided-response questions. It is never an objective question with a correct option.

2. **It declares its own evidence type**, `reviewed-editorial-guidance`, distinct from `reference-backed`. The profile machinery in `content/pack-manifest.mjs` refuses a type its pack's profile does not admit, so a behavioural claim cannot be imported into a pack that promises published references, and a reviewer reading a packet always knows which kind of claim they are reading.

3. **Nothing about a behavioural answer is scored.** No percentage, no pass mark, no correctness, and no contribution to any readiness or progress number. A learner self-assesses against the concepts a reviewer named; the product records that they practised, never how well.

4. **What may be evaluated** is whether the answer covers what a reviewer wrote down: the concepts expected, whether a trade-off was made explicit, whether an incident has a timeline, what was learned. These are statements about the content of an answer.

5. **What must never be inferred or scored**: communication quality, confidence, personality, culture fit, seniority, leadership potential, language fluency. A machine ranking a person on any of these would be both unreliable and harmful, and the fact that the product *could* compute something from the text is not a reason to.

6. **Behavioural preparation is a practice mode, not a canonical topic.** [ADR 0014](0014-one-topic-one-track.md) binds a topic to one track, and a topic's progress feeds that track's readiness. A behavioural topic inside a technical track would put unscoreable material into a number that means "how ready am I for this exam". It lives beside the taxonomy instead, as a lens a learner chooses.

7. **Reviewer attribution and revision history are unchanged.** Guidance is authored, reviewed and versioned exactly like a technical question: the reviewer is named, the verdict is recorded against the text that was read, and a semantic edit invalidates it. The weaker source changes what the review *claims*, not whether it happened.

## Consequences

Behavioural content can be written, and the product will not pretend to grade it. The interview-prep document stops contradicting #20: the exclusion was right about the evidence model and wrong to conclude the material cannot exist.

Readiness numbers stay meaningful, because nothing unscoreable enters them. A learner who practises only behavioural prompts will see that they practised and no readiness movement, which is honest and will look empty — the alternative is a number that means nothing.

`reviewed-editorial-guidance` needs a profile that admits it before any pack can use it, and no pack declares one yet. That is deliberate: the type exists when the first behavioural pack is written, not before.

What this does not settle is which behavioural prompts are worth asking. That is content, and it needs the same named human as everything else.

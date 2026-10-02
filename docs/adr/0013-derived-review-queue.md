# ADR 0013: Derive the review queue from attempt evidence, and say why each item is in it

- Status: **Proposed.** Nothing is built yet. It is written as a recommendation with its reasoning so it can be accepted, or changed and then accepted.
- Date: 2026-10-02

## Context

`v0.2.0` Adaptive Review is meant to give a learner "a targeted review queue based on mistakes, confidence, recency, and demonstrated mastery". How that queue is produced is the whole release: the same list of questions is either a trustworthy study aid or a black box that tells people what to do for reasons they cannot inspect.

Two things already decided constrain it.

**Progress has no readiness, mastery or prediction field.** `ProgressViews` says so in a comment and the shipped projection is counts, an accuracy derived from them, and a timestamp. Principle 4 of the product is that progress must be explainable and derived from visible evidence. A scheduler that emits "review this, score 0.37" would be the first opaque number in the product.

**The evidence is already there, and it is immutable.** Every `Attempt` records the revision, whether it was correct, a `Confidence` of `LOW`, `MEDIUM` or `HIGH`, the elapsed time, and when it happened, and published revisions cannot change underneath it. Nothing new needs to be captured for a first review queue.

The standard answer is a spaced-repetition algorithm such as SM-2: per-item ease factors and intervals, mutated after each answer. It schedules well and explains badly — "your ease factor dropped to 1.96" is not a reason a learner can act on, and the stored state drifts from the evidence that produced it, with no way to tell which is right.

## Decision

**1. The queue is derived from attempt history on read, not stored as scheduler state.** Attempts are the evidence; the queue is a projection of them, like topic progress. It is therefore always reproducible from data the learner can already see, and there is no second source of truth to drift. Progress keeps a stored projection *and* a reconcile endpoint precisely because projections drift; the queue avoids needing one by not storing anything.

Deriving on read is a cost, not a free lunch. The decision is to derive first and measure with the existing baseline harness, and to add a projection only if a measurement demands it — not in anticipation.

**2. Every item states why it is there, in words, from one of a closed set of reasons.** Not a score.

- **Wrong while confident** — answered incorrectly having said `HIGH`. This is the highest priority, and it is the reason this product can give that a flashcard app cannot: a confident wrong answer is a misconception, which is more dangerous than a known gap because the learner has no reason to look again.
- **Wrong** — answered incorrectly at `MEDIUM` or `LOW`. A known gap.
- **Right but unsure** — answered correctly having said `LOW`. A guess that happened to land, which accuracy alone records as success.
- **Due for recall** — answered correctly and confidently, long enough ago that it is worth proving again.

**3. Scheduling is a stated rule, not a tuned formula.** After a question is answered correctly and confidently, the interval before it returns starts at one day and doubles with each further consecutive confident-correct answer, up to a cap. Any incorrect answer resets it. A learner can be told that in one sentence, and the rule can be changed with evidence rather than by tuning constants nobody can interpret.

**4. The queue ranks, it does not predict.** It answers "what is worth your next twenty minutes", which is an ordering of evidence. It does not answer "are you ready for the exam", which is a prediction. No readiness or mastery field is added by this release.

## Consequences

- Any item in the queue can be traced to specific attempts, which means the feature can be tested the way the rest of this project is: assert the rule, not a snapshot.
- The reason belongs in the API as a stable code, with the wording in the client, exactly as the error contract already works. That keeps it translatable, which [ADR 0012](0012-interface-language.md) will need.
- "Wrong while confident" needs the learner to have given a confidence, which is already mandatory on submission.
- Deriving on read means the query grows with a learner's history. The flows have budgets measured by `deploy/measure-baseline.mjs`; the review queue gets one too, and the decision to add a projection comes from that number.
- A derived queue cannot carry per-item state a future algorithm might want, such as an ease factor. If a later release wants one, this ADR is what it has to supersede, and the trade it is making will be explicitness for scheduling quality.

## Rejected alternatives

- **SM-2 or a similar spaced-repetition algorithm.** Better scheduling, worse explanation, and mutable per-item state that can disagree with the attempts it came from. The product's claim is explainable evidence; this would be the first place that stopped being true.
- **A single numeric priority.** Sorting needs an order, not a published number. An exposed score invites the learner to treat it as a readiness estimate, which is exactly what principle 4 and the progress module have avoided so far.
- **Capturing new signals first**, such as per-question timing percentiles or self-rated difficulty. The existing evidence supports a useful queue today; adding fields before using what is recorded is how a schema grows faster than its value.
- **Storing the queue as a projection from the start.** That is a performance decision, and there is no measurement yet that calls for it.

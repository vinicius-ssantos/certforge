# ADR 0011: Grade content evidence, and verify references mechanically

- Status: **Proposed.** It amends [ADR 0005](0005-ai-not-source-of-truth.md) rather than replacing it. Nothing in the code depends on the tiers until this is accepted. The reference check described in decision 2 ships ahead of acceptance, because it only enforces a requirement the [content policy](../product/content-policy.md) already makes.
- Date: 2026-10-02

## Context

ADR 0005 says AI cannot determine final correctness "when deterministic validation is possible", and that published content requires human technical review. It asks the same thing of every question. Two facts have since become concrete enough to act on.

**The evidence behind a question varies enormously.** Sixteen of the twenty questions in the initial pack carry a program that the build compiles for Java 21, runs, and checks prints exactly what the question claims; since #60 the option carrying that output must also be the one marked correct. Four carry nothing mechanical at all — `t01-integer-boxing-guarantee`, `t06-stream-facts`, `t07-exports-and-opens`, `t07-requires-transitive`. ADR 0005 asks one undifferentiated human review of both kinds, which overstates what the sixteen need and understates what the four need.

**Human review does not scale, and that is a product constraint rather than a complaint.** Twenty questions took one reviewing session. A bank large enough to be useful needs hundreds. If every question requires a full technical review by someone who knows the exam, the pack stops growing, and the release roadmap depends on it growing.

The tempting answer is to let an official reference stand in for the review. It does not work. A reference proves a link exists, not that the claim follows from it: "`Integer a = 1000, b = 1000;` means `a == b` is always `false`", cited to JLS 5.1.7, is an impeccable citation of a false claim, and no automated check would notice. Worse, the rule would wave through precisely the four questions with the least evidence behind them, because those are the ones that are nothing *but* prose and references.

References themselves are also barely checked. `ContentPackTest` asserts that a reference URL starts with `https://`. The content policy requires authoritative references "sufficient for independent verification" and ADR 0005 forbids fabricating them; nothing enforced either.

## Decision

**1. Grade each question by the evidence behind it, and ask of a person only what a machine cannot supply.**

- **Verified.** The question carries a program. The build compiles it for the declared release, runs it, and the option carrying its output is the one marked correct, so the answer key is mechanically established. What a person must still judge is what a machine cannot: that there is one defensible interpretation, that the wrong options are plausible rather than tricks, that every explanation is complete, and that code and prose read well with assistive technology. That judgement is recorded as checklist items, not as a verdict on correctness.
- **Asserted.** The question rests on prose and references. Nothing mechanical supports the answer key. It needs the full technical review the content policy describes, by someone who knows the subject, and a second reviewer is strongly preferred.
- A question moves from Asserted to Verified by someone writing a program for it. **That is the preferred way to reduce review load**, and most claims that look conceptual admit one: `requires transitive` by a multi-module compile that fails without it, `exports` and `opens` by reflection that throws without them, the `Integer` cache and the stream facts by a program that prints the behaviour.

**2. Verify references mechanically.** Every reference URL must be on an allowlist of official sources and, where that source is versioned, scoped to the question's declared Java release. This is a guard, not a gate: it catches a fabricated, dead or wrong-version citation. It says nothing about whether the reference supports the claim, and is not evidence of correctness.

**3. What does not change.** An official reference never substitutes for human review. Licensed practice-exam material is never a source of correctness, nor of question text, nor of question ideas ([ADR 0004](0004-authorial-content-only.md)).

## Consequences

- The pack can grow faster where the compiler can do the work, and no faster where it cannot. That is the honest shape of the constraint, and it puts the incentive on writing verifiable questions.
- The review record gains a tier per question, so "reviewed" stops meaning two different things in the same file.
- The four Asserted questions in the initial pack are labelled as such and are the first candidates for conversion.
- A reference to an unversioned or outdated page fails the build. Some legitimate sources are not version-scoped — a JEP describes one release by definition — so the rule is per source, not global.
- The tiers are a review policy, not a publishing permission. Nothing publishes itself at either tier; `deploy/publish-pack.mjs` still refuses anything a recorded human review does not currently cover.
- Grading creates a way to be dishonest that did not exist before: calling a question Verified when its program does not actually establish the answer. The build decides the tier from whether a program exists and agrees with the key, so the label is derived, never asserted by hand.

## Rejected alternatives

- **Letting an official reference substitute for human review.** A citation is not a proof, and the rule would exempt exactly the questions with the least evidence.
- **Using licensed practice-exam material as the answer key.** Legally it is not ours to derive from. Technically it is a secondary source: the specification is normative and the compiler executes, so this would be weaker evidence presented as stronger.
- **Requiring a program for every question.** Some claims about the language are genuinely claims about specification text. A forced program would test the program rather than the claim, and would invite questions written to be testable rather than worth asking.
- **Dropping human review for Verified questions.** The compiler proves the answer. It does not show that the question has one defensible reading or that its explanations are right.
- **Checking that a reference supports its claim automatically.** That is the semantic step, and nothing available does it reliably. Pretending otherwise would be the same mistake as decision 3 forbids.

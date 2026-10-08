# ADR 0015: Model mock exams as a separate study aggregate

- Status: **Accepted**
- Date: 2026-10-02
- Issue: #97

## Context

The shipped study-session aggregate is intentionally topic-focused. It snapshots revisions for one topic, returns answer material after every accepted attempt and contributes each accepted attempt to topic progress immediately.

A certification mock has different semantics. It spans the whole exam, has a fixed deadline, must keep all answer material hidden until the run closes, scores unanswered questions as misses and needs one final cross-topic result.

Those differences are not presentation details. Reusing ordinary sessions and merely hiding their feedback in React would leave the existing attempt API able to reveal the answer key before the mock ends. Reusing ordinary attempts would also change the meaning of the existing progress projection without an explicit product decision.

## Decision

**Mock exams are a separate aggregate inside the `study` module.**

They share published question revisions, catalog identities, the server clock, authentication and infrastructure conventions with ordinary study sessions, but they have separate persistence and response contracts.

An active mock stores an immutable ordered snapshot of revision ids and topic ids. Submitted responses are immutable evidence and are idempotent. The server enforces `expiresAt`.

While the mock is active, answer submission returns a receipt only. Correctness, correct options, explanations and references are available only after the aggregate reaches a terminal state.

The exam-specific shape is supplied by an explicit blueprint keyed by exam code. The first accepted blueprint is `1Z0-830`: 50 questions, 120 minutes, a 68% practice threshold and five questions from each of its ten current top-level topics. The exam question count, duration and passing score were checked on 2026-10-07 against Oracle's official [Java certification overview on dev.java](https://dev.java/learn/java-cert-overview/), which lists 1Z0-830 as 50 questions in 120 minutes with a 68% passing score. Dev.java is maintained by Oracle's Java Platform Group. Oracle University's Java SE certification page is JavaScript-rendered and still rejects automated clients, so a direct human browser comparison of that storefront remains tracked by #113 rather than being implied here. The equal topic allocation is a CertForge practice choice, not a claim about Oracle's objective weighting.

Mock evidence does not feed the ordinary `progress_topic` projection in the first implementation.

## Consequences

- Hiding feedback is enforceable at the API boundary rather than relying on browser behavior.
- Ordinary practice semantics and history remain stable.
- Mock results can use the full question count as their denominator, so unanswered questions are represented honestly.
- A later content replacement cannot change an existing mock because revision ids are snapshotted.
- Each new certification exam must declare a blueprint before mock mode can start for it, and its exam-format values must be rechecked against an Oracle-maintained source rather than inherited from another exam code.
- There is some duplicated lifecycle and persistence logic inside the study module. That cost is accepted in exchange for keeping the two evidence contracts explicit.
- If mock evidence later contributes to adaptive review, that relationship requires its own documented rule instead of arriving as an accidental side effect.

## Rejected alternatives

- **Chain one ordinary session per topic.** The ordinary attempt endpoint reveals the answer immediately and each session has its own lifecycle; the resulting bundle is not one timed exam.
- **Add a front-end-only exam mode.** It changes presentation but cannot prevent a learner from reading answer data already returned by the API.
- **Generalize the existing session and attempt tables immediately.** The two flows currently have different invariants and progress semantics. A polymorphic aggregate would make every existing query carry mode branches before there is evidence that the shared abstraction is simpler.
- **Count mock responses as ordinary attempts from day one.** That would change progress and future adaptive-review inputs without a defined interpretation for exam-mode evidence.

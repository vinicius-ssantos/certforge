# ADR 0005: Do not use AI as the source of correctness

- Status: Accepted. "Published content requires human technical review" (Consequences, below) no
  longer holds without qualification: [ADR 0022](0022-ai-reviewer-provisional-publication.md),
  [ADR 0024](0024-ai-reviewer-verified-tier.md) and [ADR 0025](0025-ai-reviewer-approval-is-final.md)
  carve out a disclosed, named exception in which an AI reviewer's own approval is what publishes
  the content, final, with no human review of it at all. That exception is scoped to the fast lane
  those ADRs define; every other path this ADR describes is unchanged.
- Date: 2026-07-30

## Context

Generative models can explain and vary material but may hallucinate language rules, outputs, citations, or version behavior. Certification preparation requires reproducible correctness.

## Decision

AI may support drafting, explanation reformulation, practice variation, and planning. It cannot approve content, determine final correctness when deterministic validation is possible, fabricate references, or override reviewed evidence.

## Consequences

- AI features remain optional enhancement layers.
- Published content requires human technical review.
- Compilation, tests, specification references, and deterministic rules are preferred.
- AI outputs must be clearly distinguished from canonical explanations when later introduced.

## Rejected alternatives

- Automatically publishing AI-generated questions.
- Using a language-model response as the sole answer key.

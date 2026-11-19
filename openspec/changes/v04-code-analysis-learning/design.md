## Context

The existing question pack compiles/executes fixed Java 21 examples in CI through `ContentPackTest`, with all 150 sample directories carrying expected output/diagnostic evidence. Syntax highlighting, wrapping, accessible code blocks, explanations, study history and delayed mock feedback exist. Compiler proof is not a replacement for a reviewer judging the authored explanation (ADR 0011). The original #391 proposal predates these changes.

## Goals / Non-Goals

- Make code-behavior feedback demonstrably educational, accurate and accessible to a learner.
- Prefer the existing question-level and per-option explanation fields; add no schema without an identified and accepted gap.
- Preserve API authority for accepted answers and the current mock terminal-state disclosure boundary.
- Exclude arbitrary learner code execution, Java runner infrastructure, AI judging/publishing, new automatic evidence badges and a requirement to publish/re-review all 150 questions.

## Decisions proposed for review

1. **Baseline first:** audit a bounded cross-section of fixed questions (output, compile error, runtime, modules, concurrency) and their delivered learner feedback. Record exact gaps with source paths and reproducible UI steps. Do not assume the missing feature is syntax highlighting.
2. **Content-first if possible:** use existing reviewed `explanation` and option reasoning to describe the rule, important expression/line, and expected result. Changes to content follow existing review and approval controls; no silent autopublish.
3. **Feedback timing:** ordinary practice may show accepted-answer feedback; an active timed mock continues concealing correct answers, diagnostics and explanations until terminal state.
4. **Evidence separation:** fixed compiler output is verified in CI, while explanation quality and fairness remain editor-reviewed. Never display a “verified” claim derived solely from a citation or nonexistent API field.
5. **Accessibility and security:** reuse the existing class-based, CSP-compatible code renderer; validate mobile wrapping/scrolling, screen-reader labeling and no interpretation of source as HTML.
6. **Incremental delivery:** complete a small approved pilot and observable acceptance checks, rather than promise an entire corpus transformation.

## Owner decision (18 November 2026)

The owner explicitly approved the **minimal pilot scope**: show already-recorded Java source/output on *finalized* mock-review questions (reuse existing server fields and `VerificationEvidence`, PR #416) and conduct individual human editorial review of six representative Java SE 21 explanations/distractors. Do not add a new runner or alter the content/publication state without its separate review acceptance. The pilot list and audit instructions are tracked in `docs/review/v04-code-analysis-pilot-20261118.md`.

This approval authorizes the planning/implementation workflow and review; it does **not** constitute approval of those six existing gabaritos, a blanket v0.4.0 release acceptance, or permission to publish unreviewed content.

## Alternatives

- **New code runner:** rejected for v0.4.0; belongs to the separately security-reviewed v0.5.0.
- **New annotation/metadata schema by default:** deferred until the audit proves existing fields inadequate.
- **Re-implement highlighting:** rejected; present and tested on `main`.
- **Automatic publication after successful compiler proof:** prohibited by editorial policy.

## Risks / trade-offs

- Existing text explanations may be insufficient for genuinely step-by-step behavior; audit before choosing structured annotations.
- Content review is human-gated and may limit pilot size; prioritize representative quality over count.
- Leaking answers in active mock mode invalidates the exercise; E2E must cover pre- and post-finalization.
- Feature scope can be zero if the audit establishes that existing feedback is already adequate; in that case close the release gap with documented acceptance rather than fabricate implementation.

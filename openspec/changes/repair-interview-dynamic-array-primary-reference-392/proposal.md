## Why

Issue #392 requires the AI reviewer to check whether each interview question's cited evidence is sufficiently authoritative before recording a verdict. `iv154-dynamic-array-growth` correctly describes O(1) amortized append under capacity doubling but referenced only Wikipedia articles; those do not meet the primary/authoritative-source checklist used in this pack.

## What changes

- Replace the two Wikipedia links in this single question with MIT OpenCourseWare lecture notes (6.046J Lecture 5) and Cornell CS 3110 lecture notes on amortized analysis of dynamic tables.
- Preserve the prompt, options, correct answer A, rationales, topic, and difficulty.
- Do not add or change `review.json` or `pack.json`; a later independent editorial assessment must record a V2 digest against the corrected merged source.

## Impact

Documentation/content-source metadata only; no runtime, tests, bundle, deployment or editorial publication change.

Related: #392.

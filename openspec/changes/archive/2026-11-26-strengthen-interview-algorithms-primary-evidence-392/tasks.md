## Implementation

- [x] Assess the six questions' gabaritos against primary academic/Oracle sources.
- [x] Replace each exclusively encyclopedic references array with relevant academic textbook or Oracle official evidence.
- [x] Preserve all six original question bodies, answer keys, difficulty, and review/package status in the source-only PR.
- [x] Strict OpenSpec validation, clean diff, content integrity tests.
- [x] Exact-head CI/CodeQL and independent Codex review, squash merge.
- [x] Separate V2 editorial review per question with exact merged source digest and explicit evidence.
- [x] Archive change with completed evidence after all required gates.

## Completion evidence — 2026-11-26

- Source-only PR #498: 8/8 CI/CodeQL checks SUCCESS and independent Codex clean; squash `8b0b40f3575bbc241c436e0fa0dc7dd9b43c8350`. Six references arrays replaced; no V2 approval in this source-only PR.
- Four independent, individually checked V2 entries PR #501, squash `1c0da4c2d60d4c126961e88d6591f36dfef8046f`, 8/8 CI and clean Codex: `iv154-average-vs-worst-case-hashmap` A digest `sha256:624cbf8107621ffb8896445313f332a4f00c0ae8281e1200061cdb93a9b4d521`; `iv154-balanced-bst-why-balance-matters` B digest `sha256:d1f7203fcedbd30c9eb30ea21ef8236e8e6dd050a1c8bdaea82df3094fac9fdf`; `iv154-choose-structure-lru-cache` D digest `sha256:fedb5e5ca4f590daa9ee79a3f28834989c041e7f96a7705c68afc12f16ab639a`; `iv154-set-vs-list-membership` C digest `sha256:8d94547e523244452d2e9da66be320459753a3e656c4102276ed7052cf43ed92`.
- The remaining two source questions were technically refined in #500, squash `a6ba20719bca5c0174bfebd85894a927ba5c4066`, before V2 review. Their separate, individually checked V2 PR #502 passed 8/8 on CI attempt 2 (first Maven Central 429 rate limit), clean independent Codex, squash `250b88dc435b054bb5065078f81c16098a063943`: `iv154-graph-representation-tradeoff` B digest `sha256:8ab9ed5ab3de4f81af343d2606b632545143326a2e5402286c8d2c66d667a699`; `iv154-big-o-meaning` C digest `sha256:64fcadc3a055fd40cb41a11df8d9574e95c1d17484d88ff87664e2e734c86db7`.
- Main 71/208 V2 approved, 137 pending; pack DRAFT. #392/#428 OPEN. No publication/deploy.

# Content packs

Authorial question packs and the tooling that validates and prepares them for human review.

- `java-se-21/` — legacy Oracle Java SE 21 Developer pack: 150 original questions, fifteen per topic. **46/150** currently carry recorded human technical review; 104 remain deliberately unreviewed.
- `java-se-21/review.json` — human-review provenance for the legacy pack. A semantic edit changes the digest and invalidates the previous verdict; verified program output is tracked separately.
- `java-backend-interview/` — first **DRAFT** Java Backend Pleno/Sênior interview pack: 12 original `GUIDED_RESPONSE` questions, one per topic in `Taxonomy 2026.1`. It has no human approval record yet.
- `pack.mjs` — unchanged legacy Java SE 21 reader and review-digest implementation.
- `pack-manifest.mjs` — strict manifest validation for new multi-track packs.
- `manifest-pack.mjs` — isolated reader/validator and `reviewDigestV2` for manifest-backed packs, including interview seniority and guided-response criteria.
- `build-review-packet.mjs` — generates the Java SE 21 human-review packet at [docs/release/content-review-packet.md](../docs/release/content-review-packet.md).
- `build-manifest-review-packet.mjs` — generates the human-review surface for manifest-backed packs. The Java Backend packet is [docs/release/java-backend-interview-review-packet.md](../docs/release/java-backend-interview-review-packet.md).
- `ContentImporter.java` — existing editorial importer. Full manifest-backed importer dispatch remains tracked by #166; validation/review support does not imply automatic import, approval or publication.

## Review boundary

AI may assist drafting, structure validation and packet generation. It may not write a human verdict on its own. A question is considered human-reviewed only when a person has judged the exact semantic content and the matching digest is recorded in the pack's `review.json`.

The build can prove deterministic properties such as compilation/output for the legacy Java pack and can validate schema/digest stability for manifest-backed packs. It cannot prove that prose, trade-offs, guided-response criteria or references are technically sufficient. Those remain human review responsibilities.

The Java Backend foundation pack is intentionally small. Its twelve questions demonstrate the twelve-topic interview taxonomy without claiming complete preparation coverage; child issues #150–#158 expand individual areas. Behavioral interview material remains deferred pending #159.

How to write, verify, import, review and publish questions: [docs/engineering/content-authoring.md](../docs/engineering/content-authoring.md) (Portuguese: [docs-pt-br/engineering/content-authoring.md](../docs-pt-br/engineering/content-authoring.md)).

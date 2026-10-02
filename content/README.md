# Content packs

Authorial question packs and the tool that imports them.

- `java-se-21/` — the initial Oracle Java SE 21 Developer pack: 20 original questions, two per topic.
- `java-se-21/review.json` — who reviewed those questions, when, and what the review does not establish. Each reviewed question carries a digest of the text that was judged and one of the output the build proved, so a question edited afterwards stops counting as reviewed instead of inheriting the verdict — while writing a program for a question that had none keeps the verdict, because that only adds evidence for a claim already read.
- `pack.mjs` — reading a pack, the catalog it binds to, and its review record.
- `build-review-packet.mjs` — builds the packet a technical reviewer works from ([docs/release/content-review-packet.md](../docs/release/content-review-packet.md)): each question as a learner sees it, the answer key and reasons, the verified output, and either the recorded verdict or the policy checks as boxes to tick. Regenerate it with `node content/build-review-packet.mjs`; CI fails if it is out of date.
- `ContentImporter.java` — imports a pack into a running CertForge through the editorial API. Run it with `java content/ContentImporter.java --email ... --password ...`.

**The twenty questions in this pack were technically reviewed on 2026-10-02 by the project owner, who reported no errors** ([the record](java-se-21/review.json), [the packet](../docs/release/content-review-packet.md)). They remain AI-assisted drafts that a person has checked, not third-party reviewed content, and the review did not cover the exam objective wording in the catalog. Three questions have no runnable code, so they rest on that review and their references alone; the [packet](../docs/release/content-review-packet.md) names them and derives the list, so it cannot go stale.

The build checks that every code snippet compiles for Java 21 and prints what the question says, and that the option carrying that output is the one marked correct. It cannot judge wording, ambiguity or the quality of the explanations. The importer only creates drafts and submits them for review; it never approves or publishes, so a review recorded here still has to be entered in the editorial desk by a reviewer account before anything can go out.

How to write, verify, import, review and publish questions: [docs/engineering/content-authoring.md](../docs/engineering/content-authoring.md) (Portuguese: [docs-pt-br/engineering/content-authoring.md](../docs-pt-br/engineering/content-authoring.md)).

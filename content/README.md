# Content packs

Authorial question packs and the tool that imports them.

- `java-se-21/` — the initial Oracle Java SE 21 Developer pack: 20 original questions, two per topic.
- `ContentImporter.java` — imports a pack into a running CertForge through the editorial API. Run it with `java content/ContentImporter.java --email ... --password ...`.

**The questions in this pack have not been technically reviewed by a person.** They are AI-assisted drafts. The importer only creates drafts and submits them for review; it never approves or publishes. The build checks that every code snippet compiles for Java 21 and prints what the question says, but it cannot judge wording, ambiguity or the quality of the explanations.

How to write, verify, import, review and publish questions: [docs/engineering/content-authoring.md](../docs/engineering/content-authoring.md) (Portuguese: [docs-pt-br/engineering/content-authoring.md](../docs-pt-br/engineering/content-authoring.md)).

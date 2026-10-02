# Certification Content Policy

## Purpose

Content quality is a core product capability. A technically polished platform with unreliable questions does not satisfy the CertForge vision.

## What this governs

Content the project **publishes**: the packs in `content/`, which this repository distributes under its licence, and anything a deployment serves to learners. It is not a rule about what a maintainer may read or keep. Study material someone holds a licence to lives outside the repository, in `content/private/`, which is ignored by git and which CI refuses to let anyone track; see the [content authoring guide](../engineering/content-authoring.md).

## Allowed content

- Original questions written for CertForge.
- Original explanations and examples.
- Small code snippets created specifically to teach a language rule.
- References to public and authoritative specifications, documentation, JEPs, and API documentation.
- AI-assisted drafts that receive human technical review and are not copied from protected sources.

## Prohibited content

- Exam dumps, leaked questions, or reconstructed questions represented as real exam content.
- Unauthorized copies or close paraphrases of commercial question banks, books, or training platforms.
- Unverifiable claims about what appeared in an exam.
- Published questions without a reviewed answer and explanation.
- Version-ambiguous Java content.

## Required metadata

Every publishable question must include:

- certification track and exam version;
- topic and optional subtopic;
- Java release compatibility;
- question type;
- difficulty rationale;
- expected answer;
- explanation for the correct and materially plausible incorrect choices;
- authoritative references;
- author and reviewer provenance;
- immutable revision identifier.

## Editorial lifecycle

`DRAFT -> TECHNICAL_REVIEW -> APPROVED -> PUBLISHED -> DEPRECATED`

Rules:

- Only approved revisions can be published.
- A published revision is immutable.
- Corrections create a new revision.
- Historical attempts continue to reference the revision originally shown.
- Deprecation prevents new selection but retains audit and attempt history.
- Publication, replacement, and deprecation are auditable administrative events.

## Quality checks

A reviewer must verify:

- one defensible interpretation of the prompt;
- answer correctness for the declared Java release;
- compilability when compilation is relevant;
- no hidden dependency on unspecified environment behavior;
- plausible distractors without deliberate trick wording unrelated to the objective;
- explanation completeness;
- accessibility of code and prose formatting;
- source references sufficient for independent verification.

## AI policy

AI may help brainstorm, simplify, translate, or generate candidate variations. It may not publish content, approve correctness, invent citations, or override deterministic evidence and human review.

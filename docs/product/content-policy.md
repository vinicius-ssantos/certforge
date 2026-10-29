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

## Certification source governance

A certification profile here is **authored study material**. It is never a copy of an exam's own
questions, never derived from them, and never presented as them. No track is labelled "official",
because no authorisation to do so exists.

**Two kinds of source, and they are not interchangeable.** A *conceptual source* — the product's own
documentation, a specification, an API reference — is evidence that an **answer** is correct. An
*exam document* — the provider's published objectives page — is evidence that a question is **about
something the exam covers**. A conceptual source can never establish coverage, and an objectives
page can never establish correctness. Mixing them is how a quiz starts implying it came from an
exam.

**One reading, recorded.** Coverage comes from one place: a reading of the provider's own objectives
page, recorded with the provider's version name, the date it was read, the HTTPS page it came from, a
`sha256:` digest of that page, and the objectives found on it. Nothing in this project fetches that
page by itself — there is no automatic scraping, by policy — so a reading is an act a person
performs and signs.

**Status, and what each state is allowed to claim.**

| State | Meaning | What may be claimed |
|---|---|---|
| `UNVERIFIED` | nobody has read the provider's page for this version | the track may exist and be studied; **no coverage of exam objectives may be claimed** |
| `VERIFIED` | a reading exists and is believed current | coverage of the objectives in that reading |
| `STALE` | the provider has published something newer and the reading has not caught up | the reading may be read, and **must not be presented as current** |
| `RETIRED` | the exam is gone | historical only |

`STALE` is an observation, not a computation: age is not staleness, and a stable exam's objectives
can be years old and exactly right. A person who notices the provider has moved on records it.

**The reviewer sees it, not only the administrator who recorded it.** A reviewer judging whether a
question's claimed objective is real reads the same status, source page and verification date
beside the question's own references — a reference is evidence for the *answer*; this is the
separate evidence that the *objective* it claims is a real line on the provider's page. Reaching it
needs no catalog-administration permission: reading the source you are judging a claim against is
not administering the catalog.

**When a provider changes an exam.** Read the new page and record it. The new reading replaces the
previous one — a snapshot is one reading of one page, so an objective no longer listed is no longer
an objective. One thing a new reading may not do: drop an objective that a published question still
claims. That question would go on citing something the page no longer lists, and the refusal names
the keys so they can be revised or deprecated first.

**What CI guarantees, and what it cannot.** The build refuses a reference outside a track's source
policy, a page read over plain HTTP, a digest that is not one, a reading with no objectives, a
duplicate objective key, and a question published against an objective the exam's reading does not
list. What the build cannot do is read the provider's page, judge whether an objective was
transcribed faithfully, or know that an exam changed. Those are a named person's, by
[ADR 0005](../adr/0005-ai-not-source-of-truth.md), and a passing build never means a verified exam.

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

AI may help brainstorm, simplify, translate, or generate candidate variations. It may not publish content, approve correctness, invent citations, or override deterministic evidence and human review --
with one narrow, disclosed, time-boxed exception.

**The AI-reviewer fast lane ([ADR 0022](../adr/0022-ai-reviewer-provisional-publication.md)).** An
account holding `CONTENT_AI_REVIEW` may approve and publish a revision that carries no verification
evidence (the Asserted tier, [ADR 0011](../adr/0011-grade-content-evidence.md)) in one step. That
approval is provisional: it is recorded as `AI_APPROVED`, never disguised as an ordinary approval, and
a learner currently looking at that question is told it was reviewed by AI and not yet independently
confirmed. Unless an account holding `CONTENT_REVIEW` -- never the revision's own author -- confirms it
within the configured window, it stops being offered to a learner starting new study, though a learner
already shown it keeps seeing it. A revision with verification evidence is never eligible for this
path; it still needs exactly the human approval this policy has always required.

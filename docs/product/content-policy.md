# Content Policy

## Purpose

Content quality is a core product capability. A technically polished platform with unreliable questions does not satisfy the CertForge vision.

## What this governs

Content the project **publishes**: the packs in `content/`, which this repository distributes under its licence, and anything a deployment serves to learners. It is not a rule about what a maintainer may read or keep. Study material someone holds a licence to lives outside the repository, in `content/private/`, which is ignored by git and which CI refuses to let anyone track; see the [content authoring guide](../engineering/content-authoring.md).

## Allowed content

- Original questions written for CertForge.
- Original explanations, reviewed response criteria and examples.
- Small code snippets created specifically to teach or assess a technical rule.
- References to public and authoritative specifications, documentation, standards, JEPs, API documentation and vendor documentation.
- AI-assisted drafts that receive human technical review and are not copied from protected sources.

## Prohibited content

- Exam dumps, leaked questions, or reconstructed questions represented as real exam content.
- Unauthorized copies or close paraphrases of commercial question banks, books, or training platforms.
- Unverifiable claims about what appeared in an exam or interview.
- Published questions without a reviewed answer key or reviewed guided-response criteria.
- Version-ambiguous technical content when the answer depends on a product, API or language version.
- Automatically generated hiring scores, employability probabilities or binary correctness for subjective interview answers.

## Required metadata

Every publishable question must include:

- preparation track and the track version/context in which the revision was reviewed;
- topic and optional subtopic;
- question type;
- difficulty and difficulty rationale;
- authoritative references sufficient for independent verification;
- author and reviewer provenance;
- immutable revision identifier.

Objective questions must additionally include:

- a deterministic expected answer;
- explanation of the correct answer and materially plausible incorrect choices.

Certification questions must additionally include:

- certification/exam profile and version;
- objective mapping where the provider publishes objectives;
- language/runtime/product version metadata when correctness depends on it, including Java release for the Java certification pack.

Interview questions must additionally include:

- explicit seniority expectation.

Guided-response interview questions must additionally include:

- a reviewed reference answer;
- reviewed expected concepts, including which are required versus optional;
- common mistakes and likely follow-up prompts where they materially improve the exercise.

Guided-response criteria are evidence for self-review and future assisted comparison. They are **not** a deterministic `correct=true/false` key.

## Editorial lifecycle

`DRAFT -> TECHNICAL_REVIEW -> APPROVED -> PUBLISHED -> DEPRECATED`

Rules:

- Only approved revisions can be published.
- A published revision is immutable.
- Corrections create a new revision.
- Historical attempts continue to reference the revision originally shown.
- Deprecation prevents new selection but retains audit and attempt history.
- Publication, replacement, and deprecation are auditable administrative events.
- The human reviewer must review the exact semantic content covered by the recorded digest; semantic edits invalidate the prior verdict.

## Quality checks

A reviewer must verify:

- one defensible interpretation of the prompt;
- correctness of an objective answer, or defensibility and completeness of guided-response criteria;
- declared version compatibility whenever the technical claim is version-sensitive;
- compilability or other deterministic evidence when relevant;
- no hidden dependency on unspecified environment behavior;
- plausible distractors for objective questions, or meaningful required/optional concepts for guided responses;
- explanation/reference-answer completeness at the declared seniority;
- accessibility of code and prose formatting;
- source references sufficient for independent verification.

Deterministic checks support review; they do not replace human judgement. Reference-backed questions must say so rather than implying that CI proved the technical claim.

## AI policy

AI may help brainstorm, simplify, translate, generate candidate variations, or compare a learner response with immutable reviewed criteria. It may not publish content, approve correctness, invent citations, replace reviewed criteria, or assign opaque hiring/readiness scores.

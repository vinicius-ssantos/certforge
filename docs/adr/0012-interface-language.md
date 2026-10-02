# ADR 0012: Translate the interface, keep the question text in English

- Status: **Proposed.** Nothing is translated yet, and decision 3 says this is not `v0.1.0` work. It is written as a recommendation with its reasoning so it can be accepted, or changed and then accepted.
- Date: 2026-10-02

## Context

This repository documents itself in English and Brazilian Portuguese: forty documents in each, kept in step, with English canonical. The product's own language was never decided.

The learner web app and the editorial desk are English only, **by drift rather than by choice**. There is no internationalisation library, no message catalogue, `<html lang="en">` is fixed in `web/index.html`, and user-visible text is written inline in 28 of the 43 components. `web/src/ui/messages.ts` centralises the thirty-eight error messages, and its own comment says the wording lives there "so it can be reviewed and translated" — intent that was never followed through. Nothing in `docs/product/`, `docs/roadmap/`, the ADRs or the web interface guidelines states a language at all.

The maintainer reads and works in Portuguese. The exam the first track prepares for is sat in English.

Two decisions are tangled here, and they pull in opposite directions. That is probably why neither was made.

## Decision

**1. Translate the interface to Brazilian Portuguese, keeping English.** The default follows the browser's preferred language; an explicit switcher overrides it and the choice is remembered in the browser, so this needs no schema change and no account setting. "Interface" means the chrome: navigation, buttons, labels, hints, status messages, confirmations, errors, and the formatting of dates and numbers.

**2. Keep question text in English**: the prompt, the options, the explanations, the references, and the topic and exam-objective wording in the catalog. Three reasons.

- **The exam is sat in English, and the precision of its wording is part of what it tests.** Practising in Portuguese and sitting in English removes exactly the technical-reading practice the learner needs. (Whether Oracle offers a localised 1Z0-830 could not be verified: its exam page refuses automated clients, which is the same obstacle as #68. If a localised exam exists, this decision deserves revisiting for that audience.)
- **A translated question is new content, not a copy.** It needs its own technical review, because a mistranslation is a wrong question, and a wrong question is the one failure this product cannot absorb. It would double the review bottleneck [ADR 0011](0011-grade-content-evidence.md) has just described — for the twenty questions that exist, and for every question added afterwards.
- **The references are English and normative.** A Portuguese question citing an English specification makes the independent verification the [content policy](../product/content-policy.md) requires harder, not easier. Topic and objective wording comes from Oracle's published objectives and stays in the original for the same reason.

**3. Neither happens in `v0.1.0`.** See the consequences.

## Consequences

- **The cost is not the strings.** Ninety-seven assertions in the browser suite, and the unit tests besides, locate elements by their English accessible name — `getByRole("button", { name: "Approve" })`. Those names *are* the accessibility guarantee: the Tab walk and the accessibility-tree checks read them. Translating the interface means reworking the suites that are the release's evidence. That is release-sized work, not a chore, and doing it before tagging `v0.1.0` would dismantle the proof at the moment of signing it.
- **Screens will mix languages**: a Portuguese interface around an English question. That is deliberate and must be designed rather than hidden, and it has a technical obligation attached — `lang` must become dynamic, and the element holding question text needs `lang="en"` so a screen reader pronounces it with English phonetics instead of reading English words as Portuguese. Today that is implicitly correct because the whole page is `lang="en"`; translating the interface would silently make it wrong, which is a real accessibility regression hiding inside a translation task.
- The error messages are already centralised, so they are the cheap part. The 28 components are the work.
- Decision 2 is scoped to certification tracks whose exam is in English. A future interview track aimed at a Portuguese-speaking market is a different case and is not pre-decided here.

## Rejected alternatives

- **Keeping the interface in English because the content is English.** The interface is not what is being examined. Someone is entitled to practise English Java questions without navigating an English app.
- **Translating the questions too.** It makes the product worse at its stated purpose and doubles the only bottleneck that actually limits how big the pack can get.
- **Translating content by machine at runtime.** Content correctness is the product. A machine translation of an answer explanation is an unreviewed claim presented as a reviewed one, which [ADR 0005](0005-ai-not-source-of-truth.md) forbids.
- **Doing it inside `v0.1.0`.** Four human items stand between the release and a tag; this would add release-sized work and invalidate the evidence behind the gates already passed.

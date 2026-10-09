# Design prototypes

Two self-contained HTML pages. Open either in a browser — no build, no server, no account.

| File | Screens | Status |
|---|---|---|
| [`prototype-01-four-screens.html`](prototype-01-four-screens.html) | Practice session, feedback, tracks and progress, mock exam, editorial desk | **Approved and implemented** |
| [`prototype-02-remaining-screens.html`](prototype-02-remaining-screens.html) | Sign in, create account, session ended, history, session review, the learner's review queue, mock result, editorial queue, the reviewer's screen, publish confirmation, catalogue, mock unavailable | **Approved; implementation in [draft PR #191](https://github.com/vinicius-ssantos/certforge/pull/191), awaiting human visual acceptance** — see the [`UI redesign — remaining screens`](https://github.com/vinicius-ssantos/certforge/milestone/8) milestone |

Each screen is a mock-up with a margin note saying what changes about it and why. They are
drawings, not code: no prototype markup should be copied into `web/`, because the real screens
carry state, focus management, two locales and the accessibility rules the prototypes only
illustrate.

## Why these are in the repository

They were first published as private pages on claude.ai, which only the owner can open. Anyone
picking up this work — a contributor, another assistant — needs the design without an account, so
the source lives here. **These files are the reference the issues mean** when they say "the
prototype".

## Reading them

Each prototype carries a theme toggle, and both schemes are part of the design: every colour is a
token redefined under `prefers-color-scheme: dark` and under `[data-theme]`. The pages pull IBM
Plex Sans, Source Serif 4 and JetBrains Mono from Google Fonts; offline they fall back to the
stacks declared beside each one and still read correctly, with the wrong letterforms.

## What they do not decide

- **Copy.** Words in the mock-ups are illustrative. The real strings live in `web/src/i18n/en.ts`
  and `pt-BR.ts`, and both locales must carry every one.
- **Numbers.** Any figure shown is sample data. The one real threshold, 68%, comes from
  `MockExamBlueprintCatalog` via `web/src/progress/target.ts` — the prototypes do not introduce
  thresholds, weightings or categories, and neither should an implementation.
- **Claims.** Nothing here states or implies a prediction about the real exam.

## What is settled, and must survive implementation

- The typeface pairing: Source Serif 4 for anything read closely, IBM Plex Sans for the interface,
  JetBrains Mono for code and for numbers that must hold a column.
- **State is never carried by colour alone.** Every coloured state also has a word, a glyph or a
  shape.
- Contrast of at least 4.5:1 for text and 3:1 for the focus ring, in both schemes, tested with axe.
- Every control at least `--touch` (2.75rem).

The live implementation of these rules is `web/src/tokens.css` and `web/src/styles.css`; the epic
([#184](https://github.com/vinicius-ssantos/certforge/issues/184)) lists the vocabulary already
built, so nobody rebuilds it.

## Evidence of what actually shipped

`docs/release/screenshots/` holds the real screens, recaptured from a running stack. When a
prototype and a screenshot disagree, the screenshot is what exists and the prototype is what was
agreed.

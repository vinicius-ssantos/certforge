# Web interface guidelines

How the web app looks and behaves, and why. The code is in `web/`; the stack decision is [ADR 0009](../adr/0009-web-frontend-stack.md).

## Look: the editorial desk

The product is a place to study carefully and to write and review questions carefully, so the interface borrows from proofreading: cool paper, dark ink, restrained colour that only ever means something.

- **Tokens** live in `web/src/tokens.css`. Every colour in the app comes from them, with a dark scheme.
  - Paper `--bg`, ink `--text`, secondary text `--muted`.
  - Blue `--accent` for links and the focus ring.
  - State: green `--ok` (approved, published, correct), brass `--review` (in review), red `--danger` (changes requested, incorrect).
- **Type**: Source Serif 4 for anything meant to be read (questions, explanations, headings), IBM Plex Sans for the interface, JetBrains Mono for code. Fonts are bundled with the app (`@fontsource`), so the app makes no third-party requests.
- **Layout**: dense tables for scanning, a reading column capped at 44rem, two columns (content and decisions) on wide screens, one column on narrow ones. Every page reflows to a 320 CSS pixel window without sideways scrolling (WCAG 1.4.10), which CI checks; a long code block scrolls on its own instead of widening the page.

## Rules

1. **Colour never carries state alone.** Every state is a word, usually with a symbol (`○ Draft`, `◐ In review`, `● Approved`, `✓ Published`). Correct and incorrect answers are stated in words.
2. **Contrast.** Text and state colours are at least 4.5:1 on their background and the focus ring at least 3:1, **in both schemes**. Real-browser axe checks every page it visits in CI, once per scheme. It measures with reduced motion emulated, because the app transitions colour over 150 ms and measuring mid-switch samples a blend of the two themes rather than either one. What axe cannot judge, such as whether the dark scheme reads pleasantly, still wants a person.
3. **Keyboard and screen reader are tested, not assumed.** CI walks every screen with Tab (every control reachable, a focus ring on each, the skip link first, a confirmation that takes the focus and gives it back) and asserts the accessibility tree of the main screens, which is what a screen reader announces. A real screen reader and a judgement of the tab order still want a person.
4. **Focus follows the content.** After navigating, focus moves to the page heading, unless the page already placed it somewhere on purpose (a confirmation, the next question, the result of an answer).
5. **Errors say what to do.** Messages are chosen by the server's stable error codes (`web/src/ui/messages.ts`), never by server text. A summary at the top of a form takes focus and links to each field.
6. **The server decides, the screen words it.** Completeness of a revision, who may review, what may be published are all server rules. The interface shows what the server says and never duplicates a rule it would then have to keep in step. Hiding a button is a courtesy, not protection.
7. **Code is code.** Questions use fenced blocks (three backticks). They render in a monospaced block, scrollable by keyboard, and text is never inserted as HTML.

## The editorial desk

Routes under `/editorial`, for accounts with `CONTENT_AUTHOR`, `CONTENT_REVIEW` or `CONTENT_PUBLISH`:

- **Queue** (`/editorial`): all questions or filtered by the status of the latest revision.
- **New question** (`/editorial/new`) and **a question** (`/editorial/questions/:id`): the author of a draft gets the editor; everyone else gets the revision as a reviewer reads it (the question exactly as the learner will see it, then the answer key and reasons, then review notes).
- **Saving** keeps an unfinished draft. **Send for review** asks the server whether the revision is complete and lists what is missing beside the form, each item leading to its field.

- **Deciding**: a reviewer sees a content-policy checklist and a comment beside the revision, then **Approve** or **Request changes** (a comment is required, and the revision goes back to its author as a draft). The ticked checklist items are recorded with the decision and shown, with the reviewer's name, in the review notes; they do not gate approval. People appear by name (their email address) in the header of a revision and in its review notes, which only staff can open. An administrator sees **Publish** (disabled until the revision is approved) and, on a published revision, **Retire**. An author sees **Start a new revision** on the latest published or retired revision, which copies it into a new draft.
- **Irreversible steps ask twice.** Publishing and retiring use a confirmation that says what will happen; focus moves to the confirming button and returns to the first button if the person backs out.
- **Comparing**: a revision that has a predecessor opens with what changed since it, word by word, field by field (question, options and their correctness, reasons, explanation, references). Additions are underlined and removals struck through, and both are also announced in words.
- **Unsaved changes are protected.** Leaving the editor with edits that are not saved, by a link, the back button or closing the tab, asks first; staying keeps everything and returns focus to Save draft. The app uses a data router (`createBrowserRouter`) for this.
- **Always current.** The queue and a question are re-read every time they open, because another person may have approved or published them since.

- **Catalog** (`/editorial/catalog`, administrators only): a read-only view of tracks, exam versions and the topics mapped to them. In this release the catalog is created by migration, so nothing here edits it. The page answers the question the desk raises: publishing binds a revision to the active exam version of its topic, so it says which topics can be published against, which Java release they must target, and which topics no active version maps.

A revision is a numbered sequence (written, in review, approved, published), so it is drawn as one.

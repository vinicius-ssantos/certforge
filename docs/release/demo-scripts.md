# Demonstration scripts for v0.1.0

Two scripts a person can follow to see the release work, and a third that only a person can do. Scripts A and B are exactly what the end-to-end suite runs on every change, so when they pass in CI the steps below work. The pictures were captured from the release images with `CAPTURE=1 npm run demo:screens` (in `web/`); the questions in them are the end-to-end **test fixtures**, which say they are test data, not exam content.

## Before you start

You need Docker. From the repository root:

```sh
export DB_PASSWORD=local-demo BOOTSTRAP_ADMIN_EMAIL=admin@example.com BOOTSTRAP_ADMIN_PASSWORD='a long local password'
docker compose -f compose.release.yaml up --build -d     # the app is at http://localhost:8081
```

Then give the app questions, in one of two ways:

- **The real pack**, which is what the product is actually for. Its technical review is done and [recorded](../../content/java-se-21/review.json), so two commands publish it through the real editorial workflow:

  ```sh
  just reviewer reviewer@example.com 'a long password'   # once: approval needs a second account
  just publish-content reviewer@example.com 'a long password'
  ```

  The second one holds back any question the recorded review no longer covers. See the [content authoring guide](../engineering/content-authoring.md) for the workflow by hand.
- **A quick look with test data.** Start the stack with the test settings (`docker compose -f compose.release.yaml -f compose.e2e.yaml up --build -d`), then, in `web/`, `npm ci`, `npx playwright install chromium` and `E2E_BASE_URL=http://localhost:8081 npx playwright test e2e/learner.spec.ts -g "signing out"`. That run publishes ten clearly labelled fixture questions through the editorial workflow.

## Script A: the learner

1. Open `http://localhost:8081`. You are sent to **Sign in** ([picture](screenshots/01-sign-in.png)). Choose **Create an account** ([desktop](screenshots/01b-create-account.png); [mobile](screenshots/01c-create-account-mobile.png)). The remaining-character counter and twelve-segment meter update while typing; enter an email and a password of at least 12 characters, then submit. You land on the tracks ([picture](screenshots/02-tracks.png)). Before answering anything, look at **History** ([picture](screenshots/02b-history-empty.png)) and **Review** ([picture](screenshots/02c-review-empty.png)): these are the first screens a new account meets, and each says what is missing and where to start rather than showing an empty frame.
2. Open **Java Certification**. It lists its topics in order with the official objectives link ([picture](screenshots/03-track.png)).
3. Press **Practice** on a topic. A session starts and focus moves to the question ([picture](screenshots/04-question.png); [on a phone](screenshots/05-question-mobile.png)). Nothing on the screen says which option is correct.
4. Pick an answer, say how confident you are, and submit. You now see whether it was correct, the reason for each option, the explanation and the references ([picture](screenshots/06-feedback.png)). Use **Next question** to continue; the last one offers **Finish session**.
5. To leave early, use **End session without finishing** and confirm ([picture](screenshots/07-session-ended.png)). It reports what you answered, what you got right and what you never saw, and offers both ways on.
6. Go back to **Tracks**. The card now carries where you are on that track, which it cannot show on a first visit ([picture](screenshots/07b-tracks-with-standing.png)).
6. Open **History** ([picture](screenshots/08-history.png)) and then a session to review each answer with the explanation ([picture](screenshots/09-session-review.png)).
7. Open **Progress** for attempts, correct and incorrect answers and accuracy per topic ([picture](screenshots/10-progress.png)).
8. Open **Review**. If the queue has due questions, each reason is named in a coloured pill, the items remain numbered and the **Practise** action names its topic. The demonstration intentionally includes a wrong answer with high confidence, so the [captured queue](screenshots/10b-review-queue.png) illustrates the reason pill, numbered item, topic-level practice action and timestamp. The reasons and the caveat explain past practice, not readiness for the real exam.
9. **Sign out**, then try to open `/history`: you are sent to sign in.

Expected: every step works with the keyboard alone; error messages say what to do; nothing is shown about the answer before step 4.

**Mock-result visual evidence (test only):** [sample result](screenshots/10c-mock-result.png) shows a 50-question fixture mock intentionally submitted without answers. It is generated with `CAPTURE=1 MOCK_CAPTURE=1` against a **disposable local E2E database**, and is not a real exam-score prediction. The actual content pack still needs human review before a normal mock can start (#138).

## Script B: the editor, the reviewer and the administrator

You need three accounts. An administrator gives roles with `PUT /api/admin/accounts/{id}/roles` (`EDITOR`, `REVIEWER`, `ADMINISTRATOR`); the first administrator is the bootstrap one.

1. **As the editor**, open **Editorial** ([picture](screenshots/11-editorial-queue.png)) and **New question**. Fill the form (type, topic, difficulty and why, the question with code in a fenced block, at least two options with a reason each and the correct one marked, an explanation, an official reference with an https link). **Save draft** keeps unfinished work.
2. Press **Send for review** on an incomplete draft: a list beside the form says what is missing and each item leads to its field ([picture](screenshots/12-editor-missing.png)). Complete it and send it again: it is now **In review**.
3. **As the reviewer**, open the question from **Waiting for review**. You see it as the learner will, then the answer key and reasons ([picture](screenshots/13-review.png)). Tick only the policy items you checked, comment if you like, and **Approve** (or **Request changes**, which needs a comment and returns it to the author as a draft).
4. **As the administrator**, open the approved question and press **Publish revision 1**. You are asked to confirm, because a published revision cannot be edited ([picture](screenshots/14-publish-confirm.png)). Confirm: it is **Published** and learners can now get it.
5. **As the editor**, open the published question and **Start a new revision**. It is a copy as a draft. Change the wording and send it. The reviewer now sees **What changed since revision 1**, word by word. After approval and publication the old revision is **Replaced** and the new one is **Published**.
6. **As the learner who answered the old revision**, open **History**: the answer still shows the original wording, and the review says so.

Expected: the author cannot approve their own revision (unless the demo relaxes it); a revision never changes after publication; the history is intact.

## Script C: what only a person can check

Automated checks cannot judge these, and the release is not ready until a person has done them (see the [readiness review](v0.1.0-readiness.md)):

- **Keyboard only.** Do Scripts A and B without a mouse. CI already checks that every control is reachable by Tab, that each one shows a focus ring, that the skip link comes first and works, and that a confirmation takes the focus and gives it back. What it cannot check is whether the **order** makes sense: does Tab go where you expect next, is anything reachable but surprising, is the path to a common action tediously long.
- **Screen reader.** With a screen reader (for example NVDA with Firefox or Chrome), do Script A and the first half of Script B. CI asserts the accessibility tree these read from, so roles, names and nesting are already known to be right. What is left is what only ears catch: whether the **status messages** after saving, sending, approving or answering are actually announced, whether the order of announcements makes sense, and whether anything is read out twice or not at all.
- **The other language.** Switch the interface to **Português (Brasil)** with the control in the header and repeat Script A. Automated checks prove both catalogues hold every key and that no string is accidentally shared between them; they cannot tell you whether a sentence still fits its button, whether a label still reads as a label at half again the length, or whether the wording is natural. Four screens are captured for comparison: [review queue](screenshots/pt-01-review-queue.png), [progress](screenshots/pt-02-progress.png), [history](screenshots/pt-03-history.png), [track](screenshots/pt-04-track.png). Question text stays in English on purpose (ADR 0012): the exam is sat in English, and a translated question is new content needing its own technical review.
- **When it goes wrong.** Two failures are captured, both from the real path rather than a screen built to look like one: a password the server refuses ([picture](screenshots/16-sign-in-refused.png)), where the summary takes the focus and names the field; and the backend unreachable ([picture](screenshots/17-server-unreachable.png)), which is the same `ErrorState` every page renders through, with its retry and no request id — a request that never arrived has none to quote. What is left for you is whether the wording helps: does it say what happened, and does it say what to do next.
- **Dark scheme.** Switch the operating system to dark and look at every screen. Contrast is measured automatically in both schemes, so the arithmetic is known to hold; what is left for you is judgement: does it read comfortably, does anything look muddy or glaring, do the state colours still mean what they should. Three screens are captured dark so you can start without switching anything: [track](screenshots/dark-01-track.png), [progress](screenshots/dark-02-progress.png), [history](screenshots/dark-03-history.png).
- **Zoom and small screens.** Zoom to 200 and 400 per cent and use a phone-width window. CI checks that no page needs sideways scrolling down to a 320 pixel width; what you are looking for is whether it is still usable and sensibly ordered, not just unbroken.
- **The objective wording.** The questions have been reviewed, but the wording of the objectives in the catalog still needs checking against Oracle's page. The catalog screen lists that wording for the active exam version, topic by topic, which is the easiest place to compare: as an administrator, open **Editorial › Catalog** ([overview](screenshots/15a-catalog-overview.png)) › **Java Certification** ([track detail](screenshots/15-catalog-track.png)). A second pair of eyes on the questions themselves is still worth having; the [review packet](content-review-packet.md) lays them out question by question with the recorded verdicts.

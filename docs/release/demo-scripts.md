# Demonstration scripts for v0.1.0

Two scripts a person can follow to see the release work, and a third that only a person can do. Scripts A and B are exactly what the end-to-end suite runs on every change, so when they pass in CI the steps below work. The pictures were captured from the release images with `CAPTURE=1 npm run demo:screens` (in `web/`); the questions in them are the end-to-end **test fixtures**, which say they are test data, not exam content.

## Before you start

You need Docker. From the repository root:

```sh
export DB_PASSWORD=local-demo BOOTSTRAP_ADMIN_EMAIL=admin@example.com BOOTSTRAP_ADMIN_PASSWORD='a long local password'
docker compose -f compose.release.yaml up --build -d     # the app is at http://localhost:8081
```

Then give the app questions, in one of two ways:

- **The real pack.** Import `content/java-se-21` and take it through review and publication as described in the [content authoring guide](../engineering/content-authoring.md). That pack has not had its human technical review yet, so a person has to do that first. Review needs a second account unless you start the stack with reviewer separation off, which is for a single-maintainer demo only.
- **A quick look with test data.** Start the stack with the test settings (`docker compose -f compose.release.yaml -f compose.e2e.yaml up --build -d`), then, in `web/`, `npm ci`, `npx playwright install chromium` and `E2E_BASE_URL=http://localhost:8081 npx playwright test e2e/learner.spec.ts -g "signing out"`. That run publishes ten clearly labelled fixture questions through the editorial workflow.

## Script A: the learner

1. Open `http://localhost:8081`. You are sent to **Sign in** ([picture](screenshots/01-sign-in.png)). Choose **Create an account**, enter an email and a password of at least 12 characters, and submit. You land on the tracks ([picture](screenshots/02-tracks.png)).
2. Open **Java Certification**. It lists its topics in order with the official objectives link ([picture](screenshots/03-track.png)).
3. Press **Practice** on a topic. A session starts and focus moves to the question ([picture](screenshots/04-question.png); [on a phone](screenshots/05-question-mobile.png)). Nothing on the screen says which option is correct.
4. Pick an answer, say how confident you are, and submit. You now see whether it was correct, the reason for each option, the explanation and the references ([picture](screenshots/06-feedback.png)). Use **Next question** to continue; the last one offers **Finish session**.
5. To leave early, use **End session without finishing** and confirm ([picture](screenshots/07-session-ended.png)).
6. Open **History** ([picture](screenshots/08-history.png)) and then a session to review each answer with the explanation ([picture](screenshots/09-session-review.png)).
7. Open **Progress** for attempts, correct and incorrect answers and accuracy per topic ([picture](screenshots/10-progress.png)).
8. **Sign out**, then try to open `/history`: you are sent to sign in.

Expected: every step works with the keyboard alone; error messages say what to do; nothing is shown about the answer before step 4.

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

- **Keyboard only.** Do Scripts A and B without a mouse. Every control reachable, a visible focus ring everywhere, focus lands on the heading after each navigation and on the result after each answer, nothing traps focus.
- **Screen reader.** With a screen reader (for example NVDA with Firefox or Chrome), do Script A and the first half of Script B. Headings, landmarks, form labels, the error summary, status messages after saving, sending or approving, and the answer feedback should all be announced sensibly.
- **Dark scheme.** Switch the operating system to dark and look at every screen for contrast and legibility; the automated accessibility checks run in the light scheme only.
- **Zoom and small screens.** Zoom to 200 per cent and use a phone-width window; nothing should be cut off or need sideways scrolling, apart from long code blocks.
- **The content.** The question pack needs a technical review by someone who knows the exam objectives, and the wording of the objectives in the catalog needs checking against Oracle's page.

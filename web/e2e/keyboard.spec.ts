import type { Page } from "@playwright/test";
import { createStaff, post, signedInApi, testQuestion, type QuestionView } from "./api";
import { expectKeyboardReachable, startFromTop } from "./keyboard";
import { register, signIn } from "./helpers";
import { TOPIC_NAME } from "./seed";
import { expect, test } from "./test";

/**
 * Using the application without a mouse. Script C of the demonstration scripts asks a person to do
 * this; what a machine can settle is checked here, so what is left for them is judgement rather
 * than hunting for a control that cannot be reached.
 */
const EDITORIAL_TOPIC = "a3000000-0000-4000-8000-000000000009"; // Java I/O API

async function startPractice(page: Page) {
  await page.getByRole("link", { name: "Java Certification" }).click();
  await page.getByRole("button", { name: `Practice ${TOPIC_NAME}` }).click();
  await expect(page.getByRole("heading", { level: 2, name: /^Question 1 of/ })).toBeVisible();
}

test.describe("using it with the keyboard alone", () => {
  test.skip(({ isMobile }) => isMobile, "a keyboard concern; the layout is covered elsewhere");

  test("the first stop is the skip link, and it jumps to the main content", async ({ page }) => {
    await register(page);

    await startFromTop(page);
    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Skip to main content" });
    await expect(skip).toBeFocused();
    // Off-screen until focused, so that it does not clutter the page for everyone else.
    await expect(skip).toBeInViewport();
    await page.keyboard.press("Enter");

    await expect(page.locator("main#main")).toBeFocused();
  });

  test("every control of the learner's screens is reachable and shows the focus", async ({ page }) => {
    await register(page);
    await expectKeyboardReachable(page, "the tracks page");

    await page.getByRole("link", { name: "Java Certification" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Java Certification" })).toBeVisible();
    await expectKeyboardReachable(page, "a track");

    await page.getByRole("button", { name: `Practice ${TOPIC_NAME}` }).click();
    await expect(page.getByRole("heading", { level: 2, name: /^Question 1 of/ })).toBeVisible();
    await expectKeyboardReachable(page, "a question");
  });

  test("answering, and then the feedback, stay reachable", async ({ page }) => {
    await register(page);
    await startPractice(page);

    await page.locator("#option-A").check();
    if ((await page.locator("#option-B").getAttribute("type")) === "checkbox") {
      await page.locator("#option-B").check();
    }
    await page.getByLabel(/Medium/).check();
    await page.getByRole("button", { name: "Submit answer" }).click();
    await expect(page.getByRole("heading", { level: 2, name: /^(Correct|Not quite)$/ })).toBeVisible();

    await expectKeyboardReachable(page, "the answer feedback");
  });

  test("the editor and the review panel are reachable", async ({ page, browser }) => {
    const author = await createStaff(["LEARNER", "EDITOR"]);
    const api = await signedInApi(author);
    const created = (await (
      await post(api, "/api/admin/questions", testQuestion(EDITORIAL_TOPIC, "Keyboard check question"))
    ).json()) as QuestionView;
    const revisionId = created.revisions[0]!.id;

    await signIn(page, author);
    await page.goto(`/editorial/questions/${created.id}`);
    await expect(page.getByLabel("Explanation", { exact: true })).toBeVisible();
    await expectKeyboardReachable(page, "the question editor");

    await post(api, `/api/admin/question-revisions/${revisionId}/submit`);
    const reviewer = await (await browser.newContext()).newPage();
    await signIn(reviewer, await createStaff(["LEARNER", "REVIEWER"]));
    await reviewer.goto(`/editorial/questions/${created.id}`);
    await expect(reviewer.getByRole("group", { name: "Content policy" })).toBeVisible();
    await expectKeyboardReachable(reviewer, "the review panel");
    await reviewer.context().close();
    await api.dispose();
  });

  test("a confirmation can be reached and dismissed, and gives the focus back", async ({ page }) => {
    await register(page);
    await startPractice(page);

    await page.getByRole("button", { name: "End session without finishing" }).focus();
    await page.keyboard.press("Enter");

    const confirm = page.getByRole("group", { name: "Confirm ending the session" });
    const yes = confirm.getByRole("button", { name: "Yes, end the session" });
    await expect(yes).toBeFocused();
    await expectKeyboardReachable(page, "the confirmation");

    // The walk above left the focus wherever it ended; put it back where the person was.
    await yes.focus();
    await page.keyboard.press("Tab");
    await expect(confirm.getByRole("button", { name: "Keep practising" })).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("button", { name: "End session without finishing" })).toBeFocused();
  });
});

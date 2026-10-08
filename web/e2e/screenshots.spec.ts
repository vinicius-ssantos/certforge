import { mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Page } from "@playwright/test";
import { createStaff, post, put, signedInApi, testQuestion, type QuestionView } from "./api";
import { register, signIn } from "./helpers";
import { TOPIC_NAME } from "./seed";
import { expect, test } from "./test";

/**
 * Captures the screens of the demonstration scripts (docs/release/demo-scripts.md) as images.
 * Not part of the normal run: `CAPTURE=1 npm run demo:screens` against a stack with the end-to-end
 * fixtures. The questions in the pictures are those fixtures, which say they are test data.
 */
const DIRECTORY = join(import.meta.dirname, "..", "..", "docs", "release", "screenshots");
const EDITORIAL_TOPIC = "a3000000-0000-4000-8000-000000000009"; // Java I/O API
const EDITORIAL_PROMPT = "What does this code print?\n\n```java\nSystem.out.println(1 + 1);\n```";

async function shot(page: Page, name: string) {
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: join(DIRECTORY, `${name}.png`), fullPage: true });
}

test("capture the demonstration screens", async ({ page, browser, request }) => {
  test.skip(!process.env["CAPTURE"], "set CAPTURE=1 to regenerate the screenshots");
  test.setTimeout(180_000);
  mkdirSync(DIRECTORY, { recursive: true });

  // ---- the learner ----
  const signedOut = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
  await signedOut.goto("/login");
  await expect(signedOut.getByRole("heading", { level: 1, name: "Sign in" })).toBeVisible();
  await shot(signedOut, "01-sign-in");
  await signedOut.context().close();

  await register(page);
  await shot(page, "02-tracks");
  await page.getByRole("link", { name: "Java Certification" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Java Certification" })).toBeVisible();
  await shot(page, "03-track");
  await page.getByRole("button", { name: `Practice ${TOPIC_NAME}` }).click();
  await expect(page.getByRole("heading", { level: 2, name: /^Question 1 of/ })).toBeVisible();
  await shot(page, "04-question");

  await page.setViewportSize({ width: 390, height: 844 });
  await shot(page, "05-question-mobile");
  await page.setViewportSize({ width: 1280, height: 720 });

  await page.locator("#option-A").check();
  if ((await page.locator("#option-B").getAttribute("type")) === "checkbox") {
    await page.locator("#option-B").check();
  }
  await page.getByLabel(/Medium/).check();
  await page.getByRole("button", { name: "Submit answer" }).click();
  await expect(page.getByRole("heading", { level: 2, name: /^(Correct|Not quite)$/ })).toBeVisible();
  await shot(page, "06-feedback");

  await page.getByRole("button", { name: "End session without finishing" }).click();
  await page.getByRole("button", { name: "Yes, end the session" }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Session ended" })).toBeVisible();
  await shot(page, "07-session-ended");

  /*
   * The tracks screen again, now that there is something to say about it. `02-tracks` is the
   * first visit, where a card carries no standing because the learner has none; this is the same
   * screen once they do. Without it the release evidence only ever shows the empty state.
   */
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Tracks" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Certification tracks" })).toBeVisible();
  await shot(page, "07b-tracks-with-standing");

  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "History" }).click();
  await expect(page.getByRole("table")).toBeVisible();
  await shot(page, "08-history");
  await page.getByRole("row", { name: new RegExp(TOPIC_NAME.slice(0, 12)) }).getByRole("link").first().click();
  await expect(page.getByRole("heading", { level: 1, name: "Session review" })).toBeVisible();
  await page.getByText("Show the correct answer and explanation").first().click();
  await shot(page, "09-session-review");
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Progress" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Progress" })).toBeVisible();
  await shot(page, "10-progress");

  // ---- the editorial desk ----
  const authorAccount = await createStaff(["LEARNER", "EDITOR"]);
  const author = await signedInApi(authorAccount);
  const created = (await (
    await post(author, "/api/admin/questions", testQuestion(EDITORIAL_TOPIC, EDITORIAL_PROMPT))
  ).json()) as QuestionView;
  const revisionId = created.revisions[0]!.id;

  const editor = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
  await signIn(editor, authorAccount);
  await editor.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Editorial" }).click();
  await expect(editor.getByRole("heading", { level: 1, name: "Questions" })).toBeVisible();
  await shot(editor, "11-editorial-queue");
  await editor.goto(`/editorial/questions/${created.id}`);
  await editor.getByLabel("Reason for B").fill("");
  await editor.getByLabel("Explanation", { exact: true }).fill("");
  await editor.getByRole("button", { name: "Send for review" }).click();
  await expect(editor.getByRole("heading", { name: "Before you can send this" })).toBeVisible();
  await expect(editor.getByRole("link", { name: "Write the explanation." })).toBeVisible();
  await shot(editor, "12-editor-missing");
  await editor.context().close();

  // The author fixes it (here: puts the full content back) and sends it, then a reviewer reads it.
  await put(author, `/api/admin/question-revisions/${revisionId}`, testQuestion(EDITORIAL_TOPIC, EDITORIAL_PROMPT));
  await post(author, `/api/admin/question-revisions/${revisionId}/submit`);
  const reviewerAccount = await createStaff(["LEARNER", "REVIEWER"]);
  const reviewer = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
  await signIn(reviewer, reviewerAccount);
  await reviewer.goto(`/editorial/questions/${created.id}`);
  await expect(reviewer.getByRole("region", { name: "As the learner will see it" })).toBeVisible();
  await reviewer.getByLabel(/technically right/).check();
  await reviewer.getByLabel(/compiles and prints/).check();
  await shot(reviewer, "13-review");
  const reviewerApi = await signedInApi(reviewerAccount);
  await post(reviewerApi, `/api/admin/question-revisions/${revisionId}/approve`, {
    comment: "Checked.",
    checklist: ["TECHNICAL_ACCURACY", "CODE_VERIFIED"],
  });
  await reviewer.context().close();

  const adminAccount = await createStaff(["LEARNER", "ADMINISTRATOR"]);
  const admin = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
  await signIn(admin, adminAccount);
  await admin.goto(`/editorial/questions/${created.id}`);
  await admin.getByRole("button", { name: "Publish revision 1" }).click();
  await expect(admin.getByRole("group", { name: "Confirm publishing revision 1" })).toBeVisible();
  await shot(admin, "14-publish-confirm");
  await admin.goto("/editorial/catalog");
  await expect(admin.getByRole("heading", { level: 1, name: "Catalog" })).toBeVisible();
  await admin.getByRole("link", { name: "Java Certification" }).click();
  await expect(admin.getByRole("region", { name: "Where content can be published" })).toBeVisible();
  await shot(admin, "15-catalog-track");
  await admin.context().close();
  await author.dispose();
  await reviewerApi.dispose();
  void request;
});

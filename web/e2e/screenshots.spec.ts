import { mkdirSync } from "node:fs";
import { join } from "node:path";
import type { Page } from "@playwright/test";
import { createStaff, post, put, publishNewQuestion, signedInApi, testQuestion, type QuestionView } from "./api";
import { expectNoA11yViolations, register, signIn } from "./helpers";
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

/**
 * Optional evidence for #188. Never seed mock content outside a local disposable E2E backend:
 * these answers are test fixtures, not reviewed certification questions.
 */
async function captureMockResult(page: Page, adminAccount: { email: string; password: string }) {
  const apiUrl = new URL(process.env["E2E_API_URL"] ?? "http://localhost:8080");
  if (!["localhost", "127.0.0.1"].includes(apiUrl.hostname)) {
    throw new Error("Mock screenshot seeding requires a local disposable E2E backend.");
  }

  const publisher = await signedInApi(adminAccount);
  try {
    const catalogResponse = await publisher.get("/api/catalog/tracks");
    if (!catalogResponse.ok()) throw new Error("Cannot read mock fixture topics.");
    const catalog = (await catalogResponse.json()) as Array<{
      slug: string;
      topics: Array<{ id: string; name: string }>;
    }>;
    const track = catalog.find((candidate) => candidate.slug === "java-certification");
    if (!track || track.topics.length !== 10) {
      throw new Error("Mock fixture requires all ten certification topics.");
    }
    const existing = (await (
      await publisher.get("/api/admin/questions?status=PUBLISHED")
    ).json()) as Array<{ topicId: string | null }>;
    for (const topic of track.topics) {
      const available = existing.filter((question) => question.topicId === topic.id).length;
      for (let index = available; index < 5; index += 1) {
        await publishNewQuestion(
          publisher,
          topic.id,
          `E2E mock fixture for ${topic.name} #${index + 1} — test data, not exam content.`,
        );
      }
    }
  } finally {
    await publisher.dispose();
  }

  await page.goto("/tracks/java-certification");
  const start = page.getByRole("button", { name: "Start 1Z0-830 mock" });
  await expect(start).toBeVisible({ timeout: 15_000 });
  await start.click();
  await expect(page.getByRole("heading", { level: 1, name: "Mock exam" })).toBeVisible();
  await page.getByRole("button", { name: "Finish and score mock" }).click();
  const confirm = page.getByRole("group", { name: "Submit mock exam" });
  await confirm.getByRole("button", { name: "Submit mock exam" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Mock exam result" })).toBeVisible();
  await expectNoA11yViolations(page);
  await shot(page, "10c-mock-result");
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
  // The heading appears before asynchronous mock availability. Capture the actual shortfall
  // worklist rather than an intermediate loading message; mock result fixtures are seeded later.
  await expect(page.getByRole("table", { name: "Reviewed questions still needed, by topic" })).toBeVisible();
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

  /*
   * The learner's review queue. It had no picture at all, although it is the screen that decides
   * what someone practises next. The fixture answers are correct and confident, so the queue is
   * usually its empty state here — which is itself worth showing, since it explains the rule.
   */
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Review" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Review" })).toBeVisible();
  await shot(page, "10b-review-queue");

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
  await shot(admin, "15a-catalog-overview");
  await admin.getByRole("link", { name: "Java Certification" }).click();
  await expect(admin.getByRole("region", { name: "Where content can be published" })).toBeVisible();
  await shot(admin, "15-catalog-track");
  await admin.context().close();
  // Separate opt-in: creates enough explicitly labelled E2E-only fixtures to start a mock.
  if (process.env["MOCK_CAPTURE"] === "1") {
    await captureMockResult(page, adminAccount);
  }
  await author.dispose();
  await reviewerApi.dispose();
  void request;
});

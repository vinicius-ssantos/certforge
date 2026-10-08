import type { Page } from "@playwright/test";
import { adminApi, ensurePractisableTopic } from "./api";
import { expectNoA11yViolations, expectReflows, register } from "./helpers";
import { expect, test } from "./test";

/**
 * Its own topic and its own questions. Other specs replace published questions with corrected
 * revisions whose correct option differs, so a test that drew from the shared topic and assumed
 * option A would pass alone and fail in the suite — which is exactly what happened first.
 */
const TOPIC = "a3000000-0000-4000-8000-000000000008";
const TOPIC_NAME = "Managing concurrent code execution";
const PROMPT = "Review loop fixture: option A is the expected one.";
const IN_TOPIC = 10;

const CORRECT = "#option-A";
const WRONG = "#option-B";

test.beforeAll(async () => {
  const admin = await adminApi();
  try {
    await ensurePractisableTopic(admin, TOPIC, PROMPT, IN_TOPIC);
  } finally {
    await admin.dispose();
  }
});

async function startPractice(page: Page) {
  await page.getByRole("link", { name: "Java Certification" }).click();
  await page.getByRole("button", { name: `Practice ${TOPIC_NAME}` }).click();
  await expect(
    page.getByRole("heading", { level: 2, name: `Question 1 of ${IN_TOPIC}` }),
  ).toBeVisible();
}

async function answer(page: Page, option: string, confidence: RegExp) {
  await page.locator(option).check();
  await page.getByLabel(confidence).check();
  await page.getByRole("button", { name: "Submit answer" }).click();
  await expect(
    page.getByRole("heading", { level: 2, name: option === CORRECT ? "Correct" : "Not quite" }),
  ).toBeVisible();
}

async function endSession(page: Page) {
  await page.getByRole("button", { name: "End session without finishing" }).click();
  await page.getByRole("button", { name: "Yes, end the session" }).click();
  await expect(page.getByRole("heading", { level: 2, name: /ended/i })).toBeVisible();
}

test.describe("the review loop", () => {
  /**
   * The point of the release, and the one journey neither the unit nor the integration tests can
   * make: be wrong while confident, be told so in words, practise exactly that question, and watch
   * it leave the queue.
   */
  test("a confident wrong answer comes back, is practised, and then rests", async ({ page }) => {
    await register(page);

    await startPractice(page);
    await answer(page, WRONG, /High/);
    await endSession(page);

    // ---- the queue says what happened, in words ----------------------------------------------
    // Scoped to the main navigation: the ended-session screen now offers "See the session review"
    // too, and an unscoped name match reaches both.
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Review" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Review" })).toBeVisible();

    const queued = page.getByRole("listitem").filter({ hasText: PROMPT });
    await expect(queued).toHaveCount(1);
    await expect(queued).toContainText("Wrong, and you were sure");
    // The stable code is for the API, never for the learner.
    await expect(page.getByText("WRONG_WHILE_CONFIDENT")).toHaveCount(0);
    await expectNoA11yViolations(page);
    await expectReflows(page);

    // ---- practising gives exactly that question, not a fresh draw ----------------------------
    await page.getByRole("button", { name: `Practise 1 question in ${TOPIC_NAME}` }).click();
    await expect(page.getByRole("heading", { level: 2, name: "Question 1 of 1" })).toBeVisible();

    await answer(page, CORRECT, /High/);
    await page.getByRole("button", { name: "Finish session" }).click();

    // ---- answered confidently and correctly, it rests instead of repeating -------------------
    await page.getByRole("link", { name: "Review" }).click();
    await expect(page.getByRole("heading", { name: "Nothing is due yet" })).toBeVisible();
    await expect(page.getByText(/resting/)).toBeVisible();
    await expect(page.getByRole("listitem").filter({ hasText: PROMPT })).toHaveCount(0);
  });

  test("the progress page shows where the learner was sure and wrong", async ({ page }) => {
    await register(page);

    await startPractice(page);
    await answer(page, WRONG, /High/);
    await endSession(page);

    await page.getByRole("link", { name: "Progress" }).click();
    const misconceptions = page.getByRole("region", { name: "Where you were sure and wrong" });
    await expect(misconceptions).toBeVisible();
    await expect(misconceptions).toContainText(TOPIC_NAME);
    // Evidence, never a prediction: the page says so and claims nothing about readiness.
    await expect(misconceptions).toContainText("not");
    await expect(page.getByText(/readiness|mastery/i)).toHaveCount(0);
    await expectNoA11yViolations(page);
  });

  test("a learner who has answered nothing is told why the queue is empty", async ({ page }) => {
    await register(page);

    await page.getByRole("link", { name: "Review" }).click();

    await expect(page.getByRole("heading", { name: "Nothing here yet" })).toBeVisible();
    await expect(page.getByRole("link", { name: "tracks page" })).toBeVisible();
    await expectNoA11yViolations(page);
  });
});

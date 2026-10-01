import { expect, test, type Page } from "@playwright/test";
import { FIXTURE_COUNT, TOPIC_NAME } from "./seed";
import { expectNoA11yViolations, expectNoHorizontalOverflow, register } from "./helpers";

async function startPractice(page: Page) {
  await page.getByRole("link", { name: "Java Certification" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Java Certification" })).toBeVisible();
  await page.getByRole("button", { name: `Practice ${TOPIC_NAME}` }).click();
  await expect(page.getByRole("heading", { level: 2, name: `Question 1 of ${FIXTURE_COUNT}` })).toBeVisible();
}

/** Picks the answer the fixtures expect (A, and B on multiple choice) and a confidence level. */
async function answer(page: Page) {
  await page.locator("#option-A").check();
  if (await page.locator("#option-B").getAttribute("type") === "checkbox") {
    await page.locator("#option-B").check();
  }
  await page.getByLabel(/Medium/).check();
  await page.getByRole("button", { name: "Submit answer" }).click();
}

test.describe("the learner journey", () => {
  test("register, practise a topic, finish, then review history and progress", async ({ page }) => {
    await register(page);
    await expectNoA11yViolations(page);
    await expectNoHorizontalOverflow(page);

    await startPractice(page);
    await expect(page.getByRole("heading", { level: 2, name: `Question 1 of ${FIXTURE_COUNT}` })).toBeFocused();
    // The learner has not answered yet, so nothing may reveal the answer.
    await expect(page.getByText("Correct answer.")).toHaveCount(0);
    await expectNoA11yViolations(page);
    await expectNoHorizontalOverflow(page);

    for (let number = 1; number <= FIXTURE_COUNT; number += 1) {
      await expect(
        page.getByRole("heading", { level: 2, name: `Question ${number} of ${FIXTURE_COUNT}` }),
      ).toBeFocused();
      await answer(page);
      await expect(page.getByRole("heading", { level: 2, name: "Correct" })).toBeFocused();
      if (number === 1) {
        await expectNoA11yViolations(page);
        await expectNoHorizontalOverflow(page);
      }
      await page
        .getByRole("button", { name: number === FIXTURE_COUNT ? "Finish session" : "Next question" })
        .click();
    }

    await expect(page.getByRole("heading", { level: 2, name: "Session finished" })).toBeFocused();
    await expect(page.getByText(`${FIXTURE_COUNT} of ${FIXTURE_COUNT} answers were correct.`)).toBeVisible();
    await expectNoA11yViolations(page);

    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "History" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "History" })).toBeVisible();
    const row = page.getByRole("row", { name: new RegExp(TOPIC_NAME) });
    await expect(row).toContainText("Completed");
    await expect(row).toContainText(`${FIXTURE_COUNT} of ${FIXTURE_COUNT}`);
    await expectNoA11yViolations(page);
    await expectNoHorizontalOverflow(page);

    await row.getByRole("link").click();
    await expect(page.getByRole("heading", { level: 1, name: "Session review" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Question 1: correct" })).toBeVisible();
    await expectNoA11yViolations(page);
    await expectNoHorizontalOverflow(page);

    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Progress" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Progress" })).toBeVisible();
    const progress = page.getByRole("row", { name: new RegExp(TOPIC_NAME) });
    await expect(progress).toContainText(String(FIXTURE_COUNT));
    await expect(progress).toContainText("100%");
    await expectNoA11yViolations(page);
    await expectNoHorizontalOverflow(page);
  });

  test("a question can be answered with the keyboard alone", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard navigation is a desktop concern");
    await register(page);
    await page.getByRole("link", { name: "Java Certification" }).click();
    await page.getByRole("button", { name: `Practice ${TOPIC_NAME}` }).focus();
    await page.keyboard.press("Enter");

    await expect(page.getByRole("heading", { level: 2, name: `Question 1 of ${FIXTURE_COUNT}` })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.locator("#option-A")).toBeFocused();
    await page.keyboard.press("Space");
    await expect(page.locator("#option-A")).toBeChecked();
    // Questions come in random order. A multiple-choice question also expects B, and its options
    // are separate tab stops; a single-choice question's radio group is one.
    if ((await page.locator("#option-B").getAttribute("type")) === "checkbox") {
      await page.keyboard.press("Tab");
      await expect(page.locator("#option-B")).toBeFocused();
      await page.keyboard.press("Space");
      await expect(page.locator("#option-B")).toBeChecked();
    }
    for (let presses = 0; presses < 4 && !(await page.locator("#confidence-LOW").evaluate((node) => node === document.activeElement)); presses += 1) {
      await page.keyboard.press("Tab");
    }
    await expect(page.locator("#confidence-LOW")).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.locator("#confidence-MEDIUM")).toBeChecked();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Submit answer" })).toBeFocused();
    await page.keyboard.press("Enter");

    await expect(page.getByRole("heading", { level: 2, name: "Correct" })).toBeFocused();
    const next = page.getByRole("button", { name: "Next question" });
    for (let presses = 0; presses < 6 && !(await next.evaluate((node) => node === document.activeElement)); presses += 1) {
      await page.keyboard.press("Tab");
    }
    await expect(next).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("heading", { level: 2, name: `Question 2 of ${FIXTURE_COUNT}` })).toBeFocused();
  });

  test("validation problems are announced and linked to the field", async ({ page }) => {
    await register(page);
    await startPractice(page);

    await page.getByRole("button", { name: "Submit answer" }).click();

    const summary = page.getByRole("alert").filter({ hasText: "There is a problem" });
    await expect(summary).toBeFocused();
    await expect(summary).toContainText(/Choose (an|at least one) answer./);
    await expect(summary).toContainText("Say how confident you are.");
    await expectNoA11yViolations(page);
  });

  test("signing out ends the session", async ({ page }) => {
    await register(page);

    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Sign in" })).toBeVisible();

    await page.goto("/history");
    await expect(page.getByRole("heading", { level: 1, name: "Sign in" })).toBeVisible();
  });

  test("the sign-in and registration pages have no accessibility violations", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { level: 1, name: "Sign in" })).toBeVisible();
    await expectNoA11yViolations(page);
    await expectNoHorizontalOverflow(page);

    await page.goto("/register");
    await expect(page.getByRole("heading", { level: 1, name: "Create an account" })).toBeVisible();
    await expectNoA11yViolations(page);
    await expectNoHorizontalOverflow(page);
  });
});

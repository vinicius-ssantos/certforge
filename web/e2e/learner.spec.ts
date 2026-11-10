import type { Page } from "@playwright/test";
import { adminApi, put } from "./api";
import { expect, test } from "./test";
import { FIXTURE_COUNT, TOPIC_NAME } from "./seed";
import { expectNoA11yViolations, expectReflows, register } from "./helpers";

/** The fixed id V4 seeds the active Java SE 21 (1Z0-830) exam version with. */
const JAVA_SE_21_VERSION_ID = "a2000000-0000-4000-8000-000000000001";

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
    await expectReflows(page);

    await startPractice(page);
    await expect(page.getByRole("heading", { level: 2, name: `Question 1 of ${FIXTURE_COUNT}` })).toBeFocused();
    // The learner has not answered yet, so nothing may reveal the answer.
    await expect(page.getByText("Correct answer.")).toHaveCount(0);
    await expectNoA11yViolations(page);
    await expectReflows(page);

    for (let number = 1; number <= FIXTURE_COUNT; number += 1) {
      await expect(
        page.getByRole("heading", { level: 2, name: `Question ${number} of ${FIXTURE_COUNT}` }),
      ).toBeFocused();
      await answer(page);
      await expect(page.getByRole("heading", { level: 2, name: "Correct" })).toBeFocused();
      if (number === 1) {
        await expectNoA11yViolations(page);
        await expectReflows(page);
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
    await expectReflows(page);

    await row.getByRole("link").click();
    await expect(page.getByRole("heading", { level: 1, name: "Session review" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 2, name: "Question 1: correct" })).toBeVisible();
    await expectNoA11yViolations(page);
    await expectReflows(page);

    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Progress" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Progress" })).toBeVisible();
    const progress = page.getByRole("row", { name: new RegExp(TOPIC_NAME) });
    await expect(progress).toContainText(String(FIXTURE_COUNT));
    await expect(progress).toContainText("100%");
    await expectNoA11yViolations(page);
    await expectReflows(page);
  });

  test("a question can be answered with the keyboard alone", async ({ page, isMobile }) => {
    test.skip(isMobile, "keyboard navigation is a desktop concern");
    await register(page);
    await page.getByRole("link", { name: "Java Certification" }).click();
    await page.getByRole("button", { name: `Practice ${TOPIC_NAME}` }).focus();
    await page.keyboard.press("Enter");

    await expect(page.getByRole("heading", { level: 2, name: `Question 1 of ${FIXTURE_COUNT}` })).toBeFocused();
    // A question with code has a scrollable code block, which is a tab stop of its own, first.
    // The options are presented in an order the session decides (#233), so the first tab stop in
    // the group is whichever option that session put first, not necessarily A.
    const options = page.locator("fieldset.options input");
    const firstOption = options.first();
    for (let presses = 0; presses < 3 && !(await firstOption.evaluate((node) => node === document.activeElement)); presses += 1) {
      await page.keyboard.press("Tab");
    }
    await expect(firstOption).toBeFocused();

    // Questions come in random order. A single-choice question's radio group is one tab stop, and
    // the arrow keys move the selection inside it; a multiple-choice question's checkboxes are each
    // their own tab stop, and it expects A and B. Either way the keys below reach the correct
    // option, which is what the result at the end of this test is about.
    if ((await page.locator("#option-A").getAttribute("type")) === "radio") {
      await page.keyboard.press("Space");
      for (let presses = 0; presses < 4 && !(await page.locator("#option-A").isChecked()); presses += 1) {
        await page.keyboard.press("ArrowDown");
      }
      await expect(page.locator("#option-A")).toBeChecked();
    } else {
      const count = await options.count();
      for (let index = 0; index < count; index += 1) {
        if (index > 0) {
          await page.keyboard.press("Tab");
        }
        const option = options.nth(index);
        await expect(option).toBeFocused();
        if (["option-A", "option-B"].includes((await option.getAttribute("id")) ?? "")) {
          await page.keyboard.press("Space");
          await expect(option).toBeChecked();
        }
      }
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

  /**
   * The seeded Java SE 21 exam version has no verified objectives snapshot, so no learner has ever
   * seen a readiness report (#176) -- this verifies one as an administrator would and confirms it
   * shows up, with the one objective nothing claims yet called out as a gap.
   */
  test("the readiness report appears once an administrator verifies the exam objectives", async ({
    page,
    isMobile,
  }) => {
    const admin = await adminApi();
    await put(admin, `/api/admin/catalog/exam-versions/${JAVA_SE_21_VERSION_ID}/objectives`, {
      providerVersion: "E2E reading 1",
      verifiedOn: "2026-10-22",
      sourceUrl: "https://education.oracle.com/java-se-21-developer/pexam_1Z0-830",
      sourceDigest: `sha256:${"a".repeat(64)}`,
      objectives: [
        { key: "E2E-1.1", title: "An objective with a published question already" },
        { key: "E2E-99.9", title: "An objective nothing claims yet" },
      ],
    });
    await admin.dispose();

    await register(page);
    await page.getByRole("link", { name: "Java Certification" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Java Certification" })).toBeVisible();

    const readiness = page.getByRole("region", { name: "Content readiness" });
    await expect(readiness).toContainText("E2E reading 1");
    await expect(readiness).toContainText("0 of 2 objectives");
    await expect(readiness.getByRole("row", { name: /E2E-99\.9/ })).toBeVisible();
    if (!isMobile) {
      await expectNoA11yViolations(page);
    }
    await expectReflows(page);
  });

  test("the sign-in and registration pages have no accessibility violations", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { level: 1, name: "Sign in" })).toBeVisible();
    await expectNoA11yViolations(page);
    await expectReflows(page);

    await page.goto("/register");
    await expect(page.getByRole("heading", { level: 1, name: "Create an account" })).toBeVisible();
    await expectNoA11yViolations(page);
    await expectReflows(page);
  });
});

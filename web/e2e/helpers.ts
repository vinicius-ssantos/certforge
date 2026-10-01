import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

/** A new learner for each test, so runs never depend on one another. */
export function newLearner() {
  const unique = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
  return { email: `learner-${unique}@example.com`, password: "a long e2e password" };
}

export async function register(page: Page, learner = newLearner()) {
  await page.goto("/register");
  await page.getByLabel("Email").fill(learner.email);
  await page.getByLabel("Password").fill(learner.password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Certification tracks" })).toBeVisible();
  return learner;
}

/** Fails on any WCAG 2.x A/AA violation axe can detect on the current page. */
export async function expectNoA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const summary = results.violations.map(
    (violation) => `${violation.id} (${violation.impact}): ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`,
  );
  expect(summary, `accessibility violations on ${page.url()}`).toEqual([]);
}

/** No horizontal scrolling at the current viewport width. */
export async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, `horizontal overflow on ${page.url()}`).toBeLessThanOrEqual(0);
}

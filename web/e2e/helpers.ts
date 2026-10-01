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

async function violationsOf(page: Page): Promise<string[]> {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  return results.violations.map(
    (violation) => `${violation.id} (${violation.impact}): ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`,
  );
}

/**
 * Fails on any WCAG 2.x A/AA violation axe can detect on the current page, **in both colour
 * schemes**. The app has a dark scheme with its own colours, and contrast is the thing most likely
 * to differ between them, so checking only the one the runner happens to use would leave half the
 * design unchecked. The page's scheme is restored afterwards.
 */
export async function expectNoA11yViolations(page: Page) {
  const found: string[] = [];
  for (const scheme of ["light", "dark"] as const) {
    // Reduced motion is emulated with the scheme so that the colours measured are the settled ones.
    // The app transitions the colour of buttons and links over 150 ms (only when motion is welcome),
    // so switching scheme and measuring at once samples blends of the two themes, which are neither
    // theme's real colours. Under reduced motion the app applies no transition, so each measurement
    // is of the scheme as a reader actually sees it.
    await page.emulateMedia({ colorScheme: scheme, reducedMotion: "reduce" });
    found.push(...(await violationsOf(page)).map((violation) => `[${scheme}] ${violation}`));
  }
  await page.emulateMedia({ colorScheme: null, reducedMotion: null });
  expect(found, `accessibility violations on ${page.url()}`).toEqual([]);
}

async function overflowOf(page: Page): Promise<number> {
  return page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
}

/**
 * The page never asks the reader to scroll sideways to read it: not at the width the test is using,
 * and not at 320 CSS pixels, which is WCAG 2.1 reflow (1.4.10) and is what a 1280 px desktop looks
 * like zoomed to 400 per cent, the way someone with low vision often reads. A code block may scroll
 * on its own; the page may not. The viewport is restored afterwards.
 */
export async function expectReflows(page: Page) {
  expect(await overflowOf(page), `horizontal overflow on ${page.url()}`).toBeLessThanOrEqual(0);

  const original = page.viewportSize();
  await page.setViewportSize({ width: 320, height: 800 });
  const narrow = await overflowOf(page);
  if (original) {
    await page.setViewportSize(original);
  }
  expect(narrow, `sideways scrolling needed at 320px on ${page.url()}`).toBeLessThanOrEqual(0);
}

/** Signs in through the sign-in page, as a person would. */
export async function signIn(page: Page, account: { email: string; password: string }) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(account.email);
  await page.getByLabel("Password").fill(account.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Certification tracks" })).toBeVisible();
}

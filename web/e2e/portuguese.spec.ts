import { expect, test } from "./test";
import { expectNoA11yViolations, register } from "./helpers";
import { ptBR } from "../src/i18n/pt-BR";
import { en } from "../src/i18n/en";

/**
 * The Portuguese interface in a real browser. The rest of the suite is pinned to English by
 * `playwright.config.ts`, so this is the one place that switches, and it asserts against the
 * catalog rather than against pasted Portuguese: a wording change then updates both at once, and a
 * key left untranslated fails the comparison against English below.
 */
test.describe("the interface in Portuguese", () => {
  test("switches language, remembers it, and keeps the English question text marked", async ({ page }) => {
    await register(page);

    // The switcher is in the header on every page.
    await page.getByLabel(en.language.label).selectOption("pt-BR");

    await expect(page.getByRole("heading", { level: 1, name: ptBR.tracks.title })).toBeVisible();
    await expect(page.getByRole("link", { name: ptBR.layout.progress })).toBeVisible();
    await expect(page.getByRole("button", { name: ptBR.layout.signOut })).toBeVisible();
    // The English heading is gone, which a missing key would not achieve.
    await expect(page.getByRole("heading", { level: 1, name: en.tracks.title })).toHaveCount(0);

    // The document language follows, which is what a screen reader reads phonetics from.
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");

    await expectNoA11yViolations(page);

    // Remembered across a reload, rather than falling back to the browser's language.
    await page.reload();
    await expect(page.getByRole("heading", { level: 1, name: ptBR.tracks.title })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");

    // Into a session: the chrome is Portuguese, the question stays English and says so.
    await page.getByRole("link", { name: "Java Certification" }).click();
    await page.getByRole("button", { name: new RegExp(`^${ptBR.track.practice} `) }).first().click();
    await expect(page.getByRole("heading", { level: 1, name: ptBR.session.title })).toBeVisible();
    await expect(page.getByRole("button", { name: ptBR.question.submit })).toBeVisible();
    await expect(page.locator(".prompt").first()).toHaveAttribute("lang", "en");

    await expectNoA11yViolations(page);

    // And back, which proves the switch is not one-way.
    await page.getByLabel(ptBR.language.label).selectOption("en");
    await expect(page.getByRole("heading", { level: 1, name: en.session.title })).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("follows the browser's language when nothing was chosen", async ({ browser }) => {
    const context = await browser.newContext({ locale: "pt-BR" });
    const page = await context.newPage();
    try {
      await register(page, undefined, ptBR);
      await expect(page.getByRole("heading", { level: 1, name: ptBR.tracks.title })).toBeVisible();
      await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
    } finally {
      await context.close();
    }
  });
});

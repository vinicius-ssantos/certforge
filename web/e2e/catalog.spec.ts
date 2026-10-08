import { createStaff } from "./api";
import { expectNoA11yViolations, expectReflows, signIn } from "./helpers";
import { expect, test } from "./test";

/**
 * The catalog as an administrator inspects it, against the real seeded catalog. The unit tests use
 * a stand-in server, so this is what proves the administrative projection really has the shape the
 * screens read.
 */
test.describe("inspecting the catalog", () => {
  test("an administrator sees the track, its active exam version and the topics mapped to it", async ({
    page,
    isMobile,
  }) => {
    await signIn(page, await createStaff(["LEARNER", "ADMINISTRATOR"]));

    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Editorial" }).click();
    await page.getByRole("link", { name: "Catalog" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Catalog" })).toBeVisible();

    const row = page.locator("li.card").filter({ has: page.getByRole("link", { name: "Java Certification" }) });
    await expect(row).toContainText("Active");
    await expect(row).toContainText("Oracle");
    if (!isMobile) {
      await expectNoA11yViolations(page);
    }
    await expectReflows(page);

    await row.getByRole("link", { name: "Java Certification" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Java Certification" })).toBeVisible();

    // The seeded exam version is active and maps all ten topics, so content can be published.
    const where = page.getByRole("region", { name: "Where content can be published" });
    await expect(where).toContainText("10 topics mapped to Java SE 21 (1Z0-830)");
    await expect(where).toContainText("Java 21");
    await expect(where).not.toContainText("not mapped to the active exam version");

    const versions = page.getByRole("region", { name: "Exam versions" });
    await expect(versions.getByRole("row", { name: /Handling exceptions/ })).toBeVisible();
    await expect(versions.getByRole("link", { name: /Official exam objectives/ })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    if (!isMobile) {
      await expectNoA11yViolations(page);
    }
    await expectReflows(page);
  });

  test("an editor is not offered the catalog and is refused if they go there", async ({ page }) => {
    await signIn(page, await createStaff(["LEARNER", "EDITOR"]));
    await page.goto("/editorial");
    await expect(page.getByRole("heading", { level: 1, name: "Questions" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Catalog" })).toHaveCount(0);

    await page.goto("/editorial/catalog");

    await expect(page.getByRole("heading", { name: "You do not have access to the catalog" })).toBeVisible();
  });
});

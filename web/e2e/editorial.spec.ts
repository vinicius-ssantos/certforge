import { expect, test, type Page } from "@playwright/test";
import { createStaff } from "./api";
import { expectNoA11yViolations, expectNoHorizontalOverflow, signIn } from "./helpers";
import { TOPIC_NAME } from "./seed";

/** Fills the editor with a complete, clearly labelled test question. */
async function writeQuestion(page: Page, label: string) {
  await page.getByLabel("Topic", { exact: true }).selectOption({ label: TOPIC_NAME });
  await page.getByLabel("Difficulty", { exact: true }).selectOption("EASY");
  await page.getByLabel("Why this difficulty").fill("Test data for an automated check.");
  await page.getByLabel("Question", { exact: true }).fill(`${label}\n\n\`\`\`java\nSystem.out.println(1 + 1);\n\`\`\``);
  await page.getByLabel("Option A", { exact: true }).fill("2");
  await page.getByLabel("Reason for A").fill("One plus one is two.");
  await page.getByLabel("Option A is correct").check();
  await page.getByLabel("Option B", { exact: true }).fill("11");
  await page.getByLabel("Reason for B").fill("That would be string concatenation.");
  await page.getByLabel("Explanation", { exact: true }).fill("Integer addition gives two.");
  await page.getByLabel("Title of reference 1").fill("Java SE 21 documentation");
  await page.getByLabel("Link of reference 1").fill("https://docs.oracle.com/en/java/javase/21/");
}

test.describe("the editorial desk", () => {
  test("an editor writes a question, is told what is missing, and sends it for review", async ({ page }) => {
    const label = `E2E editorial question ${Date.now()}`;
    await signIn(page, await createStaff(["LEARNER", "EDITOR"]));

    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Editorial" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Questions" })).toBeVisible();
    await expectNoA11yViolations(page);
    await expectNoHorizontalOverflow(page);

    await page.getByRole("link", { name: "New question" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "New question" })).toBeVisible();
    await expectNoA11yViolations(page);
    await expectNoHorizontalOverflow(page);

    // Save only what is written so far; the server accepts an unfinished draft.
    await page.getByLabel("Topic", { exact: true }).selectOption({ label: TOPIC_NAME });
    await page.getByLabel("Question", { exact: true }).fill(label);
    await page.getByRole("button", { name: "Save draft" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Revision 1" })).toBeVisible();
    await expect(page.getByText("Draft saved.")).toBeFocused();

    // Sending an incomplete draft lists what is missing, each item leading to its field.
    await page.getByRole("button", { name: "Send for review" }).click();
    const missing = page.getByRole("alert").filter({ hasText: "Write the explanation." });
    await expect(missing).toBeVisible();
    await missing.getByRole("link", { name: "Write the explanation." }).click();
    await expect(page.getByLabel("Explanation", { exact: true })).toBeFocused();
    await expectNoA11yViolations(page);

    await writeQuestion(page, label);
    await page.getByRole("button", { name: "Send for review" }).click();

    await expect(page.getByText(/Sent for review/)).toBeFocused();
    await expect(page.getByText("Current status:")).toContainText("In review");
    await expect(page.getByRole("region", { name: "As the learner will see it" })).toContainText(label);
    await expect(page.getByLabel("Code example")).toContainText("System.out.println(1 + 1);");
    await expectNoA11yViolations(page);
    await expectNoHorizontalOverflow(page);

    await page.getByRole("link", { name: "Back to questions" }).click();
    await page.getByRole("link", { name: "Waiting for review" }).click();
    await expect(page.getByRole("row", { name: new RegExp(label) })).toContainText("In review");
  });

  test("a learner has no way into the editorial desk", async ({ page, request }) => {
    const unique = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
    const account = { email: `plain-${unique}@example.com`, password: "a long e2e password" };
    const csrf = (await (await request.get("/api/auth/csrf")).json()) as { token: string; headerName: string };
    await request.post("/api/auth/register", { headers: { [csrf.headerName]: csrf.token }, data: account });
    await signIn(page, account);

    await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Editorial" })).toHaveCount(0);
    await page.goto("/editorial");
    await expect(page.getByRole("heading", { name: "You do not have access to the editorial desk" })).toBeVisible();
  });
});

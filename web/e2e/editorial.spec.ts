import { expect, test, type Page } from "@playwright/test";
import { createStaff } from "./api";
import { expectNoA11yViolations, expectNoHorizontalOverflow, signIn } from "./helpers";

/**
 * The editorial tests publish real questions into the throwaway database, so they use a topic of
 * their own. The learner tests draw their sessions from another one and stay predictable.
 */
const TOPIC_NAME = "Java I/O API";

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

async function openQuestion(page: Page, filter: string, label: string) {
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Editorial" }).click();
  await page.getByRole("link", { name: filter }).click();
  await page.getByRole("link", { name: label }).first().click();
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

  test("a question goes from draft to published through an author, a reviewer and an administrator", async ({ page, browser, isMobile }) => {
    test.skip(isMobile, "a workflow check across three people; the layout is covered by the other tests");
    const label = `E2E pipeline question ${Date.now()}`;

    // The author writes it and sends it.
    const author = await createStaff(["LEARNER", "EDITOR"]);
    await signIn(page, author);
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Editorial" }).click();
    await page.getByRole("link", { name: "New question" }).click();
    await writeQuestion(page, label);
    await page.getByRole("button", { name: "Send for review" }).click();
    await expect(page.getByText(/Sent for review/)).toBeVisible();

    // A reviewer reads it as the learner will, and approves it.
    const reviewerPage = await (await browser.newContext()).newPage();
    await signIn(reviewerPage, await createStaff(["LEARNER", "REVIEWER"]));
    await openQuestion(reviewerPage, "Waiting for review", label);
    await expect(reviewerPage.getByRole("region", { name: "As the learner will see it" })).toContainText(label);
    await expect(reviewerPage.getByRole("heading", { name: "Publish" })).toHaveCount(0);
    await expectNoA11yViolations(reviewerPage);
    await expect(reviewerPage.getByText(`Written by ${author.email}`)).toBeVisible();
    await reviewerPage.getByLabel(/technically right/).check();
    await reviewerPage.getByLabel(/compiles and prints/).check();
    await reviewerPage.getByLabel("Comment").fill("Checked by the e2e reviewer.");
    await reviewerPage.getByRole("button", { name: "Approve" }).click();
    await expect(reviewerPage.getByRole("status").filter({ hasText: /^Approved./ })).toBeFocused();
    await expect(reviewerPage.getByText("Current status:")).toContainText("Approved");
    await reviewerPage.context().close();

    // An administrator publishes it, after being asked to confirm.
    const adminPage = await (await browser.newContext()).newPage();
    await signIn(adminPage, await createStaff(["LEARNER", "ADMINISTRATOR"]));
    await openQuestion(adminPage, "Approved", label);
    const notes = adminPage.getByRole("region", { name: "Review notes" });
    await expect(notes).toContainText("by staff-");
    await expect(notes).toContainText("Checked: The correct answer is technically right");
    await expect(notes).toContainText("The code compiles and prints what the question says");
    await adminPage.getByRole("button", { name: "Publish revision 1" }).click();
    const confirm = adminPage.getByRole("group", { name: "Confirm publishing revision 1" });
    await expect(confirm.getByRole("button", { name: "Yes, publish revision 1" })).toBeFocused();
    await expectNoA11yViolations(adminPage);
    await confirm.getByRole("button", { name: "Yes, publish revision 1" }).click();
    await expect(adminPage.getByRole("status").filter({ hasText: /^Published./ })).toBeFocused();
    await expect(adminPage.getByText("Current status:")).toContainText("Published");
    await expect(adminPage.getByText(/Published by staff-/)).toBeVisible();
    await adminPage.getByRole("link", { name: "Back to questions" }).click();
    await adminPage.getByRole("link", { name: "Published" }).click();
    await expect(adminPage.getByRole("row", { name: new RegExp(label) })).toContainText("Published");
    await adminPage.context().close();

    // The author can now correct it by starting a new revision, copied from the published one.
    await openQuestion(page, "Published", label);
    await expect(page.getByRole("heading", { level: 1, name: "Revision 1" })).toBeVisible();
    await page.getByRole("button", { name: "Start a new revision" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Revision 2" })).toBeVisible();
    await expect(page.getByLabel("Question", { exact: true })).toHaveValue(new RegExp(label));
    await expect(page.getByRole("list", { name: "Revision status" }).locator("li[aria-current=step]")).toContainText("Draft");

    // Editing, then trying to leave, asks first; the work is still there when the author stays.
    await page.getByLabel("Question", { exact: true }).focus();
    await page.keyboard.press("Control+End");
    await page.keyboard.type(" Corrected.");
    await page.getByRole("link", { name: "Back to questions" }).click();
    const unsaved = page.getByRole("group", { name: "Unsaved changes" });
    await expect(unsaved.getByRole("button", { name: "Keep editing" })).toBeFocused();
    await expectNoA11yViolations(page);
    await unsaved.getByRole("button", { name: "Keep editing" }).click();
    await expect(page.getByLabel("Question", { exact: true })).toHaveValue(/Corrected\.$/);

    // Sending the correction shows what it changed compared with the published revision.
    await page.getByRole("button", { name: "Send for review" }).click();
    const diff = page.getByRole("region", { name: "What changed since revision 1" });
    await expect(diff).toContainText("Corrected.");
    await expect(diff.locator("ins")).toContainText("Corrected.");
    await expectNoA11yViolations(page);
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

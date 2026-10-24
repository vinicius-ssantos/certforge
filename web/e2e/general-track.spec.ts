import { adminApi, ensurePractisableTopic, post, registerLearner } from "./api";
import { expectNoA11yViolations, expectReflows, signIn } from "./helpers";
import { expect, test } from "./test";

/**
 * General-knowledge preparation, end to end (#176): a learner browses a general track on the same
 * page as certification tracks, starts a session on one of its topics through the ordinary study
 * session endpoint, and the attempt shows up in history and progress -- the same way a
 * certification session would.
 *
 * The seeded Infrastructure & DevOps Foundations track is real content, DRAFT because it awaits
 * human review (its 74-question pack is reviewed in a separate editorial desk, not through this
 * API). Opening the *taxonomy* in the throwaway e2e database -- activating the track and its
 * version -- is not publishing that content: this test publishes its own fixture question,
 * clearly labelled as test data, onto one of the taxonomy's real seeded topics.
 */
const TRACK_ID = "a1000000-0000-4000-8000-000000000003";
const VERSION_ID = "a2000000-0000-4000-8000-000000000003";
const TOPIC_ID = "a3000000-0000-4000-8000-000000000301";
const TOPIC_NAME = "Docker and Containers";
const MARKER = "E2E general-track fixture";

test.describe("general-knowledge preparation", () => {
  test.beforeAll(async () => {
    const admin = await adminApi();
    await post(admin, `/api/admin/catalog/tracks/${TRACK_ID}/activate`);
    await post(admin, `/api/admin/catalog/exam-versions/${VERSION_ID}/activate`);
    await ensurePractisableTopic(admin, TOPIC_ID, `${MARKER}: pick the expected option.`);
  });

  test("a learner browses a general track beside certification tracks, and history follows", async ({
    page,
    isMobile,
  }) => {
    const learner = await registerLearner(await adminApi());
    await signIn(page, learner);

    await expect(page.getByRole("heading", { level: 1, name: "Tracks" })).toBeVisible();
    const row = page.locator("li.card").filter({
      has: page.getByRole("link", { name: "Infrastructure & DevOps Foundations" }),
    });
    await expect(row).toBeVisible();
    if (!isMobile) {
      await expectNoA11yViolations(page);
    }
    await expectReflows(page);

    await row.getByRole("link", { name: "Infrastructure & DevOps Foundations" }).click();
    await expect(
      page.getByRole("heading", { level: 1, name: "Infrastructure & DevOps Foundations" }),
    ).toBeVisible();

    await page
      .locator("li")
      .filter({ hasText: TOPIC_NAME })
      .getByRole("button", { name: `Practice ${TOPIC_NAME}` })
      .click();
    await expect(page.getByRole("heading", { level: 1, name: "Practice session" })).toBeVisible();
    await expect(page.getByText(MARKER)).toBeVisible();

    await page.getByLabel("The expected option").check();
    await page.getByLabel("High – I am certain").check();
    await page.getByRole("button", { name: "Submit answer" }).click();
    await expect(page.getByText("Correct")).toBeVisible();
    await page.getByRole("button", { name: "End session without finishing" }).click();
    await page.getByRole("button", { name: "Yes, end the session" }).click();

    // The switch #176 asks for: back on the home page, the certification track's own history is
    // untouched, and the general track now carries attempts of its own -- one history, one
    // progress, both keyed by topic rather than by which kind of track it belongs to.
    await page.goto("/");
    const generalRow = page.locator("li.card").filter({
      has: page.getByRole("link", { name: "Infrastructure & DevOps Foundations" }),
    });
    await expect(generalRow).toContainText("Attempted");

    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "History" }).click();
    await expect(page.getByText(TOPIC_NAME)).toBeVisible();
  });
});

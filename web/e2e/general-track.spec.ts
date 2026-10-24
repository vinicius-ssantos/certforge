import { adminApi, post, publishRevision, registerLearner, type QuestionView } from "./api";
import { expectNoA11yViolations, expectReflows, signIn } from "./helpers";
import { expect, test } from "./test";
import type { APIRequestContext } from "@playwright/test";

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
const PROMPT = `${MARKER}: pick the expected option.`;

/**
 * A general-track topic admits no Java release and no seniority (RevisionRules, GENERAL kind) --
 * unlike `testQuestion` in `./api`, built for the Java certification track. Published directly
 * rather than through `ensurePractisableTopic`, which calls that helper.
 */
async function publishGeneralFixture(admin: APIRequestContext, topicId: string, prompt: string) {
  const created = (await (
    await post(admin, "/api/admin/questions", {
      type: "SINGLE_CHOICE",
      topicId,
      difficulty: "EASY",
      difficultyRationale: "Test data; it carries no teaching value.",
      prompt,
      explanation: "Test data: the expected option is marked correct.",
      options: [
        { key: "A", text: "The expected option", correct: true, explanation: "Expected by the test." },
        { key: "B", text: "A wrong option", correct: false, explanation: "Wrong on purpose." },
      ],
      references: [{ title: "Test data", url: "https://example.com/test-data" }],
    })
  ).json()) as QuestionView;
  await publishRevision(admin, created.revisions[0]!.id);
}

test.describe("general-knowledge preparation", () => {
  test.beforeAll(async () => {
    const admin = await adminApi();
    await post(admin, `/api/admin/catalog/tracks/${TRACK_ID}/activate`);
    await post(admin, `/api/admin/catalog/exam-versions/${VERSION_ID}/activate`);
    // Matches the server's default session size; topped up each run is unnecessary here since
    // this topic exists only for this spec.
    for (let i = 0; i < 10; i += 1) {
      await publishGeneralFixture(admin, TOPIC_ID, PROMPT);
    }
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
    await expect(page.getByRole("heading", { name: "Correct" })).toBeVisible();
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

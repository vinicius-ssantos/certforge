import type { APIRequestContext } from "@playwright/test";
import {
  adminApi,
  post,
  publishRevision,
  registerLearner,
  signedInApi,
  type QuestionView,
} from "./api";
import { expectNoA11yViolations, expectReflows, signIn } from "./helpers";
import { expect, test } from "./test";

/**
 * Interview preparation end to end, against the real backend.
 *
 * The seeded Java Backend taxonomy is DRAFT, as it should be: it is not finished content. So this
 * suite opens it in the throwaway database and publishes two fixture questions into one of its
 * topics — one objective and one guided — which is the only way to walk a session that mixes the
 * two kinds. The fixtures say in their own text that they are test data.
 */
const TRACK_ID = "a1000000-0000-4000-8000-000000000002";
const VERSION_ID = "a2000000-0000-4000-8000-000000000002";
const TRACK_SLUG = "java-backend-interview";
const TOPIC_ID = "a3000000-0000-4000-8000-000000000110";
const TOPIC_NAME = "Messaging";
const MARKER = "E2E interview fixture";

function objectiveFixture() {
  return {
    type: "SINGLE_CHOICE",
    topicId: TOPIC_ID,
    seniority: "SENIOR",
    difficulty: "EASY",
    difficultyRationale: "A fixture for automated tests; it carries no teaching value.",
    prompt: `${MARKER}: pick the option the test expects.\n\nThis is test data, not exam content.`,
    explanation: "Fixture: option A is the expected one. This text is test data.",
    options: [
      { key: "A", text: "The expected option", correct: true, explanation: "Expected by the test." },
      { key: "B", text: "A wrong option", correct: false, explanation: "Fixture option B." },
    ],
    references: [{ title: "Test data", url: "https://example.com/test-data" }],
  };
}

function guidedFixture() {
  return {
    type: "GUIDED_RESPONSE",
    topicId: TOPIC_ID,
    seniority: "SENIOR",
    difficulty: "MEDIUM",
    difficultyRationale: "A fixture for automated tests; it carries no teaching value.",
    prompt: `${MARKER}: talk through this, as test data.\n\nThis is test data, not exam content.`,
    guidedResponse: {
      referenceAnswer: "Fixture reference answer. This text is test data.",
      expectedConcepts: [
        { text: "fixtureExpectedConcept", required: true, explanation: "Fixture concept." },
        { text: "fixtureSecondConcept", required: false, explanation: "Fixture concept." },
      ],
      commonMistakes: ["Fixture common mistake."],
      followUps: ["Fixture follow-up prompt."],
    },
    references: [{ title: "Test data", url: "https://example.com/test-data" }],
  };
}

/** Opens the taxonomy and publishes the two fixtures, once per run. */
async function seedInterviewContent(admin: APIRequestContext) {
  await post(admin, `/api/admin/catalog/tracks/${TRACK_ID}/activate`);
  await post(admin, `/api/admin/catalog/exam-versions/${VERSION_ID}/activate`);

  for (const content of [objectiveFixture(), guidedFixture()]) {
    const created = (await (await post(admin, "/api/admin/questions", content)).json()) as QuestionView;
    await publishRevision(admin, created.revisions[0]!.id);
  }
}

test.describe("interview preparation", () => {
  test.beforeAll(async () => {
    await seedInterviewContent(await adminApi());
  });

  test("a learner walks a session that mixes a graded item and one nothing grades", async ({
    page,
    isMobile,
  }) => {
    const api = await adminApi();
    const learner = await registerLearner(api);
    await signIn(page, learner);

    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Interviews" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Interview prep" })).toBeVisible();
    if (!isMobile) {
      await expectNoA11yViolations(page);
    }
    await expectReflows(page);

    await page.getByLabel(TOPIC_NAME).check();
    await page.getByLabel("Questions").fill("2");
    await page.getByRole("button", { name: "Start session" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Interview session" })).toBeVisible();

    // Two items, each answered on its own terms. Which kind is on the screen is read from the
    // page rather than assumed, because the order of a session is the server's to choose.
    for (let answered = 0; answered < 2; answered++) {
      const guided = await page.getByText("Guided answer").isVisible();
      if (guided) {
        await expect(page.getByText(/Nothing grades this answer/)).toBeVisible();
        await page.getByLabel(/Your answer/).fill("Fixture answer typed by the test.");
        await page.getByLabel("Low – I am guessing").check();
        await page.getByRole("button", { name: /Show what a reviewer expected/ }).click();

        // The reviewed material, and the learner's own marks about their own answer.
        await expect(page.getByText("Fixture reference answer. This text is test data.")).toBeVisible();
        await expect(page.getByText("Fixture common mistake.")).toBeVisible();
        await expect(page.getByText("Fixture follow-up prompt.")).toBeVisible();
        await page.getByLabel(/fixtureExpectedConcept/).check();
        // Nothing here is a score, and the screen says whose statement the marks are.
        await expect(page.getByText(/nothing scores this answer/)).toBeVisible();
      } else {
        await page.getByLabel(/The expected option/).check();
        await page.getByLabel("High – I am certain").check();
        await page.getByRole("button", { name: "Submit answer" }).click();
        await expect(page.getByRole("heading", { name: /Correct|Not correct/ })).toBeVisible();
      }

      const last = answered === 1;
      await page.getByRole("button", { name: last ? "Finish session" : "Next item" }).click();
    }

    await expect(page.getByText(/This session is closed/)).toBeVisible();

    // What it recorded, counted by kind and never added together.
    await page.getByRole("link", { name: "What practice has shown" }).click();
    const evidence = page.getByRole("region", { name: TOPIC_NAME });
    await expect(evidence).toContainText("Practised");
    await expect(evidence).not.toContainText("%");
    if (!isMobile) {
      await expectNoA11yViolations(page);
    }
  });

  test("a job description is weighed by words the learner can read", async ({ page }) => {
    const api = await adminApi();
    const learner = await registerLearner(api);
    await signIn(page, learner);

    await page.goto("/interviews/blueprints/new");
    await expect(page.getByText(/No model reads this/)).toBeVisible();

    await page.getByLabel(/Role/).fill("Senior Java engineer");
    await page
      .getByLabel("The job description")
      .fill("We run Spring Boot services and Kafka. Experience with Kubernetes is a plus.");
    await page.getByLabel(/Requirements/).fill("Our in-house FooBar framework");
    await page.getByRole("button", { name: "Read it" }).click();

    await expect(page.getByRole("heading", { level: 1, name: "Senior Java engineer" })).toBeVisible();

    // Every weight carries the words behind it, which is the whole requirement of #22.
    const spring = page.getByRole("row").filter({ has: page.getByRole("rowheader", { name: "spring" }) });
    await expect(spring).toContainText("spring boot");

    // And what the dictionary did not recognise is named back rather than guessed at.
    await expect(page.getByText("Our in-house FooBar framework")).toBeVisible();
    await expect(page.getByText(/no fit, no readiness for the role/)).toBeVisible();
    await expectNoA11yViolations(page);
  });

  test("the session a learner left open is the one they come back to", async ({ page }) => {
    const api = await adminApi();
    const learner = await registerLearner(api);
    const asLearner = await signedInApi(learner);
    const started = await post(asLearner, "/api/study/interviews", {
      trackSlug: TRACK_SLUG,
      topicIds: [TOPIC_ID],
      questionCount: 1,
    });
    const session = (await started.json()) as { id: string };

    await signIn(page, learner);
    await page.goto("/interviews");

    const resume = page.getByRole("region", { name: "You have a session open" });
    await expect(resume).toBeVisible();
    await resume.getByRole("link", { name: "Continue session" }).click();
    await expect(page).toHaveURL(new RegExp(`/interviews/${session.id}$`));
  });
});

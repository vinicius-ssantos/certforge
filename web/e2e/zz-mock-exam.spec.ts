import type { APIRequestContext } from "@playwright/test";
import { adminApi, listQuestions, publishNewQuestion } from "./api";
import { expectNoA11yViolations, expectReflows, register } from "./helpers";
import { expect, test } from "./test";

/**
 * The 1Z0-830 blueprint (`MockExamBlueprintCatalog`) needs five published questions in every one
 * of the ten Java Certification topics before a mock can start at all — short of that, starting
 * refuses with `insufficient_mock_content`. Nothing else in this suite publishes that many
 * questions across every topic, so until now no spec exercised the mock exam in a real browser;
 * `docs/release/v0.3.0-scope-proposal.md` names that absence directly.
 *
 * The `zz-` prefix is deliberate, not a typo: `review.spec.ts` and others each treat one specific
 * certification topic as theirs alone and top it up to an exact count for their own scenario.
 * Topping up every topic here, including theirs, is only safe once their own setup has already
 * run — Playwright runs spec files in filename order under this project's `workers: 1` config, so
 * this file is named to sort after all of them (after `screenshots.spec.ts`, today's last file).
 * By the time this file's `beforeAll` runs, every other topic already carries whatever count its
 * own spec wanted, and this only ever adds to a topic nothing else has touched.
 */
const TRACK_SLUG = "java-certification";
const QUESTIONS_PER_TOPIC = 5;
const TOTAL_QUESTIONS = 50;
const MARKER = "E2E mock-exam fixture";

/**
 * Tops up each topic to five published questions rather than republishing every run.
 *
 * Counts *every* published question in the topic, not only this fixture's own — topic one of
 * this track is the suite's general-purpose practice topic (`seed.ts`) and already carries ten,
 * well past the five the blueprint needs. Topping it up by this fixture's own count alone would
 * have added five more on top of those ten, growing a pool every other spec already assumes is
 * exactly ten questions. Counting the total means this fixture only ever adds the shortfall.
 */
async function ensureMockReadyTrack(admin: APIRequestContext): Promise<void> {
  const catalog = (await (await admin.get("/api/catalog/tracks")).json()) as Array<{
    slug: string;
    topics: Array<{ id: string; name: string }>;
  }>;
  const track = catalog.find((candidate) => candidate.slug === TRACK_SLUG);
  if (!track || track.topics.length !== 10) {
    throw new Error("The mock exam fixture requires all ten Java Certification topics.");
  }
  const published = await listQuestions(admin, "status=PUBLISHED");
  for (const topic of track.topics) {
    const have = published.filter((question) => question.topicId === topic.id).length;
    for (let index = have; index < QUESTIONS_PER_TOPIC; index += 1) {
      await publishNewQuestion(admin, topic.id, `${MARKER}: ${topic.name} #${index + 1}`);
    }
  }
}

test.describe("the mock exam journey", () => {
  test.beforeAll(async () => {
    const admin = await adminApi();
    try {
      await ensureMockReadyTrack(admin);
    } finally {
      await admin.dispose();
    }
  });

  test("start, flag a question, answer some, leave the rest unanswered, submit, and review a closed mock", async ({
    page,
    isMobile,
  }) => {
    test.setTimeout(60_000);

    await register(page);
    await page.getByRole("link", { name: "Java Certification" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Java Certification" })).toBeVisible();
    await expect(page.getByText("Checking whether this mock can start")).toHaveCount(0);

    const start = page.getByRole("button", { name: "Start 1Z0-830 mock" });
    await expect(start).toBeVisible();
    await start.click();

    await expect(page.getByRole("heading", { level: 1, name: "Mock exam" })).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 2, name: `Question 1 of ${TOTAL_QUESTIONS}` }),
    ).toBeVisible();
    await expect(page.getByText(new RegExp(`0 of ${TOTAL_QUESTIONS} answered`))).toBeVisible();
    await expect(page.getByRole("timer")).toBeVisible();
    if (!isMobile) {
      await expectNoA11yViolations(page);
    }
    await expectReflows(page);

    // Flagging is a learner note to self: it neither answers the question nor reveals anything.
    await page.getByRole("button", { name: "Flag for review" }).click();
    await expect(page.getByRole("button", { name: "Remove review flag" })).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^Question 1,.*flagged for review/ }),
    ).toBeVisible();

    // Two questions answered, deliberately leaving the other forty-eight unanswered — the shape
    // the acceptance criteria describe: "unanswered items count as misses rather than disappearing".
    // Saving an answer auto-advances to the next unanswered question in the same update, so the
    // view never lingers on the one just saved; revisiting it afterwards is its own check below.
    for (let number = 1; number <= 2; number += 1) {
      await expect(
        page.getByRole("heading", { level: 2, name: `Question ${number} of ${TOTAL_QUESTIONS}` }),
      ).toBeVisible();
      await page.getByLabel(/The expected option/).check();
      await page.getByRole("button", { name: "Save answer" }).click();
      await expect(page.getByText(new RegExp(`${number} of ${TOTAL_QUESTIONS} answered`))).toBeVisible();
    }

    // Delayed feedback: nothing on screen or in the markup has said which option is correct yet.
    const inProgressHtml = await page.content();
    expect(inProgressHtml).not.toContain("Expected by the test.");
    expect(inProgressHtml).not.toContain("fixtureVerifiedOutput");

    // Revisiting an answered question through the navigation shows that it was saved, and still
    // without revealing which option was right — the boundary stays in place after navigating back.
    await page.getByRole("button", { name: /^Question 1,/ }).click();
    await expect(
      page.getByText("Answer submitted. Feedback stays hidden until the mock is finished."),
    ).toBeVisible();
    const revisitedHtml = await page.content();
    expect(revisitedHtml).not.toContain("Expected by the test.");

    // Finishing is reachable from any position; it is the irreversible step, not reaching the end.
    await page.getByRole("button", { name: "Finish and score mock" }).click();
    const confirmation = page.getByRole("group", { name: "Submit mock exam" });
    await expect(confirmation).toContainText(
      `${TOTAL_QUESTIONS - 2} unanswered questions will count as incorrect`,
    );
    await confirmation.getByRole("button", { name: "Submit mock exam" }).click();

    await expect(page.getByRole("heading", { level: 1, name: "Mock exam result" })).toBeVisible();
    // The score denominator is the blueprint's full question count, not the answered subset, and
    // the two correct answers (the fixtures' only correct option, picked deliberately) are counted.
    await expect(page.getByText(`2 correct of ${TOTAL_QUESTIONS} questions; 2 answered.`)).toBeVisible();
    await expect(page.getByText("Practice target not reached")).toBeVisible();
    await expect(
      page.getByText(`${TOTAL_QUESTIONS - 2} questions were left unanswered and count as incorrect.`),
    ).toBeVisible();
    const breakdown = page.getByRole("region", { name: "Topic breakdown" });
    await expect(breakdown.locator("tbody tr")).toHaveCount(10);
    if (!isMobile) {
      await expectNoA11yViolations(page);
    }
    await expectReflows(page);

    // The close releases the full answer key for every question, not only the ones answered.
    await expect(page.getByText("Question 1: Correct")).toBeVisible();
    // Scoped to one of this fixture's own questions (by its marked prompt) and to the "Unanswered"
    // entry specifically, rather than a fixed position — other topics may draw from a shared pool
    // with other fixtures, and only this one's own explanation text is known here.
    const unansweredReview = page
      .locator("details")
      .filter({ hasText: MARKER })
      .filter({ hasText: "Unanswered" })
      .first();
    await expect(unansweredReview).toBeVisible();
    await unansweredReview.locator("summary").click();
    await expect(unansweredReview.getByRole("heading", { level: 3, name: "Explanation" })).toBeVisible();
    await expect(unansweredReview.getByText("Test data: the first option is expected.")).toBeVisible();

    // The session that was practised is closed; its own page says so and points at the result.
    const sessionUrl = new URL(page.url()).pathname.replace(/\/result$/, "");
    await page.goto(sessionUrl);
    await expect(
      page.getByText("This mock is closed. The answer key is now available in the result."),
    ).toBeVisible();
    await page.getByRole("link", { name: "View result and review" }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Mock exam result" })).toBeVisible();
  });
});

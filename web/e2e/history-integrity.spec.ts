import { expect, test } from "./test";
import { adminApi, post, publishNewQuestion, registerLearner, replacePublished, type QuestionView } from "./api";
import { expectNoA11yViolations, signIn } from "./helpers";

/** "Packaging, deploying and the Java Platform Module System": not used by the other tests. */
const TOPIC_ID = "a3000000-0000-4000-8000-000000000007";

interface SessionQuestion {
  position: number;
  question: { questionId: string; revisionId: string; revisionNumber: number; prompt: string };
}

test("an answer keeps showing the revision the learner saw after the question is replaced", async ({
  page,
  request,
  isMobile,
}) => {
  test.skip(isMobile, "a data-integrity check; the layout is covered by the other tests");
  const stamp = Date.now();
  const admin = await adminApi();
  await publishNewQuestion(admin, TOPIC_ID, `E2E history question ${stamp}`);

  // A learner answers one question and finishes the session, through the API.
  const learner = await registerLearner(request);
  const started = (await (await post(request, "/api/study/sessions", { topicId: TOPIC_ID, questionCount: 1 })).json()) as {
    id: string;
    questions: SessionQuestion[];
  };
  const seen = started.questions[0]!.question;
  const attempt = await post(
    request,
    `/api/study/sessions/${started.id}/questions/0/attempt`,
    { selectedOptions: ["A"], confidence: "MEDIUM", elapsedMillis: 1500 },
    { "Idempotency-Key": crypto.randomUUID() },
  );
  expect(attempt.ok()).toBe(true);
  await post(request, `/api/study/sessions/${started.id}/complete`);

  // An administrator replaces that question through a new revision.
  const replacedPrompt = `${seen.prompt} (replaced ${stamp})`;
  const after: QuestionView = await replacePublished(admin, seen.questionId, replacedPrompt);
  expect(after.revisions.map((revision) => [revision.number, revision.status])).toEqual([
    [1, "DEPRECATED"],
    [2, "PUBLISHED"],
  ]);

  // The session the learner took still holds the revision it was given...
  const old = (await (await request.get(`/api/study/sessions/${started.id}`)).json()) as { questions: SessionQuestion[] };
  expect(old.questions[0]!.question.revisionId).toBe(seen.revisionId);
  expect(old.questions[0]!.question.prompt).toBe(seen.prompt);

  // ...and so does the history, which says the revision it shows has since been replaced.
  const history = (await (await request.get(`/api/study/history/attempts?sessionId=${started.id}`)).json()) as {
    items: { revisionStatus?: string; question: { prompt: string; revisionNumber: number; revisionStatus: string } }[];
  };
  expect(history.items).toHaveLength(1);
  expect(history.items[0]!.question.prompt).toBe(seen.prompt);
  expect(history.items[0]!.question.revisionNumber).toBe(1);
  expect(history.items[0]!.question.revisionStatus).toBe("DEPRECATED");

  // What the learner sees in the browser is the original wording, never the replacement.
  await signIn(page, learner);
  await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "History" }).click();
  await page.getByRole("row", { name: /Packaging/ }).getByRole("link").first().click();
  await expect(page.getByRole("heading", { level: 1, name: "Session review" })).toBeVisible();
  await expect(page.getByText(seen.prompt, { exact: false }).first()).toBeVisible();
  await expect(page.getByText(`(replaced ${stamp})`)).toHaveCount(0);
  await expectNoA11yViolations(page);

  await admin.dispose();
});

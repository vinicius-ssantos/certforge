import { request, type APIRequestContext } from "@playwright/test";

/**
 * Publishes a small set of clearly labelled fixture questions so a learner session can run.
 *
 * These are not the Java SE 21 content pack. That pack awaits human review and is never published
 * by automation. The fixtures exist only in the throwaway database of an end-to-end run, go through
 * the same editorial workflow a person would (draft, submit, approve, publish), and say so in their
 * text.
 */
export const API_URL = process.env["E2E_API_URL"] ?? "http://localhost:8080";
export const ADMIN_EMAIL = process.env["E2E_ADMIN_EMAIL"] ?? "e2e-admin@example.com";
export const ADMIN_PASSWORD = process.env["E2E_ADMIN_PASSWORD"] ?? "e2e-admin-password-123";

/** The seeded "Handling date, time, text, numeric and boolean values" topic of the Oracle track. */
export const TOPIC_ID = "a3000000-0000-4000-8000-000000000001";
export const TOPIC_NAME = "Date, time, text, numeric and boolean values";
export const FIXTURE_COUNT = 10;
const MARKER = "E2E fixture question";

async function post(api: APIRequestContext, path: string, data?: unknown) {
  const csrf = (await (await api.get("/api/auth/csrf")).json()) as { token: string; headerName: string };
  const response = await api.post(path, {
    headers: { [csrf.headerName]: csrf.token },
    ...(data === undefined ? {} : { data }),
  });
  if (!response.ok()) {
    throw new Error(`POST ${path} failed: ${response.status()} ${await response.text()}`);
  }
  return response;
}

function fixture(number: number) {
  const multiple = number > FIXTURE_COUNT - 2;
  return {
    type: multiple ? "MULTIPLE_CHOICE" : "SINGLE_CHOICE",
    topicId: TOPIC_ID,
    javaRelease: 21,
    difficulty: "EASY",
    difficultyRationale: "A fixture for automated tests; it carries no teaching value.",
    prompt: `${MARKER} ${number}: pick the option the test expects.\n\nThis is test data, not exam content.`,
    explanation: `Fixture ${number}: the expected options are marked correct. This text is test data.`,
    options: [
      { key: "A", text: "The expected option", correct: true, explanation: "Expected by the test." },
      { key: "B", text: multiple ? "Another expected option" : "A wrong option", correct: multiple, explanation: "Fixture option B." },
      { key: "C", text: "A wrong option", correct: false, explanation: "Fixture option C." },
      { key: "D", text: "Another wrong option", correct: false, explanation: "Fixture option D." },
    ],
    references: [{ title: "Java SE 21 documentation", url: "https://docs.oracle.com/en/java/javase/21/" }],
  };
}

export default async function seed() {
  const api = await request.newContext({ baseURL: API_URL });
  try {
    await post(api, "/api/auth/login", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

    const published = (await (await api.get("/api/admin/questions?status=PUBLISHED")).json()) as {
      prompt: string | null;
    }[];
    const have = published.filter((question) => question.prompt?.startsWith(MARKER)).length;
    for (let number = have + 1; number <= FIXTURE_COUNT; number += 1) {
      const created = (await (await post(api, "/api/admin/questions", fixture(number))).json()) as {
        revisions: { id: string }[];
      };
      const revisionId = created.revisions[0]!.id;
      await post(api, `/api/admin/question-revisions/${revisionId}/submit`);
      await post(api, `/api/admin/question-revisions/${revisionId}/approve`, { comment: "E2E fixture" });
      await post(api, `/api/admin/question-revisions/${revisionId}/publish`);
    }
  } finally {
    await api.dispose();
  }
}

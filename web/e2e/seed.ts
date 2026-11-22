import { request } from "@playwright/test";
import { ADMIN_EMAIL, ADMIN_PASSWORD, API_URL, listQuestions, post } from "./api";

/**
 * Publishes a small set of clearly labelled fixture questions so a learner session can run.
 *
 * These are not the Java SE 21 content pack. That pack awaits human review and is never published
 * by automation. The fixtures exist only in the throwaway database of an end-to-end run, go through
 * the same editorial workflow a person would (draft, submit, approve, publish), and say so in their
 * text.
 */

/** The seeded "Handling date, time, text, numeric and boolean values" topic of the Oracle track. */
export const TOPIC_ID = "a3000000-0000-4000-8000-000000000001";
export const TOPIC_NAME = "Date, time, text, numeric and boolean values";
export const FIXTURE_COUNT = 10;
const MARKER = "E2E fixture question";

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
    // The evidence behind the answer, so the privacy checks have something real to catch leaking
    // and the feedback screen has something real to show. The output is a phrase that appears
    // nowhere else, which is what makes a leak identifiable.
    verification: {
      files: [
        {
          path: "Main.java",
          body: [
            "class Main {",
            "  public static void main(String[] args) {",
            '    System.out.println("fixtureVerifiedOutput=A");',
            "  }",
            "}",
          ].join("\n"),
        },
      ],
      output: "fixtureVerifiedOutput=A",
    },
  };
}

export default async function seed() {
  // This suite writes E2E fixtures and objectives. Local runs require an explicit disposable DB.
  const githubActions = process.env["CI"] === "true" && process.env["GITHUB_ACTIONS"] === "true";
  if (!githubActions) {
    const disposable = process.env["CERTFORGE_E2E_DISPOSABLE"] === "1";
    const apiPort = new URL(API_URL).port;
    // 8080 is the persistent release backend, 8085 the clean review backend.
    if (!disposable || !process.env["E2E_API_URL"] || ["8080", "8085"].includes(apiPort)) {
      throw new Error("E2E writes test fixtures: use just e2e-release (separate API :8086), not the persistent release/review API. Explicit disposable opt-in and E2E_API_URL are required.");
    }
  }
  const api = await request.newContext({ baseURL: API_URL });
  try {
    await post(api, "/api/auth/login", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });

    const published = await listQuestions(api, "status=PUBLISHED");
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

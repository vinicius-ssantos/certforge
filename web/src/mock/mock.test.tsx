import { beforeEach, describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { problem } from "../test/fakeServer";
import { javaTrack, renderApp } from "../test/render";

const SESSION_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const TRACK_ID = javaTrack.id;
const TOPIC_ONE = javaTrack.topics[0]!.id;
const TOPIC_TWO = javaTrack.topics[1]!.id;

function question(position: number, topicId: string, type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE") {
  return {
    position,
    topicId,
    answered: false,
    question: {
      questionId: `bbbbbbbb-bbbb-4bbb-8bbb-00000000000${position}`,
      revisionId: `cccccccc-cccc-4ccc-8ccc-00000000000${position}`,
      revisionNumber: 1,
      topicId,
      difficulty: "MEDIUM" as const,
      javaRelease: 21,
      type,
      prompt: position === 0 ? "Which option compiles?" : "Which options are valid?",
      options: [
        { key: "A", text: "First option" },
        { key: "B", text: "Second option" },
        { key: "C", text: "Third option" },
      ],
    },
  };
}

function mockExam(overrides: Record<string, unknown> = {}) {
  return {
    id: SESSION_ID,
    trackId: TRACK_ID,
    status: "IN_PROGRESS",
    questionCount: 2,
    answeredCount: 0,
    passingPercentage: 68,
    createdAt: "2026-10-03T00:00:00Z",
    expiresAt: "2099-10-03T02:00:00Z",
    closedAt: null,
    questions: [
      question(0, TOPIC_ONE, "SINGLE_CHOICE"),
      question(1, TOPIC_TWO, "MULTIPLE_CHOICE"),
    ],
    ...overrides,
  };
}

function answer(correctKey: string) {
  return {
    correctOptions: [correctKey],
    explanation: "The specification makes the first option correct.",
    options: [
      { key: "A", text: "First option", correct: correctKey === "A", explanation: "Explanation A" },
      { key: "B", text: "Second option", correct: correctKey === "B", explanation: "Explanation B" },
      { key: "C", text: "Third option", correct: correctKey === "C", explanation: "Explanation C" },
    ],
    references: [
      {
        title: "Java SE 21 documentation",
        url: "https://docs.oracle.com/en/java/javase/21/docs/api/",
      },
    ],
  };
}

function result() {
  return {
    id: SESSION_ID,
    trackId: TRACK_ID,
    status: "COMPLETED",
    total: 2,
    answered: 1,
    correct: 1,
    percentage: 50,
    passingPercentage: 68,
    passingCorrectCount: 2,
    passed: false,
    elapsedSeconds: 3723,
    topics: [
      { topicId: TOPIC_ONE, total: 1, answered: 1, correct: 1, percentage: 100 },
      { topicId: TOPIC_TWO, total: 1, answered: 0, correct: 0, percentage: 0 },
    ],
    questions: [
      {
        position: 0,
        topicId: TOPIC_ONE,
        question: question(0, TOPIC_ONE, "SINGLE_CHOICE").question,
        selectedOptions: ["A"],
        answered: true,
        correct: true,
        answer: answer("A"),
      },
      {
        position: 1,
        topicId: TOPIC_TWO,
        question: question(1, TOPIC_TWO, "MULTIPLE_CHOICE").question,
        selectedOptions: [],
        answered: false,
        correct: false,
        answer: answer("B"),
      },
    ],
  };
}

beforeEach(() => {
  localStorage.clear();
});

describe("mock exam entry", () => {
  it("starts the certification mock using the track slug", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      {
        "GET /api/catalog/tracks/java-certification": { body: javaTrack },
        "POST /api/study/mock-exams": { status: 201, body: mockExam() },
        [`GET /api/study/mock-exams/${SESSION_ID}`]: { body: mockExam() },
      },
      { path: "/tracks/java-certification" },
    );

    await user.click(await screen.findByRole("button", { name: "Start 1Z0-830 mock" }));

    expect(await screen.findByText("Which option compiles?")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Mock exam" })).toBeInTheDocument();
    const start = fetch.calls.find(
      (call) => call.method === "POST" && call.path === "/api/study/mock-exams",
    );
    expect(start?.body).toEqual({ trackSlug: "java-certification" });
    expect(screen.getByText("0 of 2 answered · Practice target 68%")).toBeInTheDocument();
  });

  it("continues an already-active mock without treating the conflict as a failure", async () => {
    const user = userEvent.setup();
    renderApp(
      {
        "GET /api/catalog/tracks/java-certification": { body: javaTrack },
        "POST /api/study/mock-exams": problem(409, "active_mock_exam_exists", {
          sessionId: SESSION_ID,
        }),
        [`GET /api/study/mock-exams/${SESSION_ID}`]: { body: mockExam() },
      },
      { path: "/tracks/java-certification" },
    );

    await user.click(await screen.findByRole("button", { name: "Start 1Z0-830 mock" }));

    expect(await screen.findByText(/already had this mock in progress/)).toBeInTheDocument();
  });
});

describe("active mock exam", () => {
  it("shows no answer material, persists review flags and has no accessibility violations", async () => {
    const user = userEvent.setup();
    const { container } = renderApp(
      { [`GET /api/study/mock-exams/${SESSION_ID}`]: { body: mockExam() } },
      { path: `/mock-exams/${SESSION_ID}` },
    );

    expect(await screen.findByText("Which option compiles?")).toBeInTheDocument();
    expect(screen.queryByText(/correct answer/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Flag for review" }));
    expect(
      screen.getByRole("button", { name: "Question 1, flagged for review" }),
    ).toBeInTheDocument();
    expect(localStorage.getItem(`certforge.mock.flags.${SESSION_ID}`)).toBe("[0]");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("requires a choice, submits with an idempotency key and advances without revealing correctness", async () => {
    const user = userEvent.setup();
    const responsePath = `/api/study/mock-exams/${SESSION_ID}/questions/0/response`;
    const { fetch } = renderApp(
      {
        [`GET /api/study/mock-exams/${SESSION_ID}`]: { body: mockExam() },
        [`POST ${responsePath}`]: {
          status: 201,
          body: {
            position: 0,
            revisionId: question(0, TOPIC_ONE, "SINGLE_CHOICE").question.revisionId,
            selectedOptions: ["A"],
            submittedAt: "2026-10-03T00:05:00Z",
          },
        },
      },
      { path: `/mock-exams/${SESSION_ID}` },
    );

    await screen.findByText("Which option compiles?");
    await user.click(screen.getByRole("button", { name: "Save answer" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Choose an answer.");

    await user.click(screen.getByRole("radio", { name: /First option/ }));
    await user.click(screen.getByRole("button", { name: "Save answer" }));

    expect(await screen.findByText("Which options are valid?")).toBeInTheDocument();
    const call = fetch.calls.find((entry) => entry.method === "POST" && entry.path === responsePath);
    expect(call?.headers.get("Idempotency-Key")).toMatch(/^[0-9a-f-]{36}$/);
    expect(call?.body).toEqual({ selectedOptions: ["A"] });
    expect(screen.queryByText(/Correct answer/)).not.toBeInTheDocument();
    expect(screen.getByText("1 of 2 answered · Practice target 68%")).toBeInTheDocument();
  });

  it("warns about unanswered questions before finishing", async () => {
    const user = userEvent.setup();
    renderApp(
      {
        [`GET /api/study/mock-exams/${SESSION_ID}`]: { body: mockExam() },
        [`POST /api/study/mock-exams/${SESSION_ID}/finish`]: {
          body: mockExam({ status: "COMPLETED", closedAt: "2026-10-03T01:00:00Z" }),
        },
        [`GET /api/study/mock-exams/${SESSION_ID}/result`]: { body: result() },
        "GET /api/catalog/tracks": { body: [javaTrack] },
      },
      { path: `/mock-exams/${SESSION_ID}` },
    );

    await screen.findByText("Which option compiles?");
    await user.click(screen.getByRole("button", { name: "Finish and score mock" }));

    const confirmation = screen.getByRole("group", { name: "Submit mock exam" });
    expect(confirmation).toHaveTextContent("2 unanswered questions will count as incorrect");
    await user.click(within(confirmation).getByRole("button", { name: "Submit mock exam" }));

    expect(
      await screen.findByRole("heading", { level: 1, name: "Mock exam result" }),
    ).toBeInTheDocument();
  });
});

describe("mock result", () => {
  it("shows score, elapsed time, named topic breakdown and answer evidence", async () => {
    renderApp(
      {
        [`GET /api/study/mock-exams/${SESSION_ID}/result`]: { body: result() },
        "GET /api/catalog/tracks": { body: [javaTrack] },
      },
      { path: `/mock-exams/${SESSION_ID}/result` },
    );

    expect(await screen.findByText("50%")).toBeInTheDocument();
    expect(screen.getByText("Elapsed time: 1h 2m 3s.")).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Handling exceptions" })).toBeInTheDocument();
    expect(screen.getByRole("rowheader", { name: "Managing concurrent code execution" })).toBeInTheDocument();

    await userEvent.setup().click(
      screen.getByText("Question 1: Correct"),
    );
    expect(screen.getAllByText("The specification makes the first option correct.")).toHaveLength(2);
    const referenceLinks = screen.getAllByRole("link", { name: "Java SE 21 documentation" });
    expect(referenceLinks).toHaveLength(2);
    for (const link of referenceLinks) {
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});

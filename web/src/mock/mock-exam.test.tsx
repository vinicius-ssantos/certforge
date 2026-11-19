import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { javaTrack, renderApp } from "../test/render";

const MOCK_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const TOPIC = javaTrack.topics[0]!.id;

function question(position: number) {
  return {
    position,
    topicId: TOPIC,
    answered: false,
    question: {
      questionId: `bbbbbbbb-bbbb-4bbb-8bbb-00000000000${position}`,
      revisionId: `cccccccc-cccc-4ccc-8ccc-00000000000${position}`,
      revisionNumber: 1,
      type: "SINGLE_CHOICE" as const,
      topicId: TOPIC,
      javaRelease: 21,
      difficulty: "MEDIUM" as const,
      prompt: `Mock question ${position + 1}?`,
      options: [
        { key: "A", text: "First option" },
        { key: "B", text: "Second option" },
      ],
    },
  };
}

function mock(overrides: Record<string, unknown> = {}) {
  return {
    id: MOCK_ID,
    trackId: javaTrack.id,
    status: "IN_PROGRESS",
    questionCount: 2,
    passingPercentage: 68,
    answeredCount: 0,
    createdAt: "2099-10-03T02:00:00Z",
    expiresAt: "2099-10-03T04:00:00Z",
    closedAt: null,
    questions: [question(0), question(1)],
    ...overrides,
  };
}

function result() {
  return {
    id: MOCK_ID,
    trackId: javaTrack.id,
    status: "COMPLETED",
    total: 2,
    answered: 1,
    correct: 1,
    percentage: 50,
    passingPercentage: 68,
    passingCorrectCount: 2,
    passed: false,
    elapsedSeconds: 600,
    topics: [{ topicId: TOPIC, total: 2, answered: 1, correct: 1, percentage: 50 }],
    questions: [
      {
        position: 0,
        topicId: TOPIC,
        answered: true,
        correct: true,
        selectedOptions: ["A"],
        question: question(0).question,
        answer: {
          correctOptions: ["A"],
          explanation: "A is correct because the specification says so.",
          options: [
            { key: "A", text: "First option", correct: true, explanation: "Correct." },
            { key: "B", text: "Second option", correct: false, explanation: "Incorrect." },
          ],
          references: [{ title: "Java SE 21 specification", url: "https://docs.oracle.com/javase/specs/jls/se21/html/" }],
          verification: {
            files: [{ path: "Main.java", body: 'class Main { public static void main(String[] args) { System.out.println(42); } }' }],
            output: "proof-recorded-result",
          },
        },
      },
      {
        position: 1,
        topicId: TOPIC,
        answered: false,
        correct: false,
        selectedOptions: [],
        question: question(1).question,
        answer: {
          correctOptions: ["B"],
          explanation: "B is correct.",
          options: [
            { key: "A", text: "First option", correct: false, explanation: "Incorrect." },
            { key: "B", text: "Second option", correct: true, explanation: "Correct." },
          ],
          references: [],
          verification: null,
        },
      },
    ],
  };
}

describe("mock exam flow", () => {
  it("starts the certification mock from the track page", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      {
        "GET /api/catalog/tracks/java-certification": { body: javaTrack },
        "GET /api/study/mock-exams/availability": {
          body: {
            activeSessionId: null,
            contentReady: true,
            missingQuestionCount: 0,
            questionCount: 50,
            questionsPerTopic: 5,
            topics: javaTrack.topics.map((topic) => ({
              topicId: topic.id,
              required: 5,
              available: 5,
              missing: 0,
            })),
          },
        },
        "POST /api/study/mock-exams": { status: 201, body: mock() },
        [`GET /api/study/mock-exams/${MOCK_ID}`]: { body: mock() },
      },
      { path: "/tracks/java-certification" },
    );

    await user.click(await screen.findByRole("button", { name: "Start 1Z0-830 mock" }));

    // Wait for the loaded page, not the loading one. The heading is rendered separately in each
    // branch of MockExamPage, so the node found while the query is pending is a different element
    // from the one that ends up on screen, and asserting on it fails once the data arrives.
    expect(await screen.findByText("Mock question 1?")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Mock exam" })).toBeInTheDocument();
    const call = fetch.calls.find((entry) => entry.method === "POST" && entry.path === "/api/study/mock-exams");
    expect(call?.body).toEqual({ trackSlug: "java-certification" });
  });

  it("keeps answer material hidden while active and saves an answer with an idempotency key", async () => {
    const user = userEvent.setup();
    const responsePath = `/api/study/mock-exams/${MOCK_ID}/questions/0/response`;
    const { fetch, container } = renderApp(
      {
        [`GET /api/study/mock-exams/${MOCK_ID}`]: { body: mock() },
        [`POST ${responsePath}`]: {
          status: 201,
          body: {
            position: 0,
            revisionId: question(0).question.revisionId,
            selectedOptions: ["A"],
            submittedAt: "2099-10-03T02:01:00Z",
          },
        },
      },
      { path: `/mock-exams/${MOCK_ID}` },
    );

    expect(await screen.findByText("Mock question 1?")).toBeInTheDocument();
    expect(screen.queryByText(/correct answer/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/explanation/i)).not.toBeInTheDocument();
    expect(screen.queryByText("proof-recorded-result")).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "What the build ran, and what it printed" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: /First option/ }));
    await user.click(screen.getByRole("button", { name: "Save answer" }));

    expect(await screen.findByText("Mock question 2?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Question 1, answered" })).toBeInTheDocument();
    expect(screen.queryByText(/correct answer/i)).not.toBeInTheDocument();
    const call = fetch.calls.find((entry) => entry.path === responsePath);
    expect(call?.headers.get("Idempotency-Key")).toMatch(/^[0-9a-f-]{36}$/);
    expect(call?.body).toEqual({ selectedOptions: ["A"] });
    expect(await axe(container)).toHaveNoViolations();
  });

  it("retains unsaved selections across questions and a tab reload", async () => {
    const user = userEvent.setup();
    const path = `/mock-exams/${MOCK_ID}`;
    const routes = { [`GET /api/study/mock-exams/${MOCK_ID}`]: { body: mock() } };
    const first = renderApp(routes, { path });
    await user.click(await screen.findByRole("radio", { name: /First option/ }));
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByRole("heading", { name: "Question 2 of 2" })).toHaveFocus();
    await user.click(screen.getByRole("button", { name: "Previous" }));
    expect(screen.getByRole("radio", { name: /First option/ })).toBeChecked();
    first.rendered.unmount();

    const second = renderApp(routes, { path });
    expect(await screen.findByRole("radio", { name: /First option/ })).toBeChecked();
    second.rendered.unmount();
    renderApp({
      [`GET /api/study/mock-exams/${MOCK_ID}`]: { body: mock({ status: "EXPIRED" }) },
    }, { path });
    await screen.findByRole("link", { name: /result/i });
    expect(sessionStorage.getItem(`certforge.mock.drafts.${MOCK_ID}`)).toBeNull();
  });

  it("shows scoring and answer review only on the terminal result page", async () => {
    renderApp(
      {
        "GET /api/catalog/tracks": { body: [javaTrack] },
        [`GET /api/study/mock-exams/${MOCK_ID}/result`]: { body: result() },
      },
      { path: `/mock-exams/${MOCK_ID}/result` },
    );

    expect(await screen.findByRole("heading", { name: "Practice target not reached" })).toBeInTheDocument();
    expect(screen.getAllByText("50%")).toHaveLength(2);
    expect(screen.getByRole("row", { name: /Handling exceptions/ })).toBeInTheDocument();
    // Closed <details> elements remain in the DOM but are not visible to the learner.
    expect(screen.getByText("proof-recorded-result")).not.toBeVisible();
    await userEvent.setup().click(screen.getByText(/Question 1: Correct/));
    expect(screen.getByText("proof-recorded-result")).toBeInTheDocument();
    expect(screen.getByText("Main.java")).toBeInTheDocument();
    expect(screen.getByText("A is correct because the specification says so.")).toBeInTheDocument();
    expect(screen.getByText(/Your answer\. Correct answer\./)).toBeInTheDocument();
    const filter = screen.getByRole("combobox", { name: "Filter question results" });
    await userEvent.setup().selectOptions(filter, "unanswered");
    expect(screen.queryByText(/Question 1: Correct/)).not.toBeInTheDocument();
    expect(screen.getByText(/Question 2: Unanswered/)).toBeVisible();
    await userEvent.setup().click(screen.getByText(/Question 2: Unanswered/));
    expect(screen.queryByRole("region", { name: "What the build ran, and what it printed" }))
      .not.toBeInTheDocument();
  });

  it("uses unique, accessible headings for multiple terminal verification panels", async () => {
    const completed = result();
    completed.questions[1]!.answer.verification = completed.questions[0]!.answer.verification;
    renderApp(
      {
        "GET /api/catalog/tracks": { body: [javaTrack] },
        [`GET /api/study/mock-exams/${MOCK_ID}/result`]: { body: completed },
      },
      { path: `/mock-exams/${MOCK_ID}/result` },
    );

    expect(await screen.findByRole("heading", { name: "Practice target not reached" })).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(screen.getByText(/Question 1: Correct/));
    await user.click(screen.getByText(/Question 2: Unanswered/));

    const panels = screen.getAllByRole("region", { name: "What the build ran, and what it printed" });
    expect(panels).toHaveLength(2);
    const ids = panels.map((panel) => panel.getAttribute("aria-labelledby"));
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(2);
    for (const [index, panel] of panels.entries()) {
      expect(panel.querySelector("h3")?.id).toBe(ids[index]);
      expect(panel.querySelector('pre[tabindex="0"]')).toBeInTheDocument();
    }
  });
});

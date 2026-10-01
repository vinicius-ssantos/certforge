import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { problem } from "../test/fakeServer";
import { javaTrack, renderApp } from "../test/render";

const SESSION_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const TOPIC_ID = javaTrack.topics[0]!.id;

function question(position: number, type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE", prompt: string) {
  return {
    answered: false,
    position,
    question: {
      questionId: `bbbbbbbb-bbbb-4bbb-8bbb-00000000000${position}`,
      revisionId: `cccccccc-cccc-4ccc-8ccc-00000000000${position}`,
      revisionNumber: 1,
      topicId: TOPIC_ID,
      difficulty: "MEDIUM" as const,
      javaRelease: 21,
      type,
      prompt,
      options: [
        { key: "A", text: "First option" },
        { key: "B", text: "Second option" },
        { key: "C", text: "Third option" },
      ],
    },
  };
}

function session(overrides: Record<string, unknown> = {}) {
  return {
    id: SESSION_ID,
    topicId: TOPIC_ID,
    status: "IN_PROGRESS",
    requestedCount: 2,
    createdAt: "2026-09-30T10:00:00Z",
    expiresAt: "2026-09-30T14:00:00Z",
    closedAt: null,
    questions: [
      question(1, "SINGLE_CHOICE", "Which option compiles?"),
      question(2, "MULTIPLE_CHOICE", "Which options are checked exceptions?"),
    ],
    ...overrides,
  };
}

function result(position: number, correct: boolean, selected: string[]) {
  return {
    position,
    correct,
    confidence: "MEDIUM",
    elapsedMillis: 1200,
    revisionId: `cccccccc-cccc-4ccc-8ccc-00000000000${position}`,
    selectedOptions: selected,
    submittedAt: "2026-09-30T10:05:00Z",
    answer: {
      correctOptions: ["A"],
      explanation: "Because the first option is the only valid one.",
      options: [
        { key: "A", text: "First option", correct: true, explanation: "This one compiles." },
        { key: "B", text: "Second option", correct: false, explanation: "Missing a semicolon." },
        { key: "C", text: "Third option", correct: false, explanation: "" },
      ],
      references: [{ title: "JLS chapter 14", url: "https://docs.oracle.com/javase/specs/jls/se21/html/jls-14.html" }],
    },
  };
}

const ATTEMPT = `/api/study/sessions/${SESSION_ID}/questions/1/attempt`;

describe("starting a practice session", () => {
  it("starts a session for the chosen topic and shows the first question", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      {
        "GET /api/catalog/tracks/java-certification": { body: javaTrack },
        "POST /api/study/sessions": { status: 201, body: session() },
        [`GET /api/study/sessions/${SESSION_ID}`]: { body: session() },
      },
      { path: "/tracks/java-certification" },
    );

    await user.click(await screen.findByRole("button", { name: "Practice Handling exceptions" }));

    const heading = await screen.findByRole("heading", { level: 2, name: "Question 1 of 2" });
    expect(heading).toHaveFocus();
    const start = fetch.calls.find((call) => call.method === "POST" && call.path === "/api/study/sessions");
    expect(start?.body).toEqual({ topicId: TOPIC_ID });
    expect(start?.headers.get("X-XSRF-TOKEN")).toBe("test-csrf-token");
    expect(screen.getByText("Which option compiles?")).toBeInTheDocument();
  });

  it("continues the session already in progress for that topic", async () => {
    const user = userEvent.setup();
    renderApp(
      {
        "GET /api/catalog/tracks/java-certification": { body: javaTrack },
        "POST /api/study/sessions": problem(409, "active_session_exists", { sessionId: SESSION_ID }),
        [`GET /api/study/sessions/${SESSION_ID}`]: { body: session() },
      },
      { path: "/tracks/java-certification" },
    );

    await user.click(await screen.findByRole("button", { name: "Practice Handling exceptions" }));

    expect(await screen.findByRole("heading", { level: 2, name: "Question 1 of 2" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("continuing it");
  });

  it("explains when a topic has too few published questions", async () => {
    const user = userEvent.setup();
    renderApp(
      {
        "GET /api/catalog/tracks/java-certification": { body: javaTrack },
        "POST /api/study/sessions": problem(409, "insufficient_content", { requested: 10, available: 3 }),
      },
      { path: "/tracks/java-certification" },
    );

    await user.click(await screen.findByRole("button", { name: "Practice Handling exceptions" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("not enough published questions");
  });
});

describe("answering questions", () => {
  async function openSession(extra: Record<string, never | object> = {}) {
    const rendered = renderApp(
      { [`GET /api/study/sessions/${SESSION_ID}`]: { body: session() }, ...extra },
      { path: `/sessions/${SESSION_ID}` },
    );
    await screen.findByRole("heading", { level: 2, name: "Question 1 of 2" });
    return rendered;
  }

  it("shows a question without any answer data and has no accessibility violations", async () => {
    const { container, fetch } = await openSession();

    expect(screen.getByRole("group", { name: "Choose one answer" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio", { name: /option/i })).toHaveLength(3);
    expect(screen.getByRole("group", { name: "How confident are you?" })).toBeInTheDocument();
    expect(screen.queryByText(/correct answer/i)).not.toBeInTheDocument();
    expect(fetch.calls.some((call) => call.path.endsWith("/attempt"))).toBe(false);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("asks for an answer and a confidence level before sending anything", async () => {
    const user = userEvent.setup();
    const { fetch } = await openSession();

    await user.click(screen.getByRole("button", { name: "Submit answer" }));

    const summary = await screen.findByRole("alert");
    expect(summary).toHaveFocus();
    expect(summary).toHaveTextContent("Choose an answer.");
    expect(summary).toHaveTextContent("Say how confident you are.");
    expect(fetch.calls.some((call) => call.path.endsWith("/attempt"))).toBe(false);
  });

  it("submits with an idempotency key, then shows the result and moves focus to it", async () => {
    const user = userEvent.setup();
    const { fetch, container } = await openSession({
      [`POST ${ATTEMPT}`]: { body: result(1, true, ["A"]) },
    });

    await user.click(screen.getByRole("radio", { name: /First option/ }));
    await user.click(screen.getByRole("radio", { name: /Medium/ }));
    await user.click(screen.getByRole("button", { name: "Submit answer" }));

    const heading = await screen.findByRole("heading", { level: 2, name: "Correct" });
    expect(heading).toHaveFocus();
    const call = fetch.calls.find((entry) => entry.method === "POST" && entry.path === ATTEMPT);
    expect(call?.headers.get("Idempotency-Key")).toMatch(/^[0-9a-f-]{36}$/);
    expect(call?.body).toMatchObject({ selectedOptions: ["A"], confidence: "MEDIUM" });
    expect(screen.getByText("Because the first option is the only valid one.")).toBeInTheDocument();
    expect(screen.getByText(/Your answer\. Correct answer\./)).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /JLS chapter 14/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("says so in words when the answer was wrong", async () => {
    const user = userEvent.setup();
    await openSession({ [`POST ${ATTEMPT}`]: { body: result(1, false, ["B"]) } });

    await user.click(screen.getByRole("radio", { name: /Second option/ }));
    await user.click(screen.getByRole("radio", { name: /Low/ }));
    await user.click(screen.getByRole("button", { name: "Submit answer" }));

    expect(await screen.findByRole("heading", { level: 2, name: "Not quite" })).toBeInTheDocument();
    expect(screen.getByText(/Your answer\. Incorrect answer\./)).toBeInTheDocument();
  });

  it("moves to the next question with focus on its heading, and allows several answers when asked", async () => {
    const user = userEvent.setup();
    await openSession({ [`POST ${ATTEMPT}`]: { body: result(1, true, ["A"]) } });
    await user.click(screen.getByRole("radio", { name: /First option/ }));
    await user.click(screen.getByRole("radio", { name: /High/ }));
    await user.click(screen.getByRole("button", { name: "Submit answer" }));

    await user.click(await screen.findByRole("button", { name: "Next question" }));

    const heading = await screen.findByRole("heading", { level: 2, name: "Question 2 of 2" });
    expect(heading).toHaveFocus();
    expect(screen.getByRole("group", { name: "Choose all the correct answers" })).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
    expect(screen.getByText("1 of 2 questions answered")).toBeInTheDocument();
  });

  it("keeps the same idempotency key when the learner retries after a failure", async () => {
    const user = userEvent.setup();
    let attempts = 0;
    const { fetch } = await openSession({
      [`POST ${ATTEMPT}`]: () => (++attempts === 1 ? problem(500, "internal_error") : { body: result(1, true, ["A"]) }),
    });
    await user.click(screen.getByRole("radio", { name: /First option/ }));
    await user.click(screen.getByRole("radio", { name: /Medium/ }));
    await user.click(screen.getByRole("button", { name: "Submit answer" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Something went wrong on our side");
    expect(screen.getByRole("radio", { name: /First option/ })).toBeChecked();
    await user.click(screen.getByRole("button", { name: "Submit answer" }));

    expect(await screen.findByRole("heading", { level: 2, name: "Correct" })).toBeInTheDocument();
    const keys = fetch.calls
      .filter((entry) => entry.method === "POST" && entry.path === ATTEMPT)
      .map((entry) => entry.headers.get("Idempotency-Key"));
    expect(keys).toHaveLength(2);
    expect(keys[0]).toBe(keys[1]);
  });
});

describe("finishing", () => {
  it("finishes after the last answer and reports how it went", async () => {
    const user = userEvent.setup();
    const answeredFirst = session({
      questions: [
        { ...question(1, "SINGLE_CHOICE", "Which option compiles?"), answered: true },
        question(2, "SINGLE_CHOICE", "Second one?"),
      ],
    });
    const lastAttempt = `/api/study/sessions/${SESSION_ID}/questions/2/attempt`;
    renderApp(
      {
        [`GET /api/study/sessions/${SESSION_ID}`]: { body: answeredFirst },
        [`POST ${lastAttempt}`]: { body: result(2, true, ["A"]) },
        [`POST /api/study/sessions/${SESSION_ID}/complete`]: {
          body: {
            ...answeredFirst,
            status: "COMPLETED",
            closedAt: "2026-09-30T10:09:00Z",
            questions: answeredFirst.questions.map((entry) => ({ ...entry, answered: true })),
          },
        },
        "GET /api/study/history/attempts": { body: { items: [{ correct: true }, { correct: false }], nextCursor: null } },
      },
      { path: `/sessions/${SESSION_ID}` },
    );

    await screen.findByRole("heading", { level: 2, name: "Question 2 of 2" });
    await user.click(screen.getByRole("radio", { name: /First option/ }));
    await user.click(screen.getByRole("radio", { name: /Medium/ }));
    await user.click(screen.getByRole("button", { name: "Submit answer" }));
    await user.click(await screen.findByRole("button", { name: "Finish session" }));

    const heading = await screen.findByRole("heading", { level: 2, name: "Session finished" });
    expect(heading).toHaveFocus();
    expect(await screen.findByText("1 of 2 answers were correct.")).toBeInTheDocument();
    expect(screen.getByText("You answered 2 of 2 questions.")).toBeInTheDocument();
  });

  it("asks before ending a session early", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      {
        [`GET /api/study/sessions/${SESSION_ID}`]: { body: session() },
        [`POST /api/study/sessions/${SESSION_ID}/abandon`]: { body: session({ status: "ABANDONED" }) },
        "GET /api/study/history/attempts": { body: { items: [], nextCursor: null } },
      },
      { path: `/sessions/${SESSION_ID}` },
    );
    await screen.findByRole("heading", { level: 2, name: "Question 1 of 2" });

    await user.click(screen.getByRole("button", { name: "End session without finishing" }));
    const group = screen.getByRole("group", { name: "Confirm ending the session" });
    expect(fetch.calls.some((call) => call.path.endsWith("/abandon"))).toBe(false);
    await user.click(within(group).getByRole("button", { name: "Yes, end the session" }));

    expect(await screen.findByRole("heading", { level: 2, name: "Session ended" })).toBeInTheDocument();
  });
});

describe("a session that is no longer open", () => {
  it("explains an expired session", async () => {
    renderApp(
      { [`GET /api/study/sessions/${SESSION_ID}`]: { body: session({ status: "EXPIRED" }) },
        "GET /api/study/history/attempts": { body: { items: [], nextCursor: null } } },
      { path: `/sessions/${SESSION_ID}` },
    );

    const heading = await screen.findByRole("heading", { level: 2, name: "This session expired" });
    expect(heading).toHaveFocus();
    expect(screen.getByRole("link", { name: "Back to all tracks" })).toHaveAttribute("href", "/");
  });

  it("reloads the session when submitting finds it expired", async () => {
    const user = userEvent.setup();
    let expired = false;
    renderApp(
      {
        [`GET /api/study/sessions/${SESSION_ID}`]: () => ({ body: session(expired ? { status: "EXPIRED" } : {}) }),
        [`POST ${ATTEMPT}`]: () => {
          expired = true;
          return problem(409, "session_expired");
        },
        "GET /api/study/history/attempts": { body: { items: [], nextCursor: null } },
      },
      { path: `/sessions/${SESSION_ID}` },
    );
    await screen.findByRole("heading", { level: 2, name: "Question 1 of 2" });
    await user.click(screen.getByRole("radio", { name: /First option/ }));
    await user.click(screen.getByRole("radio", { name: /Medium/ }));
    await user.click(screen.getByRole("button", { name: "Submit answer" }));

    expect(await screen.findByRole("heading", { level: 2, name: "This session expired" })).toBeInTheDocument();
  });

  it("shows a session that cannot be found", async () => {
    renderApp(
      { [`GET /api/study/sessions/${SESSION_ID}`]: problem(404, "session_not_found") },
      { path: `/sessions/${SESSION_ID}` },
    );

    expect(await screen.findByRole("alert")).toHaveTextContent("does not exist");
  });
});

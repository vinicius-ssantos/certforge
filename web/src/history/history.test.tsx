import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { problem } from "../test/fakeServer";
import { javaTrack, renderApp } from "../test/render";

const TOPIC_ID = javaTrack.topics[0]!.id;

function sessionItem(id: string, overrides: Record<string, unknown> = {}) {
  return {
    id,
    topicId: TOPIC_ID,
    status: "COMPLETED",
    requestedCount: 10,
    answeredCount: 10,
    correctCount: 7,
    createdAt: "2026-09-30T10:00:00Z",
    closedAt: "2026-09-30T10:20:00Z",
    ...overrides,
  };
}

const tracks = { "GET /api/catalog/tracks": { body: [javaTrack] } };

describe("history", () => {
  it("lists sessions with topic names, results and a link to review each", async () => {
    const { container } = renderApp(
      {
        ...tracks,
        "GET /api/study/history/sessions": {
          body: {
            items: [
              sessionItem("s1"),
              sessionItem("s2", { status: "IN_PROGRESS", answeredCount: 2, correctCount: 1, closedAt: null }),
            ],
            nextCursor: null,
          },
        },
      },
      { path: "/history" },
    );

    const table = await screen.findByRole("table", { name: "Your practice sessions, newest first" });
    const rows = within(table).getAllByRole("row");
    expect(rows).toHaveLength(3);
    expect(within(rows[1]!).getByRole("link", { name: /Handling exceptions/ })).toHaveAttribute(
      "href",
      "/history/sessions/s1",
    );
    expect(rows[1]).toHaveTextContent("Completed");
    expect(rows[1]).toHaveTextContent("10 of 10");
    expect(within(rows[2]!).getByRole("link", { name: /Handling exceptions/ })).toHaveAttribute(
      "href",
      "/sessions/s2",
    );
    expect(rows[2]).toHaveTextContent("In progress");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("loads further pages with the cursor when asked", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      {
        ...tracks,
        "GET /api/study/history/sessions": (request) =>
          request.query.get("cursor") === "next-page"
            ? { body: { items: [sessionItem("s2")], nextCursor: null } }
            : { body: { items: [sessionItem("s1")], nextCursor: "next-page" } },
      },
      { path: "/history" },
    );

    await user.click(await screen.findByRole("button", { name: "Load more sessions" }));

    await within(await screen.findByRole("table")).findAllByRole("link");
    expect(screen.getAllByRole("row")).toHaveLength(3);
    expect(screen.queryByRole("button", { name: "Load more sessions" })).not.toBeInTheDocument();
    expect(fetch.calls.filter((call) => call.path === "/api/study/history/sessions")).toHaveLength(2);
  });

  it("says so when there is nothing yet", async () => {
    renderApp(
      { ...tracks, "GET /api/study/history/sessions": { body: { items: [], nextCursor: null } } },
      { path: "/history" },
    );

    expect(await screen.findByRole("heading", { name: "No practice sessions yet" })).toBeInTheDocument();
  });

  it("shows a failure and retries", async () => {
    const user = userEvent.setup();
    let calls = 0;
    renderApp(
      {
        ...tracks,
        "GET /api/study/history/sessions": () =>
          ++calls === 1 ? problem(500, "internal_error") : { body: { items: [sessionItem("s1")], nextCursor: null } },
      },
      { path: "/history" },
    );

    await user.click(within(await screen.findByRole("alert")).getByRole("button", { name: "Try again" }));

    expect(await screen.findByRole("table")).toBeInTheDocument();
  });
});

describe("session review", () => {
  const attempt = {
    id: "a1",
    sessionId: "s1",
    topicId: TOPIC_ID,
    position: 0,
    correct: false,
    confidence: "HIGH",
    elapsedMillis: 4000,
    selectedOptions: ["B"],
    submittedAt: "2026-09-30T10:05:00Z",
    question: {
      revisionId: "r1",
      revisionNumber: 1,
      revisionStatus: "PUBLISHED",
      type: "SINGLE_CHOICE",
      prompt: "Which option compiles?",
      explanation: "Only the first one is valid Java.",
      options: [
        { key: "A", text: "First option", correct: true, explanation: "Valid." },
        { key: "B", text: "Second option", correct: false, explanation: "" },
      ],
      references: [{ title: "JLS", url: "https://docs.oracle.com/javase/specs/" }],
    },
  };

  it("shows each answer with the correct one and the explanation on request", async () => {
    const user = userEvent.setup();
    const { fetch, container } = renderApp(
      { "GET /api/study/history/attempts": { body: { items: [attempt], nextCursor: null } } },
      { path: "/history/sessions/s1" },
    );

    expect(await screen.findByRole("heading", { level: 2, name: "Question 1: incorrect" })).toBeInTheDocument();
    expect(screen.getByText(/Your answer: B\. Confidence: high/)).toBeInTheDocument();
    expect(fetch.calls[fetch.calls.length - 1]?.query.get("sessionId")).toBe("s1");
    await user.click(screen.getByText("Show the correct answer and explanation"));
    expect(screen.getByText("Only the first one is valid Java.")).toBeVisible();
    expect(screen.getByRole("link", { name: /JLS/ })).toHaveAttribute("rel", "noopener noreferrer");
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("progress", () => {
  it("shows evidence per topic, without inventing a grade", async () => {
    const { container } = renderApp(
      {
        "GET /api/progress/topics": {
          body: [
            {
              topicId: TOPIC_ID,
              topicName: "Handling exceptions",
              trackSlug: "java-certification",
              attempted: 8,
              correct: 6,
              incorrect: 2,
              accuracy: 0.75,
              lastActivityAt: "2026-09-30T10:05:00Z",
            },
            {
              topicId: "other",
              topicName: null,
              trackSlug: null,
              attempted: 0,
              correct: 0,
              incorrect: 0,
              accuracy: null,
              lastActivityAt: null,
            },
          ],
        },
      },
      { path: "/progress" },
    );

    const table = await screen.findByRole("table", { name: "Your progress by topic" });
    const rows = within(table).getAllByRole("row");
    expect(within(rows[1]!).getByRole("link", { name: "Handling exceptions" })).toHaveAttribute(
      "href",
      "/tracks/java-certification",
    );
    expect(rows[1]).toHaveTextContent("75%");
    expect(rows[2]).toHaveTextContent("–");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("explains an empty state", async () => {
    renderApp({ "GET /api/progress/topics": { body: [] } }, { path: "/progress" });

    expect(await screen.findByRole("heading", { name: "No progress yet" })).toBeInTheDocument();
  });
});

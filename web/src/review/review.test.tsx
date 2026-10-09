import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { problem } from "../test/fakeServer";
import { renderApp } from "../test/render";
import { reasonExplanation, reasonLabel, reasonTone } from "./reasons";
import { en } from "../i18n/en";
import { ptBR } from "../i18n/pt-BR";

const TOPIC = "a3000000-0000-4000-8000-000000000001";
const OTHER_TOPIC = "a3000000-0000-4000-8000-000000000002";

function item(overrides: Record<string, unknown> = {}) {
  return {
    questionId: "q1",
    revisionId: "r1",
    topicId: TOPIC,
    topicName: "Working with Java data types",
    prompt: "What does this print?",
    reason: "WRONG_WHILE_CONFIDENT",
    lastAttemptedAt: "2026-10-01T12:00:00Z",
    timesAttempted: 2,
    timesWrong: 2,
    lastAnswerCorrect: false,
    ...overrides,
  };
}

function queue(overrides: Record<string, unknown> = {}) {
  return { items: [], dueNow: 0, waiting: 0, neverAttempted: 0, ...overrides };
}

const at = { path: "/review" };

describe("review reason presentation", () => {
  it("keeps every current reason named and distinguishes its tone", () => {
    expect(reasonTone("WRONG_WHILE_CONFIDENT")).toBe("pill-stop");
    expect(reasonTone("WRONG")).toBe("pill-stop");
    expect(reasonTone("RIGHT_BUT_UNSURE")).toBe("pill-hold");
    expect(reasonTone("DUE_FOR_RECALL")).toBe("pill-hold");
    expect(reasonLabel("WRONG_WHILE_CONFIDENT", en)).toBeTruthy();
    expect(reasonLabel("WRONG_WHILE_CONFIDENT", ptBR)).toBeTruthy();
  });

  it("shows readable neutral fallback in both languages for future API reasons", () => {
    const unknown = "FUTURE_REASON" as Parameters<typeof reasonTone>[0];
    expect(reasonTone(unknown)).toBe("pill-new");
    expect(reasonLabel(unknown, en)).toBe(en.review.unknownReason);
    expect(reasonLabel(unknown, ptBR)).toBe(ptBR.review.unknownReason);
    expect(reasonExplanation(unknown, en)).toBe(en.review.unknownReasonExplanation);
    expect(reasonExplanation(unknown, ptBR)).toBe(ptBR.review.unknownReasonExplanation);
  });
});

describe("the review queue", () => {
  it("says why each question is there, in words rather than a code", async () => {
    const { container } = renderApp(
      {
        "GET /api/review/queue": {
          body: queue({
            items: [
              item(),
              item({ questionId: "q2", revisionId: "r2", reason: "RIGHT_BUT_UNSURE" }),
            ],
            dueNow: 2,
          }),
        },
      },
      at,
    );

    expect(await screen.findByText("Wrong, and you were sure")).toBeInTheDocument();
    expect(screen.getByText("Right, but unsure")).toBeInTheDocument();
    // The code itself never reaches the learner.
    expect(screen.queryByText(/WRONG_WHILE_CONFIDENT/)).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("explains why being wrong while confident is worth the most attention", async () => {
    renderApp(
      { "GET /api/review/queue": { body: queue({ items: [item()], dueNow: 1 }) } },
      at,
    );

    expect(
      await screen.findByText(/nothing has told you to look again/),
    ).toBeInTheDocument();
  });

  it("keeps the order the server sent, because the reason is the answer", async () => {
    renderApp(
      {
        "GET /api/review/queue": {
          body: queue({
            items: [
              item({ prompt: "First by reason" }),
              item({ questionId: "q2", revisionId: "r2", reason: "WRONG", prompt: "Second" }),
              item({
                questionId: "q3",
                revisionId: "r3",
                reason: "DUE_FOR_RECALL",
                prompt: "Third",
              }),
            ],
            dueNow: 3,
          }),
        },
      },
      at,
    );

    const items = await screen.findAllByRole("listitem");
    expect(items[0]).toHaveTextContent("First by reason");
    expect(items[1]).toHaveTextContent("Second");
    expect(items[2]).toHaveTextContent("Third");
  });

  it("practises exactly the questions due in one topic", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      {
        "GET /api/review/queue": {
          body: queue({
            items: [
              item(),
              item({ questionId: "q2", revisionId: "r2", reason: "WRONG" }),
              item({
                questionId: "q3",
                revisionId: "r3",
                topicId: OTHER_TOPIC,
                topicName: "Controlling program flow",
                reason: "WRONG",
              }),
            ],
            dueNow: 3,
          }),
        },
        "POST /api/study/sessions": { status: 201, body: { id: "session-1" } },
      },
      at,
    );

    await user.click(
      await screen.findByRole("button", {
        name: /Practise 2 questions in Working with Java data types/,
      }),
    );

    await waitFor(() => {
      const call = fetch.calls.find((entry) => entry.path === "/api/study/sessions");
      // Only this topic's questions, and not the one belonging to another topic.
      expect(call?.body).toEqual({ topicId: TOPIC, revisionIds: ["r1", "r2"] });
    });
  });

  it("distinguishes nothing due yet from nothing attempted yet", async () => {
    renderApp({ "GET /api/review/queue": { body: queue({ waiting: 3 }) } }, at);

    expect(await screen.findByRole("heading", { name: "Nothing is due yet" })).toBeInTheDocument();
    expect(screen.getByText(/3 questions correctly and confidently/)).toBeInTheDocument();
  });

  it("points a learner who has attempted nothing at the tracks", async () => {
    renderApp({ "GET /api/review/queue": { body: queue() } }, at);

    expect(await screen.findByRole("heading", { name: "Nothing here yet" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "tracks page" })).toBeInTheDocument();
  });

  it("says when there are questions never attempted rather than calling it empty", async () => {
    renderApp({ "GET /api/review/queue": { body: queue({ neverAttempted: 7 }) } }, at);

    expect(
      await screen.findByRole("heading", { name: "Nothing to review yet" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/7 questions in the topics you have studied/)).toBeInTheDocument();
  });

  it("continues an existing session instead of failing when one is open", async () => {
    const user = userEvent.setup();
    renderApp(
      {
        "GET /api/review/queue": { body: queue({ items: [item()], dueNow: 1 }) },
        "POST /api/study/sessions": {
          status: 409,
          body: {
            code: "active_session_exists",
            title: "A session is in progress",
            status: 409,
            sessionId: "session-open",
          },
        },
        "GET /api/study/sessions/session-open": () => new Promise(() => undefined) as never,
      },
      at,
    );

    await user.click(await screen.findByRole("button", { name: /Practise 1 question/ }));

    // It navigates to the open session rather than showing the learner a conflict.
    await waitFor(() => expect(screen.queryByRole("alert")).not.toBeInTheDocument());
  });

  it("shows a failure with its reference and lets the learner retry", async () => {
    const user = userEvent.setup();
    let calls = 0;
    renderApp(
      {
        "GET /api/review/queue": () =>
          ++calls === 1 ? problem(500, "internal_error") : { body: queue() },
      },
      at,
    );

    const alert = await screen.findByRole("alert");
    await user.click(within(alert).getByRole("button", { name: "Try again" }));

    expect(await screen.findByRole("heading", { name: "Nothing here yet" })).toBeInTheDocument();
  });
});

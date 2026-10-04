import { screen } from "@testing-library/react";
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

const exam = {
  id: MOCK_ID,
  trackId: javaTrack.id,
  status: "IN_PROGRESS",
  questionCount: 1,
  passingPercentage: 68,
  answeredCount: 0,
  createdAt: "2099-10-03T02:00:00Z",
  expiresAt: "2099-10-03T04:00:00Z",
  closedAt: null,
  questions: [question(0)],
};

const result = {
  id: MOCK_ID,
  trackId: javaTrack.id,
  status: "COMPLETED",
  total: 1,
  answered: 1,
  correct: 1,
  percentage: 100,
  passingPercentage: 68,
  passingCorrectCount: 1,
  passed: true,
  elapsedSeconds: 60,
  topics: [{ topicId: TOPIC, total: 1, answered: 1, correct: 1, percentage: 100 }],
  questions: [],
};

/** A handler that does not answer until the test lets it, so the pending state is deterministic. */
function held(body: unknown) {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  return { handler: async () => { await gate; return { body }; }, release };
}

/**
 * The heading must be the *same DOM node* before and after the data arrives.
 *
 * This is not a style point. `Layout` moves focus to the page's `h1` after a navigation, because a
 * single page application gets no focus move from the browser. If the heading is unmounted and a
 * new one mounted when the query settles, that focus lands on a node that is no longer in the
 * document, and a keyboard or screen-reader user is dropped back to the top of the page partway
 * through loading. `TrackPage` and `QuestionPage` both carry a comment saying their heading is
 * never replaced; these two pages are the ones that did replace it (#118).
 *
 * The node is marked with an attribute rather than compared by reference alone, because a
 * reference comparison alone would still pass if React happened to hand back a recycled element.
 */
async function headingSurvivesLoading(
  path: string,
  routes: Record<string, unknown>,
  release: () => void,
  settled: () => Promise<unknown>,
) {
  const { container } = renderApp(routes as never, { path });

  const pending = await screen.findByRole("heading", { level: 1 });
  pending.setAttribute("data-same-node", "yes");
  pending.tabIndex = -1;
  pending.focus();

  release();
  await settled();

  const loaded = container.querySelector("h1");
  expect(loaded).toBe(pending);
  expect(loaded).toHaveAttribute("data-same-node", "yes");
  // The focus Layout would have put there is still on something in the document.
  expect(loaded).toHaveFocus();
}

describe("the mock exam heading", () => {
  it("is the same node before and after the exam loads, so focus on it is not dropped", async () => {
    const gate = held(exam);
    await headingSurvivesLoading(
      `/mock-exams/${MOCK_ID}`,
      { [`GET /api/study/mock-exams/${MOCK_ID}`]: gate.handler },
      gate.release,
      () => screen.findByText("Mock question 1?"),
    );
  });

  it("is the same node before and after the result loads", async () => {
    const gate = held(result);
    await headingSurvivesLoading(
      `/mock-exams/${MOCK_ID}/result`,
      {
        "GET /api/catalog/tracks": { body: [javaTrack] },
        [`GET /api/study/mock-exams/${MOCK_ID}/result`]: gate.handler,
      },
      gate.release,
      () => screen.findByRole("heading", { level: 2, name: "Practice target reached" }),
    );
  });
});

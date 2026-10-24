import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import type { InterviewItem } from "../api/types";
import type { Handler } from "../test/fakeServer";
import { renderApp } from "../test/render";

const TRACK_SLUG = "java-backend-interview";
const MESSAGING = "aaaaaaaa-0000-4000-8000-000000000001";
const CONCURRENCY = "aaaaaaaa-0000-4000-8000-000000000002";
const SESSION = "bbbbbbbb-0000-4000-8000-000000000001";
const BLUEPRINT = "cccccccc-0000-4000-8000-000000000001";

const interviewTrack = {
  id: "dddddddd-0000-4000-8000-000000000001",
  slug: TRACK_SLUG,
  name: "Java Backend interview",
  versionId: "eeeeeeee-0000-4000-8000-000000000001",
  versionLabel: "Taxonomy 1",
  topics: [
    { id: MESSAGING, slug: "messaging", name: "Messaging", objectiveRef: null, subtopics: [] },
    { id: CONCURRENCY, slug: "concurrency", name: "Concurrency", objectiveRef: null, subtopics: [] },
  ],
};

function objectiveItem(position: number) {
  return {
    position,
    topicId: MESSAGING,
    answered: false,
    question: {
      questionId: "11111111-0000-4000-8000-000000000001",
      revisionId: "22222222-0000-4000-8000-000000000001",
      revisionNumber: 1,
      type: "SINGLE_CHOICE" as const,
      topicId: MESSAGING,
      javaRelease: null,
      difficulty: "MEDIUM" as const,
      prompt: "Which statement about an idempotent consumer is true?",
      options: [
        { key: "A", text: "It can process the same message twice safely" },
        { key: "B", text: "It needs exactly-once delivery from the broker" },
      ],
    },
  };
}

function guidedItem(position: number) {
  return {
    position,
    topicId: MESSAGING,
    answered: false,
    question: {
      questionId: "11111111-0000-4000-8000-000000000002",
      revisionId: "22222222-0000-4000-8000-000000000002",
      revisionNumber: 1,
      type: "GUIDED_RESPONSE" as const,
      topicId: MESSAGING,
      javaRelease: null,
      difficulty: "HARD" as const,
      prompt: "How would you make a message consumer idempotent?",
      options: [],
    },
  };
}

function session(items: InterviewItem[], status = "IN_PROGRESS") {
  return {
    id: SESSION,
    trackVersionId: interviewTrack.versionId,
    status,
    requestedCount: items.length,
    items,
    createdAt: "2099-01-01T10:00:00Z",
    expiresAt: "2099-01-01T12:00:00Z",
    closedAt: null,
  };
}

const guidedAnswer = {
  position: 0,
  revisionId: "22222222-0000-4000-8000-000000000002",
  itemKind: "GUIDED",
  confidence: "LOW",
  elapsedMillis: 1000,
  submittedAt: "2099-01-01T10:05:00Z",
  objective: null,
  guided: {
    referenceAnswer: "Use a stable key and persist duplicate detection with the business effect.",
    expectedConcepts: [
      { text: "stable idempotency key", required: true, explanation: "Duplicates need identity." },
      { text: "durable duplicate detection", required: false, explanation: null },
    ],
    commonMistakes: ["Treating broker delivery guarantees as business idempotency."],
    followUps: ["What changes when the side effect is in another service?"],
  },
};

const objectiveAnswer = {
  position: 0,
  revisionId: "22222222-0000-4000-8000-000000000001",
  itemKind: "OBJECTIVE",
  confidence: "HIGH",
  elapsedMillis: 1000,
  submittedAt: "2099-01-01T10:05:00Z",
  guided: null,
  objective: {
    correct: true,
    selectedOptions: ["A"],
    correctOptions: ["A"],
    explanation: "A consumer that can process a duplicate safely is idempotent.",
    options: [
      { key: "A", text: "It can process the same message twice safely", correct: true, explanation: null },
      { key: "B", text: "It needs exactly-once delivery from the broker", correct: false, explanation: null },
    ],
    references: [],
  },
};

const blueprint = {
  id: BLUEPRINT,
  trackVersionId: interviewTrack.versionId,
  jobTitle: "Senior Java engineer",
  createdAt: "2099-01-01T09:00:00Z",
  topics: [
    {
      topicId: MESSAGING,
      topicSlug: "messaging",
      weight: 2,
      source: "MATCHED",
      matchedTerms: [
        { term: "kafka", foundIn: "DESCRIPTION" },
        { term: "idempotency", foundIn: "REQUIREMENT" },
      ],
    },
    {
      topicId: CONCURRENCY,
      topicSlug: "concurrency",
      weight: 5,
      source: "LEARNER",
      matchedTerms: [],
    },
  ],
  unrecognisedRequirements: ["Our in-house FooBar framework"],
};

const catalog = { "GET /api/catalog/interview-tracks": { body: [interviewTrack] } };
const noSessions = {
  "GET /api/study/interviews": { body: [] },
};

describe("interview preparation", () => {
  it("lets a learner browse the taxonomy and start a session on part of it", async () => {
    const { fetch } = renderApp(
      {
        ...catalog,
        ...noSessions,
        "POST /api/study/interviews": { status: 201, body: session([objectiveItem(0)]) },
        "GET /api/study/interviews/bbbbbbbb-0000-4000-8000-000000000001": {
          body: session([objectiveItem(0)]),
        },
      },
      { path: "/interviews" },
    );

    expect(await screen.findByRole("heading", { name: "Java Backend interview" })).toBeTruthy();
    // Topic names are reviewed content and stay in English in every locale (ADR 0012).
    await userEvent.click(await screen.findByLabelText("Concurrency"));
    await userEvent.click(screen.getByRole("button", { name: "Start session" }));

    const start = fetch.calls.find((call) => call.method === "POST" && call.path === "/api/study/interviews");
    expect(start?.body).toMatchObject({ trackSlug: TRACK_SLUG, topicIds: [CONCURRENCY] });
  });

  it("answers an objective item, graded exactly as practice grades one", async () => {
    renderApp(
      {
        ...catalog,
        ...noSessions,
        "GET /api/study/interviews/bbbbbbbb-0000-4000-8000-000000000001": {
          body: session([objectiveItem(0)]),
        },
        "POST /api/study/interviews/bbbbbbbb-0000-4000-8000-000000000001/items/0/answer": {
          status: 201,
          body: objectiveAnswer,
        },
      },
      { path: `/interviews/${SESSION}` },
    );

    await userEvent.click(await screen.findByLabelText(/It can process the same message twice/));
    // The same wording a guided item uses for the same question (how sure are you?).
    await userEvent.click(screen.getByLabelText("High – I am certain"));
    await userEvent.click(screen.getByRole("button", { name: "Submit answer" }));

    expect(await screen.findByRole("heading", { name: "Correct" })).toBeTruthy();
    expect(screen.getByText(/A consumer that can process a duplicate safely/)).toBeTruthy();
  });

  it("tells a guided item apart from an objective one, in words and not only by colour", async () => {
    renderApp(
      {
        ...catalog,
        ...noSessions,
        "GET /api/study/interviews/bbbbbbbb-0000-4000-8000-000000000001": {
          body: session([guidedItem(0), objectiveItem(1)]),
        },
      },
      { path: `/interviews/${SESSION}` },
    );

    expect(await screen.findByText("Guided answer")).toBeTruthy();
    expect(screen.getByText(/Nothing grades this answer/)).toBeTruthy();
  });

  it("keeps a guided answer in the browser and never puts it in the request", async () => {
    const { fetch } = renderApp(
      {
        ...catalog,
        ...noSessions,
        "GET /api/study/interviews/bbbbbbbb-0000-4000-8000-000000000001": {
          body: session([guidedItem(0)]),
        },
        "POST /api/study/interviews/bbbbbbbb-0000-4000-8000-000000000001/items/0/answer": {
          status: 201,
          body: guidedAnswer,
        },
      },
      { path: `/interviews/${SESSION}` },
    );

    const secret = "I would key on the message id and persist it with the effect";
    await userEvent.type(await screen.findByLabelText(/Your answer/), secret);
    await userEvent.click(screen.getByLabelText("Low – I am guessing"));
    await userEvent.click(screen.getByRole("button", { name: /Show what a reviewer expected/ }));

    expect(await screen.findByText(/Use a stable key/)).toBeTruthy();

    // The whole point of ADR 0019: the product never receives the answer, so no request may
    // carry it. Checked against every call the page made, not only the answer.
    for (const call of fetch.calls) {
      expect(JSON.stringify(call.body ?? null)).not.toContain("key on the message id");
    }
  });

  it("records concept marks as the learner's own, after they have read the concepts", async () => {
    const { fetch } = renderApp(
      {
        ...catalog,
        ...noSessions,
        "GET /api/study/interviews/bbbbbbbb-0000-4000-8000-000000000001": {
          body: session([guidedItem(0)]),
        },
        "POST /api/study/interviews/bbbbbbbb-0000-4000-8000-000000000001/items/0/answer": {
          status: 201,
          body: guidedAnswer,
        },
        "POST /api/study/interviews/bbbbbbbb-0000-4000-8000-000000000001/items/0/concepts": {
          status: 201,
          body: guidedAnswer,
        },
        "POST /api/study/interviews/bbbbbbbb-0000-4000-8000-000000000001/complete": {
          body: session([{ ...guidedItem(0), answered: true }], "COMPLETED"),
        },
      },
      { path: `/interviews/${SESSION}` },
    );

    await userEvent.click(await screen.findByLabelText("Low – I am guessing"));
    await userEvent.click(screen.getByRole("button", { name: /Show what a reviewer expected/ }));

    // Marked only now, because only now are the concepts on the screen.
    await userEvent.click(await screen.findByLabelText(/stable idempotency key/));
    await userEvent.click(screen.getByRole("button", { name: "Finish session" }));

    const marked = fetch.calls.find((call) => call.path.endsWith("/items/0/concepts"));
    expect(marked?.body).toMatchObject({ coveredConcepts: { 0: true } });
  });

  it("shows every weight with the words behind it, and never a verdict on the learner", async () => {
    renderApp(
      {
        ...catalog,
        "GET /api/study/interviews/blueprints/cccccccc-0000-4000-8000-000000000001": {
          body: blueprint,
        },
      },
      { path: `/interviews/blueprints/${BLUEPRINT}` },
    );

    const row = (await screen.findByRole("rowheader", { name: "messaging" })).closest("tr")!;
    expect(within(row).getByText(/kafka/)).toBeTruthy();
    expect(within(row).getByText(/in a requirement/)).toBeTruthy();

    // A weight the learner set says so, and carries no terms it did not get from the advert.
    const learnerRow = screen.getByRole("rowheader", { name: "concurrency" }).closest("tr")!;
    expect(within(learnerRow).getByText(/Your own weight/)).toBeTruthy();

    expect(screen.getByText(/Our in-house FooBar framework/)).toBeTruthy();
    expect(screen.getByText(/no fit, no readiness for the role/)).toBeTruthy();
  });

  it("says what the evidence says in the reader's language, not in the server's", async () => {
    renderApp(
      {
        ...catalog,
        "GET /api/study/interviews/evidence": {
          body: {
            trackVersionId: interviewTrack.versionId,
            topics: [
              {
                topicId: MESSAGING,
                objective: {
                  answered: 2,
                  correct: 1,
                  sureAndWrong: ["x"],
                  unsureAndRight: [],
                  lastAnsweredAt: "2099-01-01T10:00:00Z",
                },
                guided: { practised: 1, conceptsMarkedMissed: [], lastPractisedAt: null },
                signals: [
                  { kind: "SURE_AND_WRONG", count: 1, concept: null },
                  { kind: "A_KIND_THIS_BUILD_HAS_NEVER_HEARD_OF", count: 3, concept: null },
                ],
              },
            ],
          },
        },
      },
      { path: "/interviews/evidence", locale: "pt-BR" },
    );

    expect(await screen.findByText(/Com certeza e errado em 1 pergunta/)).toBeTruthy();
    // An unknown kind is dropped rather than printed: a code on the screen tells nobody anything.
    expect(screen.queryByText(/A_KIND_THIS_BUILD/)).toBeNull();
  });

  it("has no accessibility violations on the pages a learner walks through", async () => {
    const pages: [string, Record<string, Handler>][] = [
      ["/interviews", { ...catalog, ...noSessions }],
      [
        `/interviews/${SESSION}`,
        {
          ...catalog,
          ...noSessions,
          "GET /api/study/interviews/bbbbbbbb-0000-4000-8000-000000000001": {
            body: session([guidedItem(0)]),
          },
        },
      ],
      [
        `/interviews/blueprints/${BLUEPRINT}`,
        {
          ...catalog,
          "GET /api/study/interviews/blueprints/cccccccc-0000-4000-8000-000000000001": {
            body: blueprint,
          },
        },
      ],
      ["/interviews/blueprints/new", { ...catalog }],
    ];

    for (const [path, routes] of pages) {
      const { container, rendered } = renderApp(routes, { path });
      await screen.findByRole("heading", { level: 1 });
      expect(await axe(container)).toHaveNoViolations();
      rendered.unmount();
    }
  });
});

import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { problem } from "../test/fakeServer";
import { editor, authorableTracks, javaTrack, renderApp, reviewer } from "../test/render";

const QUESTION_ID = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const REVISION_ID = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
const TOPIC_ID = javaTrack.topics[0]!.id;
const INTERVIEW_TOPIC_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const tracks = {
  "GET /api/catalog/tracks": { body: [javaTrack] },
  // The question editor reads the editorial source, not the learner catalog.
  "GET /api/editorial/catalog/topics": { body: authorableTracks },
};

const PROMPT = "What is printed by this program?\n\n```java\nSystem.out.println(1 + 1);\n```";
const GUIDED_CRITERIA = {
  referenceAnswer: "Use a stable idempotency key and durable duplicate detection.",
  expectedConcepts: [
    { text: "Stable idempotency key", required: true, explanation: "Duplicates must resolve to the same identity." },
  ],
  commonMistakes: ["Assuming broker delivery semantics make business effects idempotent."],
  followUps: ["What changes if the side effect is in another service?"],
};

function revision(overrides: Record<string, unknown> = {}) {
  return {
    id: REVISION_ID,
    number: 1,
    status: "DRAFT",
    authorId: editor.id,
    authorName: "editor@example.com",
    publishedByName: null,
    type: "SINGLE_CHOICE",
    topicId: TOPIC_ID,
    javaRelease: 21,
    difficulty: "EASY",
    difficultyRationale: "Plain arithmetic.",
    prompt: PROMPT,
    explanation: "One plus one is two.",
    options: [
      { key: "A", text: "2", correct: true, explanation: "Correct sum." },
      { key: "B", text: "11", correct: false, explanation: "That would be string concatenation." },
    ],
    references: [{ title: "JLS 15.18", url: "https://docs.oracle.com/javase/specs/" }],
    reviews: [],
    createdAt: "2026-09-30T10:00:00Z",
    submittedAt: null,
    publishedAt: null,
    publishedBy: null,
    deprecatedAt: null,
    examVersionId: null,
    guidedResponse: null,
    ...overrides,
  };
}

function question(rev: Record<string, unknown> = {}) {
  return { id: QUESTION_ID, createdBy: editor.id, revisions: [revision(rev)] };
}

const QUESTION_URL = `/api/admin/questions/${QUESTION_ID}`;

/** The queue's response shape: a page of items plus the counts its tabs show. */
function queuePage(items: unknown[], counts: Partial<Record<string, number>> = {}) {
  return {
    counts: {
      all: items.length,
      draft: 0,
      technicalReview: 0,
      approved: 0,
      published: 0,
      deprecated: 0,
      ...counts,
    },
    items,
    page: 0,
    size: 25,
    total: items.length,
  };
}

describe("access", () => {
  it("shows the editorial link only to people who work on content", async () => {
    renderApp(tracks);
    await screen.findByRole("heading", { level: 1, name: "Certification tracks" });
    expect(screen.queryByRole("link", { name: "Editorial" })).not.toBeInTheDocument();
  });

  it("tells a learner who opens the desk that they have no access", async () => {
    renderApp({}, { path: "/editorial" });

    expect(await screen.findByRole("heading", { name: "You do not have access to the editorial desk" })).toBeInTheDocument();
  });

  it("offers the desk to an editor", async () => {
    renderApp({ ...tracks, "GET /api/admin/questions": { body: queuePage([]) } }, { as: editor, path: "/editorial" });

    expect(await screen.findByRole("link", { name: "Editorial" })).toHaveAttribute("href", "/editorial");
  });
});

describe("the queue", () => {
  const summaries = [
    { id: "q1", latestRevisionId: "r1", latestRevisionNumber: 2, latestStatus: "TECHNICAL_REVIEW", prompt: "What is printed by this program?", topicId: TOPIC_ID },
    { id: "q2", latestRevisionId: "r2", latestRevisionNumber: 1, latestStatus: "DRAFT", prompt: null, topicId: null },
  ];

  it("lists questions with their status in words and links to each", async () => {
    const { container } = renderApp(
      { ...tracks, "GET /api/admin/questions": { body: queuePage(summaries) } },
      { as: editor, path: "/editorial" },
    );

    const table = await screen.findByRole("table");
    const rows = within(table).getAllByRole("row");
    expect(within(rows[1]!).getByRole("link", { name: "What is printed by this program?" })).toHaveAttribute(
      "href",
      "/editorial/questions/q1",
    );
    expect(rows[1]).toHaveTextContent("Handling exceptions");
    expect(rows[1]).toHaveTextContent("In review");
    expect(rows[2]).toHaveTextContent("Untitled draft");
    expect(rows[2]).toHaveTextContent("No topic yet");
    expect(rows[2]).toHaveTextContent("Draft");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("asks the server to narrow, and shows counts of everything rather than of the page", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      {
        ...tracks,
        "GET /api/admin/questions": (request) => ({
          body:
            request.query.get("status") === "DRAFT"
              ? queuePage([summaries[1]], { all: summaries.length, draft: 1 })
              : queuePage(summaries, { all: summaries.length, draft: 1 }),
        }),
      },
      { as: editor, path: "/editorial" },
    );

    await user.click(await screen.findByRole("link", { name: /^Drafts\b/ }));

    await waitFor(() => expect(screen.getAllByRole("row")).toHaveLength(2));
    expect(screen.getByRole("link", { name: /^Drafts\b/ })).toHaveAttribute("aria-current", "page");
    // The count is of every draft, not of the rows returned: a tab saying "1" must mean one
    // exists, which is the whole reason the counts travel with the page.
    expect(screen.getByRole("link", { name: /^Drafts\b/ })).toHaveTextContent("1");
    // The narrowing is the server's job now, so the filtered request carries the status.
    const asked = fetch.calls.filter((call) => call.path === "/api/admin/questions");
    expect(asked.some((call) => call.query.get("status") === "DRAFT")).toBe(true);
  });

  it("searches the prompts on the server and keeps the query in the address", async () => {
    const user = userEvent.setup();
    const { fetch, router } = renderApp(
      {
        ...tracks,
        "GET /api/admin/questions": (request) => ({
          body: request.query.get("q")
            ? queuePage([summaries[0]], { all: 1 })
            : queuePage(summaries, { all: summaries.length }),
        }),
      },
      { as: editor, path: "/editorial" },
    );

    await user.type(await screen.findByLabelText("Search the prompts"), "boxing");
    await user.click(screen.getByRole("button", { name: "Search" }));

    await waitFor(() =>
      expect(
        fetch.calls.some(
          (call) => call.path === "/api/admin/questions" && call.query.get("q") === "boxing",
        ),
      ).toBe(true),
    );
    expect(router.state.location.search).toContain("q=boxing");
  });

  it("says a search found nothing rather than that the bank is empty", async () => {
    renderApp(
      { ...tracks, "GET /api/admin/questions": { body: queuePage([], { all: 0 }) } },
      { as: editor, path: "/editorial?q=boxing" },
    );

    expect(
      await screen.findByRole("heading", { name: /No question.s prompt contains "boxing"/ }),
    ).toBeInTheDocument();
    // Telling an editor to write the first question would be the wrong next step: the bank is
    // not empty, the search is too narrow.
    expect(screen.queryByText(/Write the first one/)).not.toBeInTheDocument();
  });

  it("invites the first question, and only editors can write it", async () => {
    renderApp({ ...tracks, "GET /api/admin/questions": { body: queuePage([]) } }, { as: editor, path: "/editorial" });

    expect(await screen.findByRole("heading", { name: "No questions yet" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "New question" })).toHaveAttribute("href", "/editorial/new");
  });

  it("hides New question from a reviewer", async () => {
    renderApp({ ...tracks, "GET /api/admin/questions": { body: queuePage([]) } }, { as: reviewer, path: "/editorial" });

    await screen.findByRole("heading", { name: "No questions yet" });
    expect(screen.queryByRole("link", { name: "New question" })).not.toBeInTheDocument();
  });
});

describe("writing a draft", () => {
  async function fillBasics(user: ReturnType<typeof userEvent.setup>) {
    await screen.findByRole("option", { name: "Handling exceptions" });
    await user.selectOptions(screen.getByLabelText("Topic"), TOPIC_ID);
    await user.selectOptions(screen.getByLabelText("Difficulty"), "EASY");
    await user.type(screen.getByLabelText("Question"), "Which is true?");
  }

  it("has labelled fields and no accessibility violations", async () => {
    const { container } = renderApp(tracks, { as: editor, path: "/editorial/new" });

    expect(await screen.findByRole("heading", { level: 1, name: "New question" })).toBeInTheDocument();
    expect(await screen.findByLabelText("Option A")).toBeInTheDocument();
    expect(screen.getByLabelText("Java release")).toHaveValue("21");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("saves an unfinished draft, then moves to its page with a confirmation", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      {
        ...tracks,
        "POST /api/admin/questions": { status: 201, body: question({ options: [], references: [] }) },
        [`GET ${QUESTION_URL}`]: { body: question({ options: [], references: [] }) },
      },
      { as: editor, path: "/editorial/new" },
    );
    await fillBasics(user);

    await user.click(screen.getByRole("button", { name: "Save draft" }));

    expect(await screen.findByRole("heading", { level: 1, name: "Revision 1" })).toBeInTheDocument();
    const saved = await screen.findByText("Draft saved.");
    await waitFor(() => expect(saved).toHaveFocus());
    const call = fetch.calls.find((entry) => entry.method === "POST" && entry.path === "/api/admin/questions");
    expect(call?.body).toMatchObject({
      type: "SINGLE_CHOICE",
      topicId: TOPIC_ID,
      difficulty: "EASY",
      javaRelease: 21,
      prompt: "Which is true?",
      options: [],
    });
    expect(call?.headers.get("X-XSRF-TOKEN")).toBe("test-csrf-token");
  });

  it("points at a half-filled option instead of sending it", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(tracks, { as: editor, path: "/editorial/new" });
    await user.type(await screen.findByLabelText("Reason for A"), "Because.");

    await user.click(screen.getByRole("button", { name: "Save draft" }));

    const summary = await screen.findByRole("alert");
    expect(summary).toHaveFocus();
    expect(within(summary).getByRole("link", { name: /Option A needs text/ })).toHaveAttribute("href", "#option-text-0");
    expect(fetch.calls.some((call) => call.method === "POST" && call.path === "/api/admin/questions")).toBe(false);
  });

  it("rejects a reference link that is not https before sending", async () => {
    const user = userEvent.setup();
    renderApp(tracks, { as: editor, path: "/editorial/new" });
    await user.type(await screen.findByLabelText("Title of reference 1"), "Spec");
    await user.type(screen.getByLabelText("Link of reference 1"), "http://example.com");

    await user.click(screen.getByRole("button", { name: "Save draft" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("must start with https://");
  });

  it("uses one correct option for single choice and several for multiple choice", async () => {
    const user = userEvent.setup();
    renderApp(tracks, { as: editor, path: "/editorial/new" });
    await screen.findByLabelText("Option A");

    expect(screen.getAllByRole("radio", { name: /is correct/ })).toHaveLength(2);
    await user.click(screen.getByRole("radio", { name: "Multiple choice" }));

    expect(screen.getAllByRole("checkbox", { name: /is correct/ })).toHaveLength(2);
  });

  it("authors a guided response without objective answer semantics", async () => {
    const user = userEvent.setup();
    const guidedRevision = {
      type: "GUIDED_RESPONSE",
      topicId: INTERVIEW_TOPIC_ID,
      javaRelease: null,
      seniority: "SENIOR",
      difficulty: "HARD",
      difficultyRationale: "Requires reasoning across delivery and durable state.",
      prompt: "How would you make a message consumer idempotent?",
      explanation: null,
      options: [],
      guidedResponse: GUIDED_CRITERIA,
    };
    const guidedQuestion = question(guidedRevision);
    const { fetch, container } = renderApp(
      {
        ...tracks,
        "POST /api/admin/questions": { status: 201, body: guidedQuestion },
        [`GET ${QUESTION_URL}`]: { body: guidedQuestion },
      },
      { as: editor, path: "/editorial/new" },
    );

    await user.click(await screen.findByRole("radio", { name: "Guided response" }));
    await user.selectOptions(screen.getByLabelText("Topic"), INTERVIEW_TOPIC_ID);
    await user.selectOptions(screen.getByLabelText("Asked at"), "SENIOR");
    await user.selectOptions(screen.getByLabelText("Difficulty"), "HARD");
    await user.type(screen.getByLabelText("Why this difficulty"), "Requires reasoning across delivery and durable state.");
    await user.type(screen.getByLabelText("Question"), "How would you make a message consumer idempotent?");
    await user.type(screen.getByLabelText("Reference answer"), GUIDED_CRITERIA.referenceAnswer);
    await user.type(screen.getByLabelText("Expected concept 1"), GUIDED_CRITERIA.expectedConcepts[0]!.text);
    await user.type(screen.getByLabelText("Why concept 1 matters"), GUIDED_CRITERIA.expectedConcepts[0]!.explanation);
    await user.type(screen.getByLabelText("Common mistake 1"), GUIDED_CRITERIA.commonMistakes[0]!);
    await user.type(screen.getByLabelText("Follow-up prompt 1"), GUIDED_CRITERIA.followUps[0]!);
    await user.type(screen.getByLabelText("Title of reference 1"), "Kafka documentation");
    await user.type(screen.getByLabelText("Link of reference 1"), "https://kafka.apache.org/documentation/");

    expect(screen.queryByLabelText("Java release")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Option A")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Explanation")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Save draft" }));

    expect(await screen.findByRole("heading", { level: 1, name: "Revision 1" })).toBeInTheDocument();
    const call = fetch.calls.find((entry) => entry.method === "POST" && entry.path === "/api/admin/questions");
    expect(call?.body).toMatchObject({
      type: "GUIDED_RESPONSE",
      topicId: INTERVIEW_TOPIC_ID,
      seniority: "SENIOR",
      options: [],
      guidedResponse: {
        referenceAnswer: GUIDED_CRITERIA.referenceAnswer,
        expectedConcepts: [
          {
            text: GUIDED_CRITERIA.expectedConcepts[0]!.text,
            required: true,
            explanation: GUIDED_CRITERIA.expectedConcepts[0]!.explanation,
          },
        ],
        commonMistakes: GUIDED_CRITERIA.commonMistakes,
        followUps: GUIDED_CRITERIA.followUps,
      },
    });
    expect(call?.body).not.toHaveProperty("javaRelease");
    expect(call?.body).not.toHaveProperty("explanation");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("adds and removes options and keeps their letters in order", async () => {
    const user = userEvent.setup();
    renderApp(tracks, { as: editor, path: "/editorial/new" });
    await screen.findByLabelText("Option A");

    await user.click(screen.getByRole("button", { name: "Add another option" }));
    expect(screen.getByLabelText("Option C")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Remove option A" }));

    expect(screen.queryByLabelText("Option C")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Option B")).toBeInTheDocument();
  });
});

describe("editing and sending", () => {
  it("shows the saved content in the form and saves changes to the same revision", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      {
        ...tracks,
        [`GET ${QUESTION_URL}`]: { body: question() },
        [`PUT /api/admin/question-revisions/${REVISION_ID}`]: { body: question({ explanation: "Changed." }) },
      },
      { as: editor, path: `/editorial/questions/${QUESTION_ID}` },
    );

    const explanation = await screen.findByLabelText("Explanation");
    expect(explanation).toHaveValue("One plus one is two.");
    await user.clear(explanation);
    await user.type(explanation, "Changed.");
    await user.click(screen.getByRole("button", { name: "Save draft" }));

    expect(await screen.findByText(/^Saved at /)).toBeInTheDocument();
    const call = fetch.calls.find((entry) => entry.method === "PUT");
    expect(call?.body).toMatchObject({ explanation: "Changed.", options: [{ key: "A", correct: true }, { key: "B" }] });
  });

  it("lists what is missing when sending a draft that is not complete, each linking to its field", async () => {
    const user = userEvent.setup();
    const { fetch, container } = renderApp(
      {
        ...tracks,
        [`GET ${QUESTION_URL}`]: { body: question({ explanation: "" }) },
        [`PUT /api/admin/question-revisions/${REVISION_ID}`]: { body: question({ explanation: "" }) },
        [`POST /api/admin/question-revisions/${REVISION_ID}/submit`]: problem(409, "revision_incomplete", {
          violations: ["explanation_missing", "option_explanation_missing"],
        }),
      },
      { as: editor, path: `/editorial/questions/${QUESTION_ID}` },
    );
    await screen.findByLabelText("Explanation");

    await user.click(screen.getByRole("button", { name: "Send for review" }));

    const list = await screen.findByRole("alert");
    expect(within(list).getByRole("link", { name: "Write the explanation." })).toHaveAttribute("href", "#field-explanation");
    expect(within(list).getByRole("link", { name: /Every option needs a reason/ })).toHaveAttribute("href", "#options");
    expect(fetch.calls.some((call) => call.method === "PUT")).toBe(true);
    expect(screen.getByRole("heading", { level: 1, name: "Revision 1" })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("sends a complete draft for review and shows it as waiting", async () => {
    const user = userEvent.setup();
    const inReview = question({ status: "TECHNICAL_REVIEW", submittedAt: "2026-09-30T11:00:00Z" });
    renderApp(
      {
        ...tracks,
        [`GET ${QUESTION_URL}`]: { body: question() },
        [`PUT /api/admin/question-revisions/${REVISION_ID}`]: { body: question() },
        [`POST /api/admin/question-revisions/${REVISION_ID}/submit`]: { body: inReview },
      },
      { as: editor, path: `/editorial/questions/${QUESTION_ID}` },
    );
    await screen.findByLabelText("Explanation");

    await user.click(screen.getByRole("button", { name: "Send for review" }));

    const notice = await screen.findByText(/Sent for review/);
    expect(notice).toHaveFocus();
    expect(screen.getByText("Current status:")).toHaveTextContent("In review");
    expect(screen.queryByRole("button", { name: "Send for review" })).not.toBeInTheDocument();
  });

  it("explains a refusal from the server in plain words", async () => {
    const user = userEvent.setup();
    renderApp(
      {
        ...tracks,
        [`GET ${QUESTION_URL}`]: { body: question() },
        [`PUT /api/admin/question-revisions/${REVISION_ID}`]: problem(403, "not_revision_author"),
      },
      { as: editor, path: `/editorial/questions/${QUESTION_ID}` },
    );
    await screen.findByLabelText("Explanation");

    await user.click(screen.getByRole("button", { name: "Save draft" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Only the author of a revision can change or send it.");
  });

  it("shows what a reviewer asked to change", async () => {
    renderApp(
      {
        ...tracks,
        [`GET ${QUESTION_URL}`]: {
          body: question({
            reviews: [{ reviewerId: reviewer.id, reviewerName: "reviewer@example.com", decision: "CHANGES_REQUESTED", comment: "Option B needs a better reason.", checklist: [], decidedAt: "2026-09-30T12:00:00Z" }],
          }),
        },
      },
      { as: editor, path: `/editorial/questions/${QUESTION_ID}` },
    );

    expect(await screen.findByRole("heading", { name: "reviewer@example.com asked for changes" })).toBeInTheDocument();
    expect(screen.getByText("Option B needs a better reason.")).toBeInTheDocument();
  });
});

describe("reading a revision", () => {
  const inReview = question({ status: "TECHNICAL_REVIEW", authorId: editor.id });

  it("shows the question as the learner will see it, then the answer key", async () => {
    const { container } = renderApp(
      { ...tracks, [`GET ${QUESTION_URL}`]: { body: inReview } },
      { as: reviewer, path: `/editorial/questions/${QUESTION_ID}` },
    );

    const learner = await screen.findByRole("region", { name: "As the learner will see it" });
    expect(within(learner).getByText("What is printed by this program?")).toBeInTheDocument();
    expect(within(learner).getByLabelText("Code example")).toHaveTextContent("System.out.println(1 + 1);");
    expect(within(learner).queryByText(/is correct/)).not.toBeInTheDocument();
    const key = screen.getByRole("region", { name: "Answer key and reasons" });
    expect(within(key).getByText("A is correct")).toBeInTheDocument();
    expect(within(key).getByText("B is incorrect")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /JLS 15.18/ })).toHaveAttribute("rel", "noopener noreferrer");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("shows reviewed guided criteria without an objective answer key", async () => {
    const guided = question({
      status: "TECHNICAL_REVIEW",
      authorId: editor.id,
      type: "GUIDED_RESPONSE",
      topicId: INTERVIEW_TOPIC_ID,
      javaRelease: null,
      seniority: "SENIOR",
      explanation: null,
      options: [],
      guidedResponse: GUIDED_CRITERIA,
      prompt: "How would you make a message consumer idempotent?",
    });
    const { container } = renderApp(
      { ...tracks, [`GET ${QUESTION_URL}`]: { body: guided } },
      { as: reviewer, path: `/editorial/questions/${QUESTION_ID}` },
    );

    const criteria = await screen.findByRole("region", { name: "Reviewed response criteria" });
    expect(within(criteria).getByText(GUIDED_CRITERIA.referenceAnswer)).toBeInTheDocument();
    expect(within(criteria).getByText("Stable idempotency key")).toBeInTheDocument();
    expect(within(criteria).getByText("Required")).toBeInTheDocument();
    expect(within(criteria).getByText(GUIDED_CRITERIA.followUps[0]!)).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Answer key and reasons" })).not.toBeInTheDocument();
    expect(screen.getByText(/not a binary correctness or hiring score/i)).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("shows the lifecycle with the current step announced", async () => {
    renderApp(
      { ...tracks, [`GET ${QUESTION_URL}`]: { body: inReview } },
      { as: reviewer, path: `/editorial/questions/${QUESTION_ID}` },
    );

    const rail = await screen.findByRole("list", { name: "Revision status" });
    expect(within(rail).getByText("In review").closest("li")).toHaveAttribute("aria-current", "step");
    expect(within(rail).getByText("Draft").closest("li")).toHaveTextContent("(done)");
  });

  it("gives the author a read-only view once the draft has been sent", async () => {
    renderApp(
      { ...tracks, [`GET ${QUESTION_URL}`]: { body: inReview } },
      { as: editor, path: `/editorial/questions/${QUESTION_ID}` },
    );

    await screen.findByRole("region", { name: "As the learner will see it" });
    expect(screen.queryByRole("button", { name: "Save draft" })).not.toBeInTheDocument();
  });

  it("switches between revisions", async () => {
    const user = userEvent.setup();
    const both = {
      id: QUESTION_ID,
      createdBy: editor.id,
      revisions: [
        revision({ id: "r-old", number: 1, status: "DEPRECATED", prompt: "The old wording." }),
        revision({ id: "r-new", number: 2, status: "PUBLISHED", prompt: "The new wording." }),
      ],
    };
    renderApp({ ...tracks, [`GET ${QUESTION_URL}`]: { body: both } }, { as: reviewer, path: `/editorial/questions/${QUESTION_ID}` });

    expect(await screen.findByRole("heading", { level: 1, name: "Revision 2" })).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Revision 1" }));

    expect(await screen.findByRole("heading", { level: 1, name: "Revision 1" })).toBeInTheDocument();
    expect(screen.getByText("The old wording.")).toBeInTheDocument();
  });

  it("shows a missing question with a way back", async () => {
    renderApp(
      { ...tracks, [`GET ${QUESTION_URL}`]: problem(404, "question_not_found") },
      { as: reviewer, path: `/editorial/questions/${QUESTION_ID}` },
    );

    expect(await screen.findByRole("alert")).toHaveTextContent("does not exist");
    expect(screen.getByRole("link", { name: "Back to questions" })).toHaveAttribute("href", "/editorial");
  });
});

describe("who and what, in a revision's history", () => {
  it("names the author, the reviewer and the publisher, and lists what the reviewer checked", async () => {
    const done = question({
      status: "PUBLISHED",
      publishedByName: "admin@example.com",
      reviews: [
        {
          reviewerId: reviewer.id,
          reviewerName: "reviewer@example.com",
          decision: "APPROVED",
          comment: "Looks right.",
          checklist: ["TECHNICAL_ACCURACY", "CODE_VERIFIED"],
          decidedAt: "2026-09-30T12:00:00Z",
        },
      ],
    });
    renderApp(
      { ...tracks, [`GET ${QUESTION_URL}`]: { body: done } },
      { as: reviewer, path: `/editorial/questions/${QUESTION_ID}` },
    );

    expect(await screen.findByText(/Written by editor@example.com · Published by admin@example.com/)).toBeInTheDocument();
    const notes = screen.getByRole("region", { name: "Review notes" });
    expect(within(notes).getByRole("listitem")).toHaveTextContent("Approved by reviewer@example.com");
    expect(within(notes).getByText(/^Checked:/)).toHaveTextContent(
      "The correct answer is technically right for the stated Java release; The code compiles and prints what the question says.",
    );
  });

  it("copes with a review recorded before checklists existed", async () => {
    const old = question({
      status: "APPROVED",
      reviews: [{ reviewerId: reviewer.id, reviewerName: null, decision: "APPROVED", comment: null, checklist: [], decidedAt: "2026-09-30T12:00:00Z" }],
    });
    renderApp(
      { ...tracks, [`GET ${QUESTION_URL}`]: { body: old } },
      { as: reviewer, path: `/editorial/questions/${QUESTION_ID}` },
    );

    const notes = await screen.findByRole("region", { name: "Review notes" });
    expect(within(notes).queryByText(/^Checked:/)).not.toBeInTheDocument();
  });
});

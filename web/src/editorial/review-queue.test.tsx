import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { problem } from "../test/fakeServer";
import { admin, authorableTracks, editor, javaTrack, renderApp, reviewer } from "../test/render";

const TOPIC_A = javaTrack.topics[0]!.id;
const TOPIC_B = javaTrack.topics[1]!.id;
const tracks = {
  "GET /api/catalog/tracks": { body: [javaTrack] },
  "GET /api/editorial/catalog/topics": { body: authorableTracks },
};
const OPEN = { path: "/editorial/review" };

function summary(id: string, topicId: string, prompt: string) {
  return {
    id,
    topicId,
    latestStatus: "TECHNICAL_REVIEW",
    latestRevisionNumber: 1,
    prompt,
    createdAt: "2026-09-30T10:00:00Z",
  };
}

function page(items: ReturnType<typeof summary>[]) {
  return {
    counts: { all: items.length, draft: 0, technicalReview: items.length, approved: 0, published: 0, deprecated: 0 },
    items,
    page: 0,
    size: 100,
    total: items.length,
  };
}

function question(id: string, topicId: string, prompt: string) {
  return {
    id,
    createdBy: editor.id,
    revisions: [
      {
        id: `${id}-r1`,
        number: 1,
        status: "TECHNICAL_REVIEW",
        authorId: editor.id,
        authorName: "editor@example.com",
        publishedByName: null,
        type: "SINGLE_CHOICE",
        topicId,
        javaRelease: 21,
        difficulty: "EASY",
        difficultyRationale: "Plain arithmetic.",
        prompt,
        explanation: "Two.",
        options: [
          { key: "A", text: "2", correct: true, explanation: "Right." },
          { key: "B", text: "11", correct: false, explanation: "Concatenation." },
        ],
        references: [{ title: "JLS", url: "https://docs.oracle.com/javase/specs/" }],
        reviews: [],
        createdAt: "2026-09-30T10:00:00Z",
        submittedAt: "2026-09-30T10:30:00Z",
        publishedAt: null,
        publishedBy: null,
        deprecatedAt: null,
        examVersionId: null,
      },
    ],
  };
}

const FIRST = "11111111-1111-4111-8111-111111111111";
const SECOND = "22222222-2222-4222-8222-222222222222";
const THIRD = "33333333-3333-4333-8333-333333333333";

/** Two topics, interleaved in the queue, so grouping is visible in the order they arrive. */
const threeWaiting = {
  ...tracks,
  "GET /api/admin/questions": {
    body: page([
      summary(FIRST, TOPIC_A, "What is 1 + 1?"),
      summary(SECOND, TOPIC_B, "What does volatile guarantee?"),
      summary(THIRD, TOPIC_A, "What is 2 + 2?"),
    ]),
  },
  [`GET /api/admin/questions/${FIRST}`]: { body: question(FIRST, TOPIC_A, "What is 1 + 1?") },
  [`GET /api/admin/questions/${SECOND}`]: { body: question(SECOND, TOPIC_B, "What does volatile guarantee?") },
  [`GET /api/admin/questions/${THIRD}`]: { body: question(THIRD, TOPIC_A, "What is 2 + 2?") },
};

describe("the review worklist", () => {
  it("shows the first question with its place in the list", async () => {
    const { container } = renderApp(threeWaiting, { as: reviewer, ...OPEN });

    expect(await screen.findByText("1 of 3")).toBeInTheDocument();
    expect(await screen.findByText("What is 1 + 1?")).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("keeps one topic together instead of following the queue's order", async () => {
    renderApp(threeWaiting, { as: reviewer, ...OPEN });

    // The queue has the other topic in the middle; the worklist puts both of this topic first, so
    // the reviewer holds one subject instead of changing it at every question.
    await screen.findByText("What is 1 + 1?");
    await userEvent.setup().click(screen.getByRole("button", { name: "Skip for now" }));
    expect(await screen.findByText("What is 2 + 2?")).toBeInTheDocument();
  });

  it("moves to the next question once this one is approved", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      {
        ...threeWaiting,
        [`POST /api/admin/question-revisions/${FIRST}-r1/approve`]: {
          body: { ...question(FIRST, TOPIC_A, "What is 1 + 1?"), revisions: [{ ...question(FIRST, TOPIC_A, "What is 1 + 1?").revisions[0], status: "APPROVED" }] },
        },
      },
      { as: reviewer, ...OPEN },
    );

    await user.click(await screen.findByRole("button", { name: "Approve" }));

    expect(await screen.findByText("What is 2 + 2?")).toBeInTheDocument();
    expect(await screen.findByText("2 of 3")).toBeInTheDocument();
    expect(fetch.calls.some((call) => call.path.endsWith(`${FIRST}-r1/approve`))).toBe(true);
  });

  it("does not reorder the worklist when a decision invalidates the queue", async () => {
    // The worklist holds a query key of its own. Share the queue's and every decision refetches
    // it mid-walk: the decided question leaves TECHNICAL_REVIEW, the rest shift up, and the next
    // question shown is not the next one.
    const user = userEvent.setup();
    let listings = 0;
    renderApp(
      {
        ...threeWaiting,
        "GET /api/admin/questions": () => {
          listings += 1;
          // After the first decision the server would answer with two; the walk must not notice.
          return { body: page(listings === 1 ? [summary(FIRST, TOPIC_A, "What is 1 + 1?"), summary(SECOND, TOPIC_B, "What does volatile guarantee?"), summary(THIRD, TOPIC_A, "What is 2 + 2?")] : []) };
        },
        [`POST /api/admin/question-revisions/${FIRST}-r1/approve`]: {
          body: { ...question(FIRST, TOPIC_A, "What is 1 + 1?"), revisions: [{ ...question(FIRST, TOPIC_A, "What is 1 + 1?").revisions[0], status: "APPROVED" }] },
        },
      },
      { as: reviewer, ...OPEN },
    );

    await user.click(await screen.findByRole("button", { name: "Approve" }));

    expect(await screen.findByText("What is 2 + 2?")).toBeInTheDocument();
    expect(screen.getByText("2 of 3")).toBeInTheDocument();
  });

  it("says when the worklist is finished, and that skipped questions are still waiting", async () => {
    const user = userEvent.setup();
    renderApp(
      {
        ...tracks,
        "GET /api/admin/questions": { body: page([summary(FIRST, TOPIC_A, "What is 1 + 1?")]) },
        [`GET /api/admin/questions/${FIRST}`]: { body: question(FIRST, TOPIC_A, "What is 1 + 1?") },
      },
      { as: reviewer, ...OPEN },
    );

    await user.click(await screen.findByRole("button", { name: "Skip for now" }));

    expect(await screen.findByRole("heading", { name: "That is the end of the worklist" })).toBeInTheDocument();
    expect(screen.getByText(/still waiting in the queue/)).toBeInTheDocument();
  });

  it("explains an empty worklist rather than showing a blank page", async () => {
    renderApp({ ...tracks, "GET /api/admin/questions": { body: page([]) } }, { as: reviewer, ...OPEN });

    expect(await screen.findByRole("heading", { name: "Nothing is waiting for review" })).toBeInTheDocument();
  });

  it("says the worklist failed instead of looking empty", async () => {
    renderApp({ ...tracks, "GET /api/admin/questions": problem(500, "internal_error") }, { as: reviewer, ...OPEN });

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Nothing is waiting for review" })).not.toBeInTheDocument();
  });

  it("turns away someone who does not review", async () => {
    renderApp({ ...tracks, "GET /api/admin/questions": { body: page([]) } }, { as: editor, ...OPEN });

    expect(await screen.findByRole("heading", { name: "You do not review questions" })).toBeInTheDocument();
  });

  it("is offered from the queue to a reviewer", async () => {
    renderApp({ ...tracks, "GET /api/admin/questions": { body: page([]) } }, { as: reviewer, path: "/editorial" });

    expect(await screen.findByRole("link", { name: "Review one by one" })).toHaveAttribute("href", "/editorial/review");
  });

  it("is not offered to an author, who does not decide", async () => {
    renderApp({ ...tracks, "GET /api/admin/questions": { body: page([]) } }, { as: editor, path: "/editorial" });

    await screen.findByRole("heading", { level: 1, name: "Questions" });
    expect(screen.queryByRole("link", { name: "Review one by one" })).not.toBeInTheDocument();
  });
});

describe("an account that also publishes", () => {
  const approved = () => ({
    ...question(FIRST, TOPIC_A, "What is 1 + 1?"),
    revisions: [{ ...question(FIRST, TOPIC_A, "What is 1 + 1?").revisions[0], status: "APPROVED" }],
  });
  const published = () => ({
    ...question(FIRST, TOPIC_A, "What is 1 + 1?"),
    revisions: [{ ...question(FIRST, TOPIC_A, "What is 1 + 1?").revisions[0], status: "PUBLISHED" }],
  });
  const server = {
    ...threeWaiting,
    [`POST /api/admin/question-revisions/${FIRST}-r1/approve`]: { body: approved() },
    [`POST /api/admin/question-revisions/${FIRST}-r1/publish`]: { body: published() },
  };

  it("stays on the question after approving, so it can be published", async () => {
    // Approving is the first of two presses for this account. Advancing here would carry the
    // question off the screen before it could be published, sending them back to the queue.
    const user = userEvent.setup();
    renderApp(server, { as: admin, ...OPEN });

    await user.click(await screen.findByRole("button", { name: "Approve" }));

    expect(await screen.findByRole("button", { name: "Publish revision 1" })).toBeInTheDocument();
    expect(screen.getByText("What is 1 + 1?")).toBeInTheDocument();
    expect(screen.getByText("1 of 3")).toBeInTheDocument();
  });

  it("offers the one-press flag, off until it is turned on", async () => {
    renderApp(server, { as: admin, ...OPEN });

    const flag = await screen.findByRole("checkbox", { name: "Publish as soon as I approve" });
    expect(flag).not.toBeChecked();
    // The flag is in the walk's own bar, which renders before the question arrives.
    await screen.findByText("What is 1 + 1?");
    // Off means the button promises only what it does.
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
  });

  it("puts what the press will do on the button, not in a dialog", async () => {
    const user = userEvent.setup();
    renderApp(server, { as: admin, ...OPEN });

    await user.click(await screen.findByRole("checkbox", { name: "Publish as soon as I approve" }));

    expect(screen.getByRole("button", { name: "Approve and publish" })).toBeInTheDocument();
    expect(screen.getByText(/Publishing is final/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Approve" })).not.toBeInTheDocument();
  });

  it("approves and publishes in one press, then moves on", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(server, { as: admin, ...OPEN });
    await user.click(await screen.findByRole("checkbox", { name: "Publish as soon as I approve" }));

    await user.click(screen.getByRole("button", { name: "Approve and publish" }));

    expect(await screen.findByText("What is 2 + 2?")).toBeInTheDocument();
    const calls = fetch.calls.filter((call) => call.path.includes(`${FIRST}-r1/`)).map((call) => call.path);
    // Two requests, as two presses would have made: the record of what happened is the same.
    expect(calls).toEqual([
      `/api/admin/question-revisions/${FIRST}-r1/approve`,
      `/api/admin/question-revisions/${FIRST}-r1/publish`,
    ]);
  });

  it("does not pretend a question is published when only the approval went through", async () => {
    const user = userEvent.setup();
    renderApp(
      { ...server, [`POST /api/admin/question-revisions/${FIRST}-r1/publish`]: problem(500, "internal_error") },
      { as: admin, ...OPEN },
    );
    await user.click(await screen.findByRole("checkbox", { name: "Publish as soon as I approve" }));

    await user.click(screen.getByRole("button", { name: "Approve and publish" }));

    // Approved and unpublished is a real state. The walk stays, the failure is said, and the
    // publish step is there to try again -- moving on would leave it half done and unsaid.
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("What is 1 + 1?")).toBeInTheDocument();
    expect(screen.getByText("1 of 3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Publish revision 1" })).toBeInTheDocument();
  });

  it("moves on once the question is actually finished", async () => {
    const user = userEvent.setup();
    renderApp(server, { as: admin, ...OPEN });
    await user.click(await screen.findByRole("button", { name: "Approve" }));
    await user.click(await screen.findByRole("button", { name: "Publish revision 1" }));

    await user.click(screen.getByRole("button", { name: "Yes, publish revision 1" }));

    expect(await screen.findByText("What is 2 + 2?")).toBeInTheDocument();
    expect(screen.getByText("2 of 3")).toBeInTheDocument();
  });
});

describe("where the walk starts", () => {
  // TOPIC_A is the thin one: a mock needs five published questions in each topic, so deciding
  // here unblocks something and deciding in a full topic does not.
  const coverage = (a: number, b: number) => ({
    "GET /api/admin/question-coverage": {
      body: [
        { topicId: TOPIC_A, published: a, waitingForReview: 2 },
        { topicId: TOPIC_B, published: b, waitingForReview: 1 },
      ],
    },
  });

  it("opens on the topic a learner can be given least of", async () => {
    // The queue's own order would start with TOPIC_A because it comes first; this has to start
    // with TOPIC_B because TOPIC_B is the one short of questions.
    renderApp({ ...threeWaiting, ...coverage(5, 1) }, { as: reviewer, ...OPEN });

    expect(await screen.findByText("What does volatile guarantee?")).toBeInTheDocument();
  });

  it("says how much of the topic exists and how much is waiting", async () => {
    renderApp({ ...threeWaiting, ...coverage(2, 5) }, { as: reviewer, ...OPEN });

    await screen.findByText("What is 1 + 1?");
    expect(screen.getByText(/2 published, 2 questions wait here/)).toBeInTheDocument();
  });

  it("still walks when the coverage cannot be read", async () => {
    // Losing the priority is not losing the worklist: without it the order is the queue's, which
    // is what it was before this existed.
    renderApp(
      { ...threeWaiting, "GET /api/admin/question-coverage": problem(500, "internal_error") },
      { as: reviewer, ...OPEN },
    );

    expect(await screen.findByText("What is 1 + 1?")).toBeInTheDocument();
    expect(screen.getByText("1 of 3")).toBeInTheDocument();
  });
});

describe("the questions you passed over", () => {
  it("offers them at the end, and walks only those", async () => {
    // Two skipped, one decided: if the second pass held everything, this would read "1 of 3".
    const user = userEvent.setup();
    renderApp(
      {
        ...threeWaiting,
        [`POST /api/admin/question-revisions/${SECOND}-r1/approve`]: {
          body: { ...question(SECOND, TOPIC_B, "What does volatile guarantee?"), revisions: [{ ...question(SECOND, TOPIC_B, "What does volatile guarantee?").revisions[0], status: "APPROVED" }] },
        },
      },
      { as: reviewer, ...OPEN },
    );
    await screen.findByText("What is 1 + 1?");

    await user.click(screen.getByRole("button", { name: "Skip for now" }));
    await screen.findByText("What is 2 + 2?");
    await user.click(screen.getByRole("button", { name: "Skip for now" }));
    await screen.findByText("What does volatile guarantee?");
    await user.click(screen.getByRole("button", { name: "Approve" }));

    expect(await screen.findByText(/2 questions you passed over are still undecided/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Go through the 2 you skipped" }));

    expect(await screen.findByText("What is 1 + 1?")).toBeInTheDocument();
    expect(screen.getByText("1 of 2")).toBeInTheDocument();
  });

  it("does not offer one that was skipped and then decided", async () => {
    const user = userEvent.setup();
    renderApp(
      {
        ...threeWaiting,
        [`POST /api/admin/question-revisions/${FIRST}-r1/approve`]: {
          body: { ...question(FIRST, TOPIC_A, "What is 1 + 1?"), revisions: [{ ...question(FIRST, TOPIC_A, "What is 1 + 1?").revisions[0], status: "APPROVED" }] },
        },
      },
      { as: reviewer, ...OPEN },
    );
    await screen.findByText("What is 1 + 1?");

    await user.click(screen.getByRole("button", { name: "Skip for now" }));
    await screen.findByText("What is 2 + 2?");
    await user.click(screen.getByRole("button", { name: "Previous question" }));
    await screen.findByText("What is 1 + 1?");
    await user.click(screen.getByRole("button", { name: "Approve" }));
    await screen.findByText("What is 2 + 2?");
    await user.click(screen.getByRole("button", { name: "Skip for now" }));
    await screen.findByText("What does volatile guarantee?");
    await user.click(screen.getByRole("button", { name: "Skip for now" }));

    // Two skipped and still undecided, not three: coming back and deciding settles it.
    expect(await screen.findByRole("button", { name: "Go through the 2 you skipped" })).toBeInTheDocument();
  });
});

describe("the size of the backlog", () => {
  it("walks every page, so a backlog over a hundred is not reported as a hundred", async () => {
    // The server caps a page at 100. Reading only the first is the failure #192 was filed for:
    // the rest of the bank looks like it does not exist.
    const many = Array.from({ length: 140 }, (_, index) =>
      summary(`4${String(index).padStart(7, "0")}-1111-4111-8111-111111111111`, TOPIC_A, `Question ${index}`),
    );
    const asked: string[] = [];
    renderApp(
      {
        ...tracks,
        "GET /api/admin/questions": (request: { query: URLSearchParams }) => {
          const at = Number(request.query.get("page") ?? "0");
          asked.push(String(at));
          const items = many.slice(at * 100, at * 100 + 100);
          return { body: { ...page(items), page: at, size: 100, total: many.length } };
        },
        [`GET /api/admin/questions/${many[0]!.id}`]: { body: question(many[0]!.id, TOPIC_A, "Question 0") },
      },
      { as: reviewer, ...OPEN },
    );

    expect(await screen.findByText("1 of 140")).toBeInTheDocument();
    expect(asked).toEqual(["0", "1"]);
  });
});

describe("keeping the reviewer's place", () => {
  it("resumes at the question in the address after a reload", async () => {
    renderApp(threeWaiting, { as: reviewer, path: `/editorial/review?question=${THIRD}` });

    expect(await screen.findByText("What is 2 + 2?")).toBeInTheDocument();
    expect(screen.getByText("2 of 3")).toBeInTheDocument();
  });

  it("writes the question on screen into the address as the walk moves", async () => {
    const user = userEvent.setup();
    const { router } = renderApp(threeWaiting, { as: reviewer, ...OPEN });
    await screen.findByText("What is 1 + 1?");

    await user.click(screen.getByRole("button", { name: "Skip for now" }));

    await screen.findByText("What is 2 + 2?");
    expect(router.state.location.search).toBe(`?question=${THIRD}`);
  });

  it("goes back to the question before this one", async () => {
    const user = userEvent.setup();
    renderApp(threeWaiting, { as: reviewer, ...OPEN });
    await screen.findByText("What is 1 + 1?");
    await user.click(screen.getByRole("button", { name: "Skip for now" }));
    await screen.findByText("What is 2 + 2?");

    await user.click(screen.getByRole("button", { name: "Previous question" }));

    expect(await screen.findByText("What is 1 + 1?")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Previous question" })).toBeDisabled();
  });

  it("moves focus to the question that arrives, not leaving it on a button that is gone", async () => {
    const user = userEvent.setup();
    renderApp(threeWaiting, { as: reviewer, ...OPEN });
    await screen.findByText("What is 1 + 1?");

    await user.click(screen.getByRole("button", { name: "Skip for now" }));

    await screen.findByText("What is 2 + 2?");
    expect(screen.getByLabelText("Question 2 of 3 under review")).toHaveFocus();
  });
});

describe("a refusal the reviewer would otherwise meet one question at a time", () => {
  it("says so before the press when the viewer wrote the revision", async () => {
    // The account that imports a pack authors every question in it, so without this an importer
    // reviewing their own import meets the server's refusal once per question.
    const own = question(FIRST, TOPIC_A, "What is 1 + 1?");
    own.revisions[0]!.authorId = reviewer.id;
    renderApp(
      { ...threeWaiting, [`GET /api/admin/questions/${FIRST}`]: { body: own } },
      { as: reviewer, ...OPEN },
    );

    expect(await screen.findByText(/You wrote this revision/)).toBeInTheDocument();
    // Predicted, not taken away: the button stays, and the server still decides.
    expect(screen.getByRole("button", { name: "Approve" })).toBeEnabled();
  });

  it("tells an owner who may self-review what the decision will be recorded as", async () => {
    // The administrator answers for their own work, so the note is not a refusal any more: it
    // is what the record will say. Predicting a refusal here would now be simply wrong.
    const own = question(FIRST, TOPIC_A, "What is 1 + 1?");
    own.revisions[0]!.authorId = admin.id;
    renderApp(
      { ...threeWaiting, [`GET /api/admin/questions/${FIRST}`]: { body: own } },
      { as: admin, ...OPEN },
    );

    expect(await screen.findByText(/Approving it is a self-review/)).toBeInTheDocument();
    expect(screen.queryByText(/will be refused/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Approve" })).toBeEnabled();
  });

  it("says nothing when the revision is someone else's", async () => {
    renderApp(threeWaiting, { as: reviewer, ...OPEN });

    await screen.findByText("What is 1 + 1?");
    expect(screen.queryByText(/You wrote this revision/)).not.toBeInTheDocument();
  });
});

describe("the keyboard in the worklist", () => {
  it("takes a to the approve button without pressing it", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(threeWaiting, { as: reviewer, ...OPEN });
    await screen.findByText("What is 1 + 1?");

    await user.keyboard("a");

    // Focus, not a decision: a stray keystroke must not approve a question, because no endpoint
    // takes an approval back.
    expect(screen.getByRole("button", { name: "Approve" })).toHaveFocus();
    expect(fetch.calls.some((call) => call.path.includes("/approve"))).toBe(false);
  });

  it("leaves the shortcut keys alone while the comment is being typed", async () => {
    const user = userEvent.setup();
    renderApp(threeWaiting, { as: reviewer, ...OPEN });
    const comment = await screen.findByLabelText("Comment");

    await user.click(comment);
    await user.keyboard("a problem with option B");

    expect(comment).toHaveValue("a problem with option B");
    expect(comment).toHaveFocus();
  });

  it("skips with s", async () => {
    const user = userEvent.setup();
    renderApp(threeWaiting, { as: reviewer, ...OPEN });
    await screen.findByText("What is 1 + 1?");

    await user.keyboard("s");

    expect(await screen.findByText("What is 2 + 2?")).toBeInTheDocument();
  });
});

describe("what the worklist refuses to be", () => {
  it("offers no way to decide more than one question at a time", async () => {
    renderApp(threeWaiting, { as: admin, ...OPEN });
    await screen.findByText("What is 1 + 1?");

    // The guard this screen exists under: approving is per question, by a person who read it.
    expect(screen.queryByRole("button", { name: /approve all/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("checkbox", { name: /select all/i })).not.toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Approve" })).toHaveLength(1);
  });

  it("starts every question with an empty checklist", async () => {
    const user = userEvent.setup();
    renderApp(threeWaiting, { as: reviewer, ...OPEN });
    await screen.findByText("What is 1 + 1?");
    await user.click(screen.getByRole("checkbox", { name: /technically right/ }));
    expect(screen.getByText("1 of 5 checked")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Skip for now" }));

    // Carrying the last question's ticks forward would attest to checks nobody made on this one.
    await screen.findByText("What is 2 + 2?");
    expect(screen.getByText("0 of 5 checked")).toBeInTheDocument();
  });
});

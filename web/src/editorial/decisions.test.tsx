import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { problem } from "../test/fakeServer";
import { admin, editor, authorableTracks, javaTrack, renderApp, reviewer } from "../test/render";

const QUESTION_ID = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const REVISION_ID = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
const TOPIC_ID = javaTrack.topics[0]!.id;
const tracks = {
  "GET /api/catalog/tracks": { body: [javaTrack] },
  // The question editor reads the editorial source, not the learner catalog.
  "GET /api/editorial/catalog/topics": { body: authorableTracks },
};
const URL = `/api/admin/questions/${QUESTION_ID}`;
const REV = `/api/admin/question-revisions/${REVISION_ID}`;

function revision(overrides: Record<string, unknown> = {}) {
  return {
    id: REVISION_ID,
    number: 1,
    status: "TECHNICAL_REVIEW",
    authorId: editor.id,
    authorName: "editor@example.com",
    publishedByName: null,
    type: "SINGLE_CHOICE",
    topicId: TOPIC_ID,
    javaRelease: 21,
    difficulty: "EASY",
    difficultyRationale: "Plain arithmetic.",
    prompt: "What is 1 + 1?",
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
    ...overrides,
  };
}

const view = (...revisions: Record<string, unknown>[]) => ({
  id: QUESTION_ID,
  createdBy: editor.id,
  revisions,
});

const OPEN = { path: `/editorial/questions/${QUESTION_ID}` };

describe("reviewing", () => {
  it("shows a reviewer the policy checklist and the decision, with no publish section", async () => {
    const { container } = renderApp(
      { ...tracks, [`GET ${URL}`]: { body: view(revision()) } },
      { as: reviewer, ...OPEN },
    );

    expect(await screen.findByRole("group", { name: "Content policy" })).toBeInTheDocument();
    expect(screen.getAllByRole("checkbox")).toHaveLength(5);
    expect(screen.getByText(/recorded with your decision/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Approve" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Publish" })).not.toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("approves, with the comment if there is one, and confirms in words", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      {
        ...tracks,
        [`GET ${URL}`]: { body: view(revision()) },
        [`POST ${REV}/approve`]: { body: view(revision({ status: "APPROVED" })) },
      },
      { as: reviewer, ...OPEN },
    );
    await user.type(await screen.findByLabelText("Comment"), "Checked on JDK 21.");

    await user.click(screen.getByRole("button", { name: "Approve" }));

    // findBy waits for the text to appear; the focus arrives in an effect, which can be a render
    // later. Waiting for the focus itself is the actual requirement: the person ends up on the
    // notice.
    const approved = await screen.findByText(/^Approved\./);
    await waitFor(() => expect(approved).toHaveFocus());
    expect(screen.getByText("Current status:")).toHaveTextContent("Approved");
    const call = fetch.calls.find((entry) => entry.path === `${REV}/approve`);
    expect(call?.body).toEqual({ comment: "Checked on JDK 21.", checklist: [] });
    expect(call?.headers.get("X-XSRF-TOKEN")).toBe("test-csrf-token");
    expect(screen.queryByRole("button", { name: "Approve" })).not.toBeInTheDocument();
  });

  it("records exactly the items the reviewer ticked, with the decision", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      {
        ...tracks,
        [`GET ${URL}`]: { body: view(revision()) },
        [`POST ${REV}/approve`]: { body: view(revision({ status: "APPROVED" })) },
      },
      { as: reviewer, ...OPEN },
    );

    await user.click(await screen.findByRole("checkbox", { name: /technically right/ }));
    await user.click(screen.getByRole("checkbox", { name: /compiles and prints/ }));
    await user.click(screen.getByRole("checkbox", { name: /compiles and prints/ }));
    await user.click(screen.getByRole("checkbox", { name: /official documentation/ }));
    await user.click(screen.getByRole("button", { name: "Approve" }));

    await screen.findByText(/^Approved./);
    expect(fetch.calls.find((entry) => entry.path === `${REV}/approve`)?.body).toEqual({
      checklist: ["TECHNICAL_ACCURACY", "OFFICIAL_REFERENCES"],
    });
  });

  it("approves without a comment", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      {
        ...tracks,
        [`GET ${URL}`]: { body: view(revision()) },
        [`POST ${REV}/approve`]: { body: view(revision({ status: "APPROVED" })) },
      },
      { as: reviewer, ...OPEN },
    );

    await user.click(await screen.findByRole("button", { name: "Approve" }));

    await screen.findByText(/^Approved\./);
    expect(fetch.calls.find((entry) => entry.path === `${REV}/approve`)?.body).toEqual({ checklist: [] });
  });

  it("will not ask for changes without saying what, and does not call the server", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      { ...tracks, [`GET ${URL}`]: { body: view(revision()) } },
      { as: reviewer, ...OPEN },
    );

    await user.click(await screen.findByRole("button", { name: "Request changes" }));

    const summary = await screen.findByRole("alert");
    expect(summary).toHaveFocus();
    expect(within(summary).getByRole("link", { name: /Say what needs to change/ })).toHaveAttribute("href", "#review-comment");
    expect(fetch.calls.some((call) => call.path.endsWith("/request-changes"))).toBe(false);
  });

  it("sends the revision back with the comment", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      {
        ...tracks,
        [`GET ${URL}`]: { body: view(revision()) },
        [`POST ${REV}/request-changes`]: { body: view(revision({ status: "DRAFT" })) },
      },
      { as: reviewer, ...OPEN },
    );
    await user.type(await screen.findByLabelText("Comment"), "Option B needs a better reason.");

    await user.click(screen.getByRole("button", { name: "Request changes" }));

    const sentBack = await screen.findByText(/Sent back to the author/);
    await waitFor(() => expect(sentBack).toHaveFocus());
    expect(fetch.calls.find((entry) => entry.path === `${REV}/request-changes`)?.body).toEqual({
      comment: "Option B needs a better reason.",
      checklist: [],
    });
  });

  it("explains a refusal because the reviewer wrote the revision", async () => {
    const user = userEvent.setup();
    renderApp(
      {
        ...tracks,
        [`GET ${URL}`]: { body: view(revision({ authorId: reviewer.id })) },
        [`POST ${REV}/approve`]: problem(403, "reviewer_must_differ_from_author"),
      },
      { as: reviewer, ...OPEN },
    );

    await user.click(await screen.findByRole("button", { name: "Approve" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("cannot be reviewed by the person who wrote it");
  });
});

describe("publishing", () => {
  it("keeps publishing out of reach until the revision is approved", async () => {
    renderApp({ ...tracks, [`GET ${URL}`]: { body: view(revision()) } }, { as: admin, ...OPEN });

    expect(await screen.findByRole("button", { name: "Publish revision 1" })).toBeDisabled();
    expect(screen.getByText("Approve it first.")).toBeInTheDocument();
  });

  it("asks for confirmation before publishing, then publishes", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      {
        ...tracks,
        [`GET ${URL}`]: { body: view(revision({ status: "APPROVED" })) },
        [`POST ${REV}/publish`]: { body: view(revision({ status: "PUBLISHED", publishedAt: "2026-09-30T13:00:00Z" })) },
      },
      { as: admin, ...OPEN },
    );

    await user.click(await screen.findByRole("button", { name: "Publish revision 1" }));

    expect(fetch.calls.some((call) => call.path.endsWith("/publish"))).toBe(false);
    const confirm = screen.getByRole("group", { name: "Confirm publishing revision 1" });
    expect(confirm).toHaveTextContent("Learners will get this question");
    const yes = within(confirm).getByRole("button", { name: "Yes, publish revision 1" });
    expect(yes).toHaveFocus();
    await user.click(yes);

    const publishedNotice = await screen.findByText(/^Published\./);
    await waitFor(() => expect(publishedNotice).toHaveFocus());
    expect(screen.getByText("Current status:")).toHaveTextContent("Published");
  });

  it("lets the person back out of publishing with focus returned", async () => {
    const user = userEvent.setup();
    renderApp({ ...tracks, [`GET ${URL}`]: { body: view(revision({ status: "APPROVED" })) } }, { as: admin, ...OPEN });

    await user.click(await screen.findByRole("button", { name: "Publish revision 1" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getByRole("button", { name: "Publish revision 1" })).toHaveFocus();
  });

  it("retires a published revision after confirmation", async () => {
    const user = userEvent.setup();
    const { fetch } = renderApp(
      {
        ...tracks,
        [`GET ${URL}`]: { body: view(revision({ status: "PUBLISHED" })) },
        [`POST ${REV}/deprecate`]: { body: view(revision({ status: "DEPRECATED" })) },
      },
      { as: admin, ...OPEN },
    );

    await user.click(await screen.findByRole("button", { name: "Retire revision 1" }));
    await user.click(screen.getByRole("button", { name: "Yes, retire revision 1" }));

    expect(await screen.findByText(/^Retired\./)).toBeInTheDocument();
    expect(fetch.calls.some((call) => call.path === `${REV}/deprecate`)).toBe(true);
  });
});

describe("correcting a published question", () => {
  const published = revision({ status: "PUBLISHED" });

  it("starts a new revision as a draft the author can edit, copied from the old one", async () => {
    const user = userEvent.setup();
    let started = false;
    const second = revision({ id: "r2", number: 2, status: "DRAFT", submittedAt: null });
    renderApp(
      {
        ...tracks,
        [`GET ${URL}`]: () => ({ body: started ? view(published, second) : view(published) }),
        [`POST ${URL}/revisions`]: () => {
          started = true;
          return { status: 201, body: view(published, second) };
        },
      },
      { as: editor, ...OPEN },
    );

    await user.click(await screen.findByRole("button", { name: "Start a new revision" }));

    expect(await screen.findByText(/New revision started/)).toBeInTheDocument();
    expect(await screen.findByRole("heading", { level: 1, name: "Revision 2" })).toBeInTheDocument();
    expect(await screen.findByLabelText("Question", { selector: "textarea" })).toHaveValue("What is 1 + 1?");
  });

  it("offers it only on the latest revision, and only to authors", async () => {
    const second = revision({ id: "r2", number: 2, status: "DRAFT", authorId: admin.id });
    renderApp(
      { ...tracks, [`GET ${URL}`]: { body: view(published, second) } },
      { as: reviewer, path: `/editorial/questions/${QUESTION_ID}?revision=1` },
    );

    await screen.findByRole("heading", { level: 1, name: "Revision 1" });
    expect(screen.queryByRole("button", { name: "Start a new revision" })).not.toBeInTheDocument();
  });

  it("explains when a revision is already open", async () => {
    const user = userEvent.setup();
    renderApp(
      {
        ...tracks,
        [`GET ${URL}`]: { body: view(published) },
        [`POST ${URL}/revisions`]: problem(409, "open_revision_exists"),
      },
      { as: editor, ...OPEN },
    );

    await user.click(await screen.findByRole("button", { name: "Start a new revision" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("already has a revision in progress");
  });
});

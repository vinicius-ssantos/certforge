import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { editor, javaTrack, renderApp, reviewer } from "../test/render";

const QUESTION_ID = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const REVISION_ID = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
const TOPIC_ID = javaTrack.topics[0]!.id;
const tracks = { "GET /api/catalog/tracks": { body: [javaTrack] } };
const QUESTION_URL = `/api/admin/questions/${QUESTION_ID}`;

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
    prompt: "What does the program print?",
    explanation: "One plus one is two.",
    options: [
      { key: "A", text: "2", correct: true, explanation: "Right." },
      { key: "B", text: "11", correct: false, explanation: "Concatenation." },
    ],
    references: [{ title: "JLS", url: "https://docs.oracle.com/javase/specs/" }],
    reviews: [],
    createdAt: "2026-09-30T10:00:00Z",
    submittedAt: null,
    publishedAt: null,
    publishedBy: null,
    deprecatedAt: null,
    examVersionId: null,
    ...overrides,
  };
}

const view = (...revisions: Record<string, unknown>[]) => ({ id: QUESTION_ID, createdBy: editor.id, revisions });

describe("what a correction changed", () => {
  const first = revision({ id: "r1", status: "DEPRECATED" });
  const second = revision({
    id: "r2",
    number: 2,
    status: "TECHNICAL_REVIEW",
    prompt: "What does this program print?",
    options: [
      { key: "A", text: "2", correct: true, explanation: "Right." },
      { key: "B", text: "11", correct: true, explanation: "Concatenation." },
    ],
  });
  const open = { as: reviewer, path: `/editorial/questions/${QUESTION_ID}` };

  it("shows the reviewer the difference from the previous revision in words as well as marks", async () => {
    const { container } = renderApp({ ...tracks, [`GET ${QUESTION_URL}`]: { body: view(first, second) } }, open);

    const diff = await screen.findByRole("region", { name: "What changed since revision 1" });
    expect(within(diff).getByText("Question")).toBeInTheDocument();
    expect(diff.querySelector("del")).toHaveTextContent("[removed: the]");
    expect(diff.querySelector("ins")).toHaveTextContent("[added: this]");
    expect(within(diff).getByText("Option B correctness")).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("says so when nothing differs", async () => {
    const same = revision({ id: "r2", number: 2, status: "TECHNICAL_REVIEW" });
    renderApp({ ...tracks, [`GET ${QUESTION_URL}`]: { body: view(first, same) } }, open);

    expect(await screen.findByText("Nothing differs from revision 1.")).toBeInTheDocument();
  });

  it("shows no comparison for a first revision", async () => {
    renderApp(
      { ...tracks, [`GET ${QUESTION_URL}`]: { body: view(revision({ status: "TECHNICAL_REVIEW" })) } },
      open,
    );

    await screen.findByRole("region", { name: "As the learner will see it" });
    expect(screen.queryByRole("region", { name: /What changed/ })).not.toBeInTheDocument();
  });
});

describe("unsaved changes", () => {
  async function openEditor() {
    const user = userEvent.setup();
    renderApp(
      {
        ...tracks,
        "GET /api/admin/questions": { body: [] },
        [`GET ${QUESTION_URL}`]: { body: view(revision()) },
        [`PUT /api/admin/question-revisions/${REVISION_ID}`]: {
          body: view(revision({ explanation: "One plus one is two. More." })),
        },
      },
      { as: editor, path: `/editorial/questions/${QUESTION_ID}` },
    );
    const explanation = await screen.findByLabelText("Explanation");
    return { user, explanation };
  }

  it("lets the person leave freely when nothing has changed", async () => {
    const { user } = await openEditor();

    await user.click(screen.getByRole("link", { name: "Back to questions" }));

    expect(await screen.findByRole("heading", { level: 1, name: "Questions" })).toBeInTheDocument();
  });

  it("asks before leaving with unsaved edits, and stays when told to keep editing", async () => {
    const { user, explanation } = await openEditor();
    await user.type(explanation, " More.");

    await user.click(screen.getByRole("link", { name: "Back to questions" }));

    const group = await screen.findByRole("group", { name: "Unsaved changes" });
    const keep = within(group).getByRole("button", { name: "Keep editing" });
    expect(keep).toHaveFocus();
    await user.click(keep);
    expect(screen.queryByRole("group", { name: "Unsaved changes" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save draft" })).toHaveFocus();
    expect(screen.getByLabelText("Explanation")).toHaveValue("One plus one is two. More.");
  });

  it("leaves without saving when the person says so", async () => {
    const { user, explanation } = await openEditor();
    await user.type(explanation, " More.");

    await user.click(screen.getByRole("link", { name: "Back to questions" }));
    await user.click(await screen.findByRole("button", { name: "Leave without saving" }));

    expect(await screen.findByRole("heading", { level: 1, name: "Questions" })).toBeInTheDocument();
  });

  it("does not ask once the edits are saved", async () => {
    const { user, explanation } = await openEditor();
    await user.type(explanation, " More.");
    await user.click(screen.getByRole("button", { name: "Save draft" }));
    await screen.findByText(/^Saved at /);

    await user.click(screen.getByRole("link", { name: "Back to questions" }));

    expect(await screen.findByRole("heading", { level: 1, name: "Questions" })).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "Unsaved changes" })).not.toBeInTheDocument();
  });

  it("warns the browser before the tab is closed, only while there is something to lose", async () => {
    const { user, explanation } = await openEditor();
    const clean = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(clean);
    expect(clean.defaultPrevented).toBe(false);

    await user.type(explanation, " More.");
    const dirty = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(dirty);
    expect(dirty.defaultPrevented).toBe(true);
  });
});

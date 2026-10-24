import { screen } from "@testing-library/react";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";
import { authorableTracks, editor, javaTrack, renderApp } from "../test/render";

const QUESTION_ID = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const REVISION_ID = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
const TOPIC_ID = javaTrack.topics[0]!.id;

const tracks = {
  "GET /api/catalog/tracks": { body: [javaTrack] },
  "GET /api/editorial/catalog/topics": { body: authorableTracks },
};

/**
 * A revision that claims the given objective keys. Everything else matches the minimal fixture
 * `decisions.test.tsx` uses, so this file tests only what is new: the panel beside it.
 */
function revision(objectiveKeys: string[], overrides: Record<string, unknown> = {}) {
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
    objectiveKeys,
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

const view = (rev: Record<string, unknown>) => ({
  id: QUESTION_ID,
  createdBy: editor.id,
  revisions: [rev],
});

const OPEN = { path: `/editorial/questions/${QUESTION_ID}` };
const SOURCES = `GET /api/editorial/catalog/topics/${TOPIC_ID}/objective-sources`;
const URL = `GET /api/admin/questions/${QUESTION_ID}`;

describe("where a claimed objective was read, beside the question (#177)", () => {
  it("shows the provider's page, when it was read, and renders no claim it does not know of", async () => {
    renderApp(
      {
        ...tracks,
        [URL]: { body: view(revision(["1.1", "2.2"])) },
        [SOURCES]: {
          body: {
            status: "VERIFIED",
            sourceUrl: "https://example.com/objectives",
            verifiedOn: "2026-10-22",
            objectives: [
              { key: "1.1", title: "Define and build images", sourceRef: "Design" },
              // 2.2 is claimed by the question but absent from this reading on purpose, to prove
              // the panel says so rather than silently dropping it.
            ],
          },
        },
      },
      { as: editor, ...OPEN },
    );

    expect(await screen.findByText(/Verified against the provider's page/)).toBeInTheDocument();
    expect(screen.getByText("Where the claimed objective was read")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Provider's page" })).toHaveAttribute(
      "href",
      "https://example.com/objectives",
    );
    expect(screen.getByText(/read .*2026/)).toBeInTheDocument();

    // The claimed key that is on the page, with its title and where it was read.
    expect(screen.getByText("1.1")).toBeInTheDocument();
    expect(screen.getByText("Define and build images")).toBeInTheDocument();
    expect(screen.getByText("(Design)")).toBeInTheDocument();

    // The claimed key that is not on the current reading: said, not dropped.
    expect(screen.getByText("2.2")).toBeInTheDocument();
    expect(screen.getByText(/not on the current reading of the page/)).toBeInTheDocument();
  });

  it("renders nothing when the question claims no objective at all", async () => {
    renderApp(
      { ...tracks, [URL]: { body: view(revision([])) } },
      { as: editor, ...OPEN },
    );

    await screen.findByRole("link", { name: /JLS/ });
    expect(screen.queryByText("Where the claimed objective was read")).not.toBeInTheDocument();
  });

  it("says a taxonomy with no exam cites no source, rather than calling it unverified", async () => {
    renderApp(
      {
        ...tracks,
        [URL]: { body: view(revision(["1.1"])) },
        [SOURCES]: { body: { status: "NOT_A_CERTIFICATION", sourceUrl: null, verifiedOn: null, objectives: [] } },
      },
      { as: editor, ...OPEN },
    );

    expect(
      await screen.findByText("This topic belongs to a taxonomy that cites no exam."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Nobody has read the provider's page yet")).not.toBeInTheDocument();
  });

  it("has no accessibility violations with the panel showing", async () => {
    const { container } = renderApp(
      {
        ...tracks,
        [URL]: { body: view(revision(["1.1"])) },
        [SOURCES]: {
          body: {
            status: "UNVERIFIED",
            sourceUrl: null,
            verifiedOn: null,
            objectives: [],
          },
        },
      },
      { as: editor, ...OPEN },
    );

    await screen.findByText("Nobody has read the provider's page yet");
    expect(await axe(container)).toHaveNoViolations();
  });
});

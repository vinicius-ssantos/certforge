import { describe, expect, it } from "vitest";
import type { Revision } from "../api/types";
import { diffRevisions, wordDiff } from "./diff";

describe("wordDiff", () => {
  it("marks only the words that changed and keeps the rest as written", () => {
    expect(wordDiff("the quick brown fox", "the slow brown fox")).toEqual([
      { kind: "same", text: "the " },
      { kind: "removed", text: "quick" },
      { kind: "added", text: "slow" },
      { kind: "same", text: " brown fox" },
    ]);
  });

  it("handles additions at the end and removals at the start", () => {
    expect(wordDiff("a b", "a b c").map((piece) => piece.kind)).toEqual(["same", "added"]);
    expect(wordDiff("x a b", "a b").map((piece) => piece.kind)).toEqual(["removed", "same"]);
  });

  it("reports nothing different for equal text, and copes with empty text", () => {
    expect(wordDiff("same", "same")).toEqual([{ kind: "same", text: "same" }]);
    expect(wordDiff("", "new")).toEqual([{ kind: "added", text: "new" }]);
    expect(wordDiff("old", "")).toEqual([{ kind: "removed", text: "old" }]);
  });
});

function revision(overrides: Partial<Revision> = {}): Revision {
  return {
    id: "r",
    number: 1,
    status: "PUBLISHED",
    authorId: "a",
    type: "SINGLE_CHOICE",
    topicId: "t",
    javaRelease: 21,
    difficulty: "EASY",
    difficultyRationale: "Plain.",
    prompt: "What is 1 + 1?",
    explanation: "Two.",
    options: [
      { key: "A", text: "2", correct: true, explanation: "Right." },
      { key: "B", text: "11", correct: false, explanation: "Concatenation." },
    ],
    references: [{ title: "JLS", url: "https://docs.oracle.com/" }],
    reviews: [],
    createdAt: "2026-09-30T10:00:00Z",
    submittedAt: null,
    publishedAt: null,
    publishedBy: null,
    deprecatedAt: null,
    examVersionId: null,
    ...overrides,
  } as Revision;
}

const names = (id: string) => (id === "t" ? "Exceptions" : undefined);

describe("diffRevisions", () => {
  it("finds nothing between identical revisions", () => {
    expect(diffRevisions(revision(), revision({ number: 2 }), names)).toEqual([]);
  });

  it("names each field that changed", () => {
    const next = revision({
      number: 2,
      prompt: "What is 2 + 2?",
      difficulty: "HARD",
      options: [
        { key: "A", text: "4", correct: false, explanation: "Right." },
        { key: "B", text: "22", correct: true, explanation: "Concatenation." },
        { key: "C", text: "none", correct: false, explanation: "Added." },
      ],
      references: [
        { title: "JLS", url: "https://docs.oracle.com/" },
        { title: "API", url: "https://docs.oracle.com/api" },
      ],
    });

    const labels = diffRevisions(revision(), next, names).map((change) => change.label);

    expect(labels).toEqual([
      "Question",
      "Difficulty",
      "Option A",
      "Option A correctness",
      "Option B",
      "Option B correctness",
      "Option C added",
      "Reference added",
    ]);
  });

  it("reports a removed option and a removed reference", () => {
    const next = revision({ number: 2, options: [revision().options[0]!], references: [] });

    const labels = diffRevisions(revision(), next, names).map((change) => change.label);

    expect(labels).toEqual(["Option B removed", "Reference removed"]);
  });
});

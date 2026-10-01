import type { Revision, RevisionRequest } from "../api/types";

export interface OptionDraft {
  text: string;
  correct: boolean;
  explanation: string;
}

export interface ReferenceDraft {
  title: string;
  url: string;
}

/** The form's state: strings the editor is typing, not yet the shape the server accepts. */
export interface Draft {
  type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE";
  topicId: string;
  javaRelease: string;
  difficulty: "" | "EASY" | "MEDIUM" | "HARD";
  rationale: string;
  prompt: string;
  explanation: string;
  options: OptionDraft[];
  references: ReferenceDraft[];
}

export const MAX_OPTIONS = 8;
export const KEYS = "ABCDEFGH";

export function emptyOption(): OptionDraft {
  return { text: "", correct: false, explanation: "" };
}

export function emptyDraft(): Draft {
  return {
    type: "SINGLE_CHOICE",
    topicId: "",
    javaRelease: "21",
    difficulty: "",
    rationale: "",
    prompt: "",
    explanation: "",
    options: [emptyOption(), emptyOption()],
    references: [{ title: "", url: "" }],
  };
}

export function draftFrom(revision: Revision): Draft {
  const options = revision.options.map((option) => ({
    text: option.text,
    correct: option.correct,
    explanation: option.explanation,
  }));
  while (options.length < 2) {
    options.push(emptyOption());
  }
  return {
    type: revision.type === "MULTIPLE_CHOICE" ? "MULTIPLE_CHOICE" : "SINGLE_CHOICE",
    topicId: revision.topicId ?? "",
    javaRelease: revision.javaRelease ? String(revision.javaRelease) : "",
    difficulty:
      revision.difficulty === "EASY" || revision.difficulty === "MEDIUM" || revision.difficulty === "HARD"
        ? revision.difficulty
        : "",
    rationale: revision.difficultyRationale ?? "",
    prompt: revision.prompt ?? "",
    explanation: revision.explanation ?? "",
    options,
    references: revision.references.length > 0 ? revision.references.map((r) => ({ ...r })) : [{ title: "", url: "" }],
  };
}

export interface Problem {
  fieldId: string;
  message: string;
}

/**
 * What it takes to save, which is less than what it takes to send. A draft may be unfinished, but
 * the server will not accept an option or a reference that is half filled in, so those are caught
 * here with a pointer to the row. Rows left entirely empty are simply not saved.
 */
export function toRequest(draft: Draft): { request: RevisionRequest; problems: Problem[] } {
  const problems: Problem[] = [];

  const options = draft.options
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => option.text.trim() || option.explanation.trim() || option.correct);
  options.forEach(({ option, index }) => {
    if (!option.text.trim()) {
      problems.push({
        fieldId: `option-text-${index}`,
        message: `Option ${KEYS[index]} needs text before the draft can be saved.`,
      });
    }
  });

  const references = draft.references.filter((ref) => ref.title.trim() || ref.url.trim());
  draft.references.forEach((ref, index) => {
    if (!(ref.title.trim() || ref.url.trim())) return;
    if (!ref.title.trim()) {
      problems.push({ fieldId: `reference-title-${index}`, message: `Reference ${index + 1} needs a title.` });
    }
    if (!ref.url.trim().startsWith("https://")) {
      problems.push({
        fieldId: `reference-url-${index}`,
        message: `The link of reference ${index + 1} must start with https://`,
      });
    }
  });

  let javaRelease: number | undefined;
  if (draft.javaRelease.trim()) {
    const parsed = Number(draft.javaRelease);
    if (Number.isInteger(parsed) && parsed >= 1) {
      javaRelease = parsed;
    } else {
      problems.push({ fieldId: "field-release", message: "Enter the Java release as a whole number, such as 21." });
    }
  }

  const request: RevisionRequest = {
    type: draft.type,
    prompt: draft.prompt,
    explanation: draft.explanation,
    difficultyRationale: draft.rationale,
    options: options.map(({ option }, position) => ({
      key: KEYS[position] ?? "A",
      text: option.text.trim(),
      correct: option.correct,
      explanation: option.explanation,
    })),
    references: references.map((ref) => ({ title: ref.title.trim(), url: ref.url.trim() })),
    ...(draft.topicId ? { topicId: draft.topicId } : {}),
    ...(draft.difficulty ? { difficulty: draft.difficulty } : {}),
    ...(javaRelease !== undefined ? { javaRelease } : {}),
  };
  return { request, problems };
}

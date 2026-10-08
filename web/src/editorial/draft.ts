import type { Revision, RevisionRequest } from "../api/types";

export interface OptionDraft {
  text: string;
  correct: boolean;
  explanation: string;
}

export interface ExpectedConceptDraft {
  text: string;
  required: boolean;
  explanation: string;
}

export interface GuidedResponseDraft {
  referenceAnswer: string;
  expectedConcepts: ExpectedConceptDraft[];
  commonMistakes: string[];
  followUps: string[];
}

export interface ReferenceDraft {
  title: string;
  url: string;
}

/** The form's state: strings the editor is typing, not yet the shape the server accepts. */
export interface Draft {
  type: "SINGLE_CHOICE" | "MULTIPLE_CHOICE" | "GUIDED_RESPONSE";
  topicId: string;
  javaRelease: string;
  /** Interview tracks only: the level the question is asked at. Empty on a certification track. */
  seniority: "" | "PLENO" | "SENIOR";
  difficulty: "" | "EASY" | "MEDIUM" | "HARD";
  rationale: string;
  prompt: string;
  explanation: string;
  options: OptionDraft[];
  guidedResponse: GuidedResponseDraft;
  references: ReferenceDraft[];
}

export const MAX_OPTIONS = 8;
export const KEYS = "ABCDEFGH";

export function emptyOption(): OptionDraft {
  return { text: "", correct: false, explanation: "" };
}

export function emptyConcept(): ExpectedConceptDraft {
  return { text: "", required: true, explanation: "" };
}

export function emptyGuidedResponse(): GuidedResponseDraft {
  return {
    referenceAnswer: "",
    expectedConcepts: [emptyConcept()],
    commonMistakes: [""],
    followUps: [""],
  };
}

export function emptyDraft(): Draft {
  return {
    type: "SINGLE_CHOICE",
    topicId: "",
    javaRelease: "21",
    seniority: "",
    difficulty: "",
    rationale: "",
    prompt: "",
    explanation: "",
    options: [emptyOption(), emptyOption()],
    guidedResponse: emptyGuidedResponse(),
    references: [{ title: "", url: "" }],
  };
}

export function draftFrom(revision: Revision): Draft {
  const guided = revision.type === "GUIDED_RESPONSE";
  const options = revision.options.map((option) => ({
    text: option.text,
    correct: option.correct,
    explanation: option.explanation,
  }));
  if (!guided) {
    while (options.length < 2) {
      options.push(emptyOption());
    }
  }
  const criteria = revision.guidedResponse;
  return {
    type:
      revision.type === "MULTIPLE_CHOICE"
        ? "MULTIPLE_CHOICE"
        : revision.type === "GUIDED_RESPONSE"
          ? "GUIDED_RESPONSE"
          : "SINGLE_CHOICE",
    topicId: revision.topicId ?? "",
    javaRelease: revision.javaRelease ? String(revision.javaRelease) : "",
    seniority: revision.seniority === "PLENO" || revision.seniority === "SENIOR" ? revision.seniority : "",
    difficulty:
      revision.difficulty === "EASY" || revision.difficulty === "MEDIUM" || revision.difficulty === "HARD"
        ? revision.difficulty
        : "",
    rationale: revision.difficultyRationale ?? "",
    prompt: revision.prompt ?? "",
    explanation: revision.explanation ?? "",
    options,
    guidedResponse: criteria
      ? {
          referenceAnswer: criteria.referenceAnswer ?? "",
          expectedConcepts:
            criteria.expectedConcepts.length > 0
              ? criteria.expectedConcepts.map((concept) => ({
                  text: concept.text,
                  required: concept.required,
                  explanation: concept.explanation ?? "",
                }))
              : [emptyConcept()],
          commonMistakes: criteria.commonMistakes.length > 0 ? [...criteria.commonMistakes] : [""],
          followUps: criteria.followUps.length > 0 ? [...criteria.followUps] : [""],
        }
      : emptyGuidedResponse(),
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
  const guided = draft.type === "GUIDED_RESPONSE";

  const options = guided
    ? []
    : draft.options
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
  if (!guided && draft.javaRelease.trim()) {
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
    difficultyRationale: draft.rationale,
    references: references.map((ref) => ({ title: ref.title.trim(), url: ref.url.trim() })),
    ...(guided
      ? {
          options: [],
          guidedResponse: {
            referenceAnswer: draft.guidedResponse.referenceAnswer,
            expectedConcepts: draft.guidedResponse.expectedConcepts
              .filter((concept) => concept.text.trim() || concept.explanation.trim() || concept.required)
              .map((concept) => ({
                text: concept.text.trim(),
                required: concept.required,
                explanation: concept.explanation.trim(),
              })),
            commonMistakes: draft.guidedResponse.commonMistakes.map((value) => value.trim()).filter(Boolean),
            followUps: draft.guidedResponse.followUps.map((value) => value.trim()).filter(Boolean),
          },
        }
      : {
          explanation: draft.explanation,
          options: options.map(({ option }, position) => ({
            key: KEYS[position] ?? "A",
            text: option.text.trim(),
            correct: option.correct,
            explanation: option.explanation,
          })),
        }),
    ...(draft.topicId ? { topicId: draft.topicId } : {}),
    ...(draft.difficulty ? { difficulty: draft.difficulty } : {}),
    ...(javaRelease !== undefined ? { javaRelease } : {}),
    ...(draft.seniority ? { seniority: draft.seniority } : {}),
  };
  return { request, problems };
}

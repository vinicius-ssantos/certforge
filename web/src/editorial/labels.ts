export type StatusTone = "draft" | "review" | "ok";

/** Every status is a word and a symbol; colour only reinforces it. */
export const STATUS: Record<string, { label: string; symbol: string; tone: StatusTone }> = {
  DRAFT: { label: "Draft", symbol: "○", tone: "draft" },
  TECHNICAL_REVIEW: { label: "In review", symbol: "◐", tone: "review" },
  APPROVED: { label: "Approved", symbol: "●", tone: "ok" },
  PUBLISHED: { label: "Published", symbol: "✓", tone: "ok" },
  DEPRECATED: { label: "Replaced", symbol: "–", tone: "draft" },
};

export function statusOf(status: string) {
  return STATUS[status] ?? { label: status, symbol: "○", tone: "draft" as StatusTone };
}

/** The steps of a revision's life, in order. A replaced revision has left the sequence. */
export const LIFECYCLE = ["DRAFT", "TECHNICAL_REVIEW", "APPROVED", "PUBLISHED"] as const;

/** The content-policy checks a reviewer can attest to, by the codes the server records. */
export const CHECKLIST = [
  { code: "TECHNICAL_ACCURACY", label: "The correct answer is technically right for the stated Java release" },
  { code: "CODE_VERIFIED", label: "The code compiles and prints what the question says" },
  { code: "NO_AMBIGUITY", label: "Nothing in the wording is ambiguous" },
  { code: "REASONS_ACCURATE", label: "Every reason is accurate, including for the wrong options" },
  { code: "OFFICIAL_REFERENCES", label: "The references are official documentation" },
] as const;

export const TYPE_LABEL: Record<string, string> = {
  SINGLE_CHOICE: "Single choice",
  MULTIPLE_CHOICE: "Multiple choice",
};

export const DIFFICULTY_LABEL: Record<string, string> = {
  EASY: "Easy",
  MEDIUM: "Medium",
  HARD: "Hard",
};

/**
 * What the server's incompleteness codes mean to an editor, and which field to go to. The server
 * decides what is complete; this only words it.
 */
export const VIOLATION: Record<string, { message: string; fieldId: string }> = {
  prompt_missing: { message: "Write the question.", fieldId: "field-prompt" },
  topic_missing: { message: "Choose a topic.", fieldId: "field-topic" },
  java_release_missing: { message: "Enter the Java release.", fieldId: "field-release" },
  difficulty_missing: { message: "Choose a difficulty.", fieldId: "field-difficulty" },
  difficulty_rationale_missing: {
    message: "Explain why this difficulty fits.",
    fieldId: "field-rationale",
  },
  explanation_missing: { message: "Write the explanation.", fieldId: "field-explanation" },
  options_too_few: { message: "Add at least two answer options.", fieldId: "options" },
  option_key_duplicate: { message: "Two options share a letter.", fieldId: "options" },
  option_text_missing: { message: "Every option needs text.", fieldId: "options" },
  option_explanation_missing: {
    message: "Every option needs a reason, including the wrong ones.",
    fieldId: "options",
  },
  single_choice_requires_exactly_one_correct_option: {
    message: "Mark exactly one option as correct.",
    fieldId: "options",
  },
  multiple_choice_requires_a_correct_option: {
    message: "Mark at least one option as correct.",
    fieldId: "options",
  },
  references_missing: { message: "Add at least one official reference.", fieldId: "references" },
  reference_invalid: {
    message: "Every reference needs a title and a link that starts with https.",
    fieldId: "references",
  },
};

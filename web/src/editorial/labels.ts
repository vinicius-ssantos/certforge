import type { Catalog } from "../i18n/en";

export type StatusTone = "draft" | "review" | "ok";

/** Every status is a word and a symbol; colour only reinforces it. */
export function statusOf(status: string, t: Catalog): { label: string; symbol: string; tone: StatusTone } {
  const known: Record<string, { label: string; symbol: string; tone: StatusTone }> = {
    DRAFT: { label: t.editorial.status.draft, symbol: "○", tone: "draft" },
    TECHNICAL_REVIEW: { label: t.editorial.status.inReview, symbol: "◐", tone: "review" },
    APPROVED: { label: t.editorial.status.approved, symbol: "●", tone: "ok" },
    PUBLISHED: { label: t.editorial.status.published, symbol: "✓", tone: "ok" },
    DEPRECATED: { label: t.editorial.status.replaced, symbol: "–", tone: "draft" },
  };
  return known[status] ?? { label: status, symbol: "○", tone: "draft" };
}

/** The steps of a revision's life, in order. A replaced revision has left the sequence. */
export const LIFECYCLE = ["DRAFT", "TECHNICAL_REVIEW", "APPROVED", "PUBLISHED"] as const;

/** The content-policy checks a reviewer can attest to, by the codes the server records. */
export function checklist(t: Catalog): { code: string; label: string }[] {
  return [
    { code: "TECHNICAL_ACCURACY", label: t.editorial.checklist.technicalAccuracy },
    { code: "CODE_VERIFIED", label: t.editorial.checklist.codeVerified },
    { code: "NO_AMBIGUITY", label: t.editorial.checklist.noAmbiguity },
    { code: "REASONS_ACCURATE", label: t.editorial.checklist.reasonsAccurate },
    { code: "OFFICIAL_REFERENCES", label: t.editorial.checklist.officialReferences },
  ];
}

export function typeLabels(t: Catalog): Record<string, string> {
  return {
    SINGLE_CHOICE: t.editorial.type.singleChoice,
    MULTIPLE_CHOICE: t.editorial.type.multipleChoice,
    GUIDED_RESPONSE: t.editorial.type.guidedResponse,
  };
}

export function difficultyLabels(t: Catalog): Record<string, string> {
  return {
    EASY: t.editorial.difficulty.easy,
    MEDIUM: t.editorial.difficulty.medium,
    HARD: t.editorial.difficulty.hard,
  };
}

/**
 * What the server's incompleteness codes mean to an editor, and which field to go to. The server
 * decides what is complete; this only words it.
 */
export function violations(t: Catalog): Record<string, { message: string; fieldId: string }> {
  const v = t.editorial.violations;
  return {
    prompt_missing: { message: v.promptMissing, fieldId: "field-prompt" },
    topic_missing: { message: v.topicMissing, fieldId: "field-topic" },
    java_release_missing: { message: v.javaReleaseMissing, fieldId: "field-release" },
    java_release_not_applicable: {
      message: v.javaReleaseNotApplicable,
      fieldId: "field-release",
    },
    seniority_missing: { message: v.seniorityMissing, fieldId: "field-seniority" },
    seniority_not_applicable: {
      message: v.seniorityNotApplicable,
      fieldId: "field-seniority",
    },
    difficulty_missing: { message: v.difficultyMissing, fieldId: "field-difficulty" },
    difficulty_rationale_missing: { message: v.difficultyRationaleMissing, fieldId: "field-rationale" },
    explanation_missing: { message: v.explanationMissing, fieldId: "field-explanation" },
    options_too_few: { message: v.optionsTooFew, fieldId: "options" },
    option_key_duplicate: { message: v.optionKeyDuplicate, fieldId: "options" },
    option_text_missing: { message: v.optionTextMissing, fieldId: "options" },
    option_explanation_missing: { message: v.optionExplanationMissing, fieldId: "options" },
    single_choice_requires_exactly_one_correct_option: {
      message: v.exactlyOneCorrect,
      fieldId: "options",
    },
    multiple_choice_requires_a_correct_option: {
      message: v.atLeastOneCorrect,
      fieldId: "options",
    },
    guided_response_requires_interview_track: {
      message: v.guidedRequiresInterview,
      fieldId: "field-topic",
    },
    guided_response_explanation_not_applicable: {
      message: v.guidedExplanationNotApplicable,
      fieldId: "guided-response",
    },
    guided_response_options_not_applicable: {
      message: v.guidedOptionsNotApplicable,
      fieldId: "guided-response",
    },
    guided_response_criteria_not_applicable: {
      message: v.guidedCriteriaNotApplicable,
      fieldId: "options",
    },
    guided_response_criteria_missing: {
      message: v.guidedCriteriaMissing,
      fieldId: "guided-response",
    },
    guided_reference_answer_missing: {
      message: v.guidedReferenceAnswerMissing,
      fieldId: "guided-reference-answer",
    },
    guided_expected_concepts_missing: {
      message: v.guidedExpectedConceptsMissing,
      fieldId: "guided-concepts",
    },
    guided_required_concept_missing: {
      message: v.guidedRequiredConceptMissing,
      fieldId: "guided-concepts",
    },
    guided_concept_text_missing: {
      message: v.guidedConceptTextMissing,
      fieldId: "guided-concepts",
    },
    guided_common_mistake_invalid: {
      message: v.guidedCommonMistakeInvalid,
      fieldId: "guided-common-mistakes",
    },
    guided_follow_up_invalid: {
      message: v.guidedFollowUpInvalid,
      fieldId: "guided-follow-ups",
    },
    references_missing: { message: v.referencesMissing, fieldId: "references" },
    reference_invalid: { message: v.referenceInvalid, fieldId: "references" },
  };
}

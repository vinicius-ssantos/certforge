package dev.certforge.questionbank.internal;

import dev.certforge.questionbank.Difficulty;
import dev.certforge.questionbank.QuestionType;
import dev.certforge.questionbank.Seniority;
import java.util.List;
import java.util.UUID;

/**
 * The editable content of a revision. Drafts may be incomplete, so most fields are nullable; {@link
 * RevisionRules} decides when the content is complete enough to leave DRAFT.
 */
record RevisionContent(
    QuestionType type,
    UUID topicId,
    Integer javaRelease,
    /** The level this is asked at. Interview questions only; see {@link Seniority}. */
    Seniority seniority,
    Difficulty difficulty,
    String difficultyRationale,
    String prompt,
    String explanation,
    List<Option> options,
    GuidedResponse guidedResponse,
    List<Reference> references) {

  RevisionContent {
    options = options == null ? List.of() : List.copyOf(options);
    references = references == null ? List.of() : List.copyOf(references);
  }

  /**
   * Compatibility constructor for the objective-question shape used throughout the existing pack.
   */
  RevisionContent(
      QuestionType type,
      UUID topicId,
      Integer javaRelease,
      Seniority seniority,
      Difficulty difficulty,
      String difficultyRationale,
      String prompt,
      String explanation,
      List<Option> options,
      List<Reference> references) {
    this(
        type,
        topicId,
        javaRelease,
        seniority,
        difficulty,
        difficultyRationale,
        prompt,
        explanation,
        options,
        null,
        references);
  }

  record Option(String key, String text, boolean correct, String explanation) {}

  /**
   * Reviewed criteria for a free-form interview response. They belong to the revision and become
   * immutable with it; no field here is an automatically-computed correctness score.
   */
  record GuidedResponse(
      String referenceAnswer,
      List<ExpectedConcept> expectedConcepts,
      List<String> commonMistakes,
      List<String> followUps) {

    GuidedResponse {
      expectedConcepts = expectedConcepts == null ? List.of() : List.copyOf(expectedConcepts);
      commonMistakes = commonMistakes == null ? List.of() : List.copyOf(commonMistakes);
      followUps = followUps == null ? List.of() : List.copyOf(followUps);
    }
  }

  record ExpectedConcept(String text, boolean required, String explanation) {}

  record Reference(String title, String url) {}
}

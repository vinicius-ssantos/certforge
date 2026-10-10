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
    List<Reference> references,
    /** What the build compiled and what it printed. Null when the question has no programme. */
    Verification verification) {

  RevisionContent {
    options = options == null ? List.of() : List.copyOf(options);
    references = references == null ? List.of() : List.copyOf(references);
  }

  /**
   * The shape before verification evidence existed: every field but that one.
   *
   * <p>It keeps the many call sites that have nothing to say about evidence compiling unchanged,
   * and it cannot be confused with the objective constructor below — that one has ten arguments and
   * a {@code List<Reference>} where this has eleven and a {@link GuidedResponse}.
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
      GuidedResponse guidedResponse,
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
        guidedResponse,
        references,
        null);
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
        references,
        null);
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

  /**
   * The programme the build compiles and runs for a question, and what it printed.
   *
   * <p>Every source the build sees, not only the file the learner reads: seven questions in the
   * Java pack are a module graph, and for those the single file is the least interesting part. The
   * order is the order the pack lists them in, so the entry point stays first.
   *
   * <p>It is recorded, never executed. The output is a fact the build established at import time;
   * nothing in the running system runs any of this.
   */
  record Verification(List<SourceFile> files, String output) {

    Verification {
      files = files == null ? List.of() : List.copyOf(files);
    }
  }

  record SourceFile(String path, String body) {}
}

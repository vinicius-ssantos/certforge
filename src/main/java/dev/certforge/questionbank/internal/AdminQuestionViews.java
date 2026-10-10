package dev.certforge.questionbank.internal;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Editorial projections. They include the answer key and review data and are never learner-facing.
 */
interface AdminQuestionViews {

  record QuestionView(UUID id, UUID createdBy, List<RevisionView> revisions) {}

  record RevisionView(
      UUID id,
      int number,
      String status,
      String type,
      @Schema(nullable = true) UUID topicId,
      @Schema(nullable = true) Integer javaRelease,
      /** The level an interview question is asked at; absent on a certification question. */
      @Schema(nullable = true) String seniority,
      @Schema(nullable = true) String difficulty,
      @Schema(nullable = true) String difficultyRationale,
      @Schema(nullable = true) String prompt,
      @Schema(nullable = true) String explanation,
      List<OptionView> options,
      @Schema(nullable = true) GuidedResponseView guidedResponse,
      List<ReferenceView> references,
      UUID authorId,
      @Schema(nullable = true) String authorName,
      /**
       * The track version this revision was published against. The field keeps the name {@code
       * examVersionId} on purpose: nothing can be published to a non-certification track until ADR
       * 0016 decision 6 makes the content rules conditional, so today it only ever carries an exam
       * version. Renaming it would be a contract change for a lie that does not exist yet, and
       * belongs with the change that makes it one.
       */
      @Schema(nullable = true) UUID examVersionId,
      Instant createdAt,
      @Schema(nullable = true) Instant submittedAt,
      @Schema(nullable = true) Instant publishedAt,
      @Schema(nullable = true) UUID publishedBy,
      @Schema(nullable = true) String publishedByName,
      @Schema(nullable = true) Instant deprecatedAt,
      List<ReviewView> reviews) {}

  record OptionView(String key, String text, boolean correct, String explanation) {}

  record GuidedResponseView(
      String referenceAnswer,
      List<ExpectedConceptView> expectedConcepts,
      List<String> commonMistakes,
      List<String> followUps) {}

  record ExpectedConceptView(
      String text, boolean required, @Schema(nullable = true) String explanation) {}

  record ReferenceView(String title, String url) {}

  record ReviewView(
      UUID reviewerId,
      @Schema(nullable = true) String reviewerName,
      String decision,
      @Schema(nullable = true) String comment,
      List<String> checklist,
      Instant decidedAt) {}

  /**
   * One page of the editorial queue, with the counts the tabs show.
   *
   * <p>The counts are of everything that matches the search, not of the page, because a tab saying
   * "3" should mean three questions exist in that state rather than three were returned. Counting
   * is the server's job for the same reason paging is: the browser should not have to hold the
   * whole corpus to answer either question.
   */
  record QuestionPage(
      StatusCounts counts, List<QuestionSummary> items, int page, int size, long total) {}

  /** How many questions sit in each state, for the search in force. */
  record StatusCounts(
      int all, int draft, int technicalReview, int approved, int published, int deprecated) {}

  record QuestionSummary(
      UUID id,
      UUID latestRevisionId,
      int latestRevisionNumber,
      String latestStatus,
      @Schema(nullable = true) String prompt,
      @Schema(nullable = true) UUID topicId) {}
}

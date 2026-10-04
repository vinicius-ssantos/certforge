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
      @Schema(nullable = true) String difficulty,
      @Schema(nullable = true) String difficultyRationale,
      @Schema(nullable = true) String prompt,
      @Schema(nullable = true) String explanation,
      List<OptionView> options,
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

  record ReferenceView(String title, String url) {}

  record ReviewView(
      UUID reviewerId,
      @Schema(nullable = true) String reviewerName,
      String decision,
      @Schema(nullable = true) String comment,
      List<String> checklist,
      Instant decidedAt) {}

  record QuestionSummary(
      UUID id,
      UUID latestRevisionId,
      int latestRevisionNumber,
      String latestStatus,
      @Schema(nullable = true) String prompt,
      @Schema(nullable = true) UUID topicId) {}
}

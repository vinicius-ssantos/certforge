package dev.certforge.questionbank.internal;

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
      UUID topicId,
      Integer javaRelease,
      String difficulty,
      String difficultyRationale,
      String prompt,
      String explanation,
      List<OptionView> options,
      List<ReferenceView> references,
      UUID authorId,
      UUID examVersionId,
      Instant createdAt,
      Instant submittedAt,
      Instant publishedAt,
      UUID publishedBy,
      Instant deprecatedAt,
      List<ReviewView> reviews) {}

  record OptionView(String key, String text, boolean correct, String explanation) {}

  record ReferenceView(String title, String url) {}

  record ReviewView(UUID reviewerId, String decision, String comment, Instant decidedAt) {}

  record QuestionSummary(
      UUID id,
      UUID latestRevisionId,
      int latestRevisionNumber,
      String latestStatus,
      String prompt,
      UUID topicId) {}
}

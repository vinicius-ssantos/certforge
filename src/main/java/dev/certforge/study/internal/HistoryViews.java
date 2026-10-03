package dev.certforge.study.internal;

import dev.certforge.preparationcatalog.PreparationTrackId;
import dev.certforge.preparationcatalog.TopicId;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Learner history projections. Everything here belongs to one learner and describes answers that
 * were already accepted, so the answer key and explanations may be shown.
 */
interface HistoryViews {

  record SessionHistoryItem(
      UUID id,
      TopicId topicId,
      String status,
      int requestedCount,
      int answeredCount,
      int correctCount,
      Instant createdAt,
      @Schema(nullable = true) Instant closedAt) {}

  record AttemptHistoryItem(
      UUID id,
      UUID sessionId,
      int position,
      TopicId topicId,
      Instant submittedAt,
      List<String> selectedOptions,
      boolean correct,
      String confidence,
      long elapsedMillis,
      HistoricalQuestion question) {}

  /**
   * One terminal mock run. Aggregate score and per-topic evidence are separate from ordinary
   * practice progress and never feed the progress projection.
   */
  record MockExamHistoryItem(
      UUID id,
      PreparationTrackId trackId,
      String status,
      int total,
      int answered,
      int correct,
      int percentage,
      int passingPercentage,
      boolean passed,
      long elapsedSeconds,
      Instant createdAt,
      Instant closedAt,
      List<MockExamViews.TopicResult> topics) {}

  /** The exact revision the learner answered, even if it has since been replaced. */
  record HistoricalQuestion(
      UUID revisionId,
      int revisionNumber,
      String revisionStatus,
      String type,
      String prompt,
      String explanation,
      List<HistoricalOption> options,
      List<HistoricalReference> references) {}

  record HistoricalOption(String key, String text, boolean correct, String explanation) {}

  record HistoricalReference(String title, String url) {}
}

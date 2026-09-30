package dev.certforge.study.internal;

import dev.certforge.preparationcatalog.TopicId;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Learner history projections. Everything here belongs to one learner and describes answers that
 * were already accepted, so the answer key and explanations may be shown.
 */
interface HistoryViews {

  /** One page of results and, when there are more, the cursor of the next page. */
  record Page<T>(List<T> items, String nextCursor) {}

  record SessionHistoryItem(
      UUID id,
      TopicId topicId,
      String status,
      int requestedCount,
      int answeredCount,
      int correctCount,
      Instant createdAt,
      Instant closedAt) {}

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

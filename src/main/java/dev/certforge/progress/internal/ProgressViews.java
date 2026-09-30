package dev.certforge.progress.internal;

import dev.certforge.preparationcatalog.TopicId;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

/**
 * Progress projections. They hold counts, an accuracy derived from them, and a timestamp. There is
 * deliberately no readiness, mastery or prediction field.
 */
interface ProgressViews {

  /**
   * Progress of one learner in one topic. {@code accuracy} is {@code correct / attempted} to four
   * decimals, or {@code null} while nothing has been attempted.
   */
  record TopicProgress(
      TopicId topicId,
      String topicName,
      String trackSlug,
      int attempted,
      int correct,
      int incorrect,
      BigDecimal accuracy,
      Instant lastActivityAt) {}

  record CountsView(int attempted, int correct, Instant lastActivityAt) {}

  /** A topic where the stored projection differs from what the attempts say it should be. */
  record Difference(TopicId topicId, CountsView expected, CountsView stored) {}

  record Reconciliation(boolean consistent, List<Difference> differences) {}

  /** {@code corrected} is the number of topics whose stored row was wrong and has been replaced. */
  record RebuildResult(int topics, int corrected) {}
}

package dev.certforge.review.internal;

import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.questionbank.QuestionId;
import dev.certforge.questionbank.QuestionRevisionId;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;

/**
 * The review queue as a learner receives it.
 *
 * <p>There is deliberately no priority score, no readiness and no mastery: the order is the answer,
 * and the reason says why (ADR 0013). Each item carries the evidence that put it there, so a
 * learner can check the claim rather than take it.
 */
interface ReviewViews {

  /**
   * One question worth revisiting. {@code revisionId} is the revision published now, which may be a
   * correction of the one that was answered.
   */
  record QueueItem(
      QuestionId questionId,
      QuestionRevisionId revisionId,
      TopicId topicId,
      @Schema(nullable = true) String topicName,
      String prompt,
      ReviewReason reason,
      Instant lastAttemptedAt,
      int timesAttempted,
      int timesWrong,
      boolean lastAnswerCorrect) {}

  /**
   * {@code dueNow} is what the queue holds. {@code waiting} counts questions answered correctly and
   * confidently whose recall interval has not elapsed, so an empty queue can say "nothing is due
   * yet" rather than "you have nothing to review".
   */
  record Queue(List<QueueItem> items, int dueNow, int waiting, int neverAttempted) {}
}

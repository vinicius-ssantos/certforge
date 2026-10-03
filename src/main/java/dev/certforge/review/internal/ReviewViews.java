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

  /**
   * Where a learner has been wrong while saying they were confident, per topic.
   *
   * <p>{@code attempts} and {@code questions} are both here because they mean different things:
   * three confident wrong answers to one question is one misconception being repeated, and three to
   * three questions is a weak area. A single number could not tell those apart.
   *
   * <p>It is evidence, not a prediction. Nothing here says whether anyone is ready for an exam.
   */
  record Misconception(
      TopicId topicId,
      @Schema(nullable = true) String topicName,
      int attempts,
      int questions,
      Instant lastAt) {}
}

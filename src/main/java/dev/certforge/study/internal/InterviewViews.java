package dev.certforge.study.internal;

import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.questionbank.PublishedQuestion;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Learner-facing projections for interview sessions.
 *
 * <p>An item is objective or guided, and the view says which through the question's own type. The
 * two are answered by the same endpoint and come back as different shapes, because the evaluation
 * is not the same: an objective answer is right or wrong, and a guided one is not evaluated at all
 * (ADR 0019).
 */
interface InterviewViews {

  record InterviewSessionView(
      UUID id,
      UUID trackVersionId,
      String status,
      int requestedCount,
      Instant createdAt,
      Instant expiresAt,
      @Schema(nullable = true) Instant closedAt,
      List<InterviewItemView> items) {}

  /** One item of a session. Carries no answer material: that arrives after it is answered. */
  record InterviewItemView(
      int position, TopicId topicId, PublishedQuestion question, boolean answered) {}

  record InterviewSessionSummary(
      UUID id,
      UUID trackVersionId,
      String status,
      int itemCount,
      int answeredCount,
      Instant createdAt,
      Instant expiresAt,
      @Schema(nullable = true) Instant closedAt) {}

  /**
   * What comes back when an item is answered.
   *
   * <p>Exactly one of {@code objective} and {@code guided} is present, decided by the item, not by
   * the request. A client that reads the wrong one finds null rather than a zero or an empty list
   * that could be mistaken for a verdict.
   */
  record InterviewAnswerView(
      int position,
      UUID revisionId,
      String itemKind,
      String confidence,
      long elapsedMillis,
      Instant submittedAt,
      @Schema(nullable = true) ObjectiveOutcome objective,
      @Schema(nullable = true) GuidedOutcome guided) {}

  /** The outcome of an objective item: the same material a study attempt returns. */
  record ObjectiveOutcome(
      List<String> selectedOptions,
      boolean correct,
      List<String> correctOptions,
      String explanation,
      List<OptionAnswerView> options,
      List<ReferenceView> references) {}

  /**
   * The outcome of a guided item, which is not an outcome in the scoring sense: what a reviewer
   * would answer, the concepts they expected, the mistakes people make, and what they would ask
   * next. There is no field here for a score, and that is the point — ADR 0019 decided that nothing
   * about a guided answer is scored, and a record with nowhere to put a number cannot drift into
   * putting one there.
   */
  record GuidedOutcome(
      String referenceAnswer,
      List<ExpectedConceptView> expectedConcepts,
      List<String> commonMistakes,
      List<String> followUps) {}

  record ExpectedConceptView(String text, boolean required, @Schema(nullable = true) String explanation) {}

  record OptionAnswerView(String key, String text, boolean correct, @Schema(nullable = true) String explanation) {}

  record ReferenceView(String title, String url) {}
}

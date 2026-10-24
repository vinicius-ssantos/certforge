package dev.certforge.study.internal;

import dev.certforge.preparationcatalog.TopicId;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * What interview practice has shown, per topic, with the evidence behind every number.
 *
 * <p>There is deliberately no readiness percentage, no overall score and no probability of
 * anything. #23 asks for that absence in so many words — no hiring score, no employability score,
 * no unverifiable probability — and the shape of these records is how it is kept: there is no field
 * for a verdict to live in, so none can be added by accident.
 *
 * <p>Every count here is a count of rows a learner created, and every signal carries the ids of
 * those rows so they can be read back. "You were sure and wrong three times" is a list of three
 * responses, not an assessment.
 */
interface InterviewEvidenceViews {

  /**
   * @param topics one entry per topic the learner has practised; topics never practised are absent
   *     rather than reported as zero, because no evidence is different from evidence of nothing
   */
  record InterviewEvidenceView(UUID trackVersionId, List<TopicEvidenceView> topics) {}

  /**
   * One topic's evidence.
   *
   * <p>Objective and guided items are counted separately and never added together: one is graded
   * and the other is not, so a total would be a number with two meanings (ADR 0019).
   */
  record TopicEvidenceView(
      TopicId topicId,
      ObjectiveEvidenceView objective,
      GuidedEvidenceView guided,
      /** The strongest claim this view makes, named rather than reduced to a number. */
      List<EvidenceSignalView> signals) {}

  /**
   * One thing the evidence says, as a name and the counts behind it.
   *
   * <p>A name rather than a sentence, because the first version of this view composed English prose
   * on the server and an interface that is translated ([ADR
   * 0012](../../../../../../docs/adr/0012-interface-language.md)) could not say it in Portuguese.
   * The kind and the figures are the claim; the wording belongs to whoever is reading.
   *
   * <p>Every kind is a restatement of a count the caller can already see and check, never an
   * inference about the learner: {@code SURE_AND_WRONG} with {@code count} 2 is two responses, and
   * their ids are in the payload beside it.
   *
   * @param kind {@code SURE_AND_WRONG}, {@code UNSURE_AND_RIGHT}, {@code CONCEPT_MARKED_MISSED},
   *     {@code GUIDED_PRACTISED_WITH_NO_MISSES} or {@code PRACTISED_NOTHING_TO_SINGLE_OUT}
   * @param count the number behind the claim: responses, or times a concept was marked
   * @param concept the reviewer's own wording for the concept, for the kinds that name one
   */
  record EvidenceSignalView(String kind, int count, @Schema(nullable = true) String concept) {}

  /**
   * Objective items, which are graded.
   *
   * <p>{@code sureAndWrong} and {@code unsureAndRight} are the two that matter and the two a single
   * accuracy figure hides: being confidently wrong is a different problem from guessing correctly,
   * and both are visible here with the responses behind them.
   */
  record ObjectiveEvidenceView(
      int answered,
      int correct,
      List<UUID> sureAndWrong,
      List<UUID> unsureAndRight,
      @Schema(nullable = true) Instant lastAnsweredAt) {}

  /**
   * Guided items, which nothing grades.
   *
   * <p>{@code practised} is how many were answered. {@code conceptsMarkedMissed} counts, per
   * concept, the times the learner said their own answer did not cover it — their statement, not a
   * measurement, which is why the field name says marked.
   */
  record GuidedEvidenceView(
      int practised,
      List<ConceptMarkView> conceptsMarkedMissed,
      @Schema(nullable = true) Instant lastPractisedAt) {}

  /**
   * One expected concept the learner has marked as not covered, and how often.
   *
   * <p>Carries the responses so the learner can re-read the question and what the reviewer expected
   * rather than taking the count on trust.
   */
  record ConceptMarkView(
      UUID revisionId, int conceptPosition, String text, int times, List<UUID> responses) {}
}

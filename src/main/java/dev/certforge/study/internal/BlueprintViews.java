package dev.certforge.study.internal;

import dev.certforge.preparationcatalog.TopicId;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * A job description turned into weighted preparation, with every weight traceable to a word.
 *
 * <p>What is deliberately absent: any statement about the learner. No fit, no readiness for the
 * role, no probability of an offer, and nothing about experience they have or lack. #22 defers
 * hiring predictions and this is where one would have crept in — a blueprint says what the advert
 * asks for, never what the person is.
 */
interface BlueprintViews {

  record BlueprintView(
      UUID id,
      UUID trackVersionId,
      @Schema(nullable = true) String jobTitle,
      Instant createdAt,
      List<BlueprintTopicView> topics,
      /**
       * Requirements the dictionary did not recognise, kept and shown. #22 asks that an unknown
       * technology be surfaced rather than silently guessed, and this is the surface: the learner
       * sees what was not understood and can weigh the topic themselves.
       */
      List<String> unrecognisedRequirements) {}

  /**
   * One topic's weight and where it came from.
   *
   * @param source {@code MATCHED} when words in the description reached this topic — they are in
   *     {@code matchedTerms} — or {@code LEARNER} when the weight is the learner's own decision,
   *     which is never presented as something the description said
   */
  record BlueprintTopicView(
      TopicId topicId, String topicSlug, int weight, String source, List<MatchView> matchedTerms) {}

  /** One phrase that reached a topic, and which input it was read from. */
  record MatchView(String term, String foundIn) {}
}

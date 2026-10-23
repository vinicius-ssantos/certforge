package dev.certforge.preparationcatalog.internal;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/** Administrative projections. They include draft and inactive content. */
interface AdminViews {

  /** The exam-shaped fields are absent for a track that is not a certification. */
  record AdminTrackView(
      UUID id,
      String slug,
      String name,
      String kind,
      String status,
      @Schema(nullable = true) String provider,
      @Schema(nullable = true) String certificationName,
      List<AdminExamVersionView> examVersions,
      List<AdminTopicView> topics) {}

  /**
   * A version of a track. For a certification that is an exam revision and the exam fields are
   * present; for an interview track it is a taxonomy revision and they are not. {@code javaRelease}
   * is boxed for that reason -- a primitive would have unboxed a null into a claim that the version
   * targets Java 0.
   */
  record AdminExamVersionView(
      UUID id,
      String label,
      @Schema(nullable = true) String examCode,
      @Schema(nullable = true) String examName,
      @Schema(nullable = true) Integer javaRelease,
      @Schema(nullable = true) String objectivesUrl,
      String status,
      List<AdminMappingView> topics,
      /** What someone read off the provider's page, or null while nobody has read it. */
      @Schema(nullable = true) AdminObjectiveSnapshotView verifiedObjectives,
      /**
       * Whether this version's objectives can be relied on, as one word rather than as the absence
       * of an object: {@code UNVERIFIED} when nobody has read the provider's page, otherwise what
       * the reading says about itself — {@code VERIFIED}, {@code STALE} when the provider has moved
       * on, {@code RETIRED} when the exam is gone. {@code NOT_A_CERTIFICATION} for a taxonomy
       * version, which has no provider page to read.
       *
       * <p>#177 asks for a mechanism that flags profiles with unverified or outdated objectives.
       * This is it, and it flags rather than refuses: the Java SE 21 exam has been active for two
       * releases without a reading, so refusing to activate an unverified version would have locked
       * the one track this project ships out of being re-activated.
       */
      String objectivesStatus) {}

  /**
   * One reading of a provider's objectives page, with the objectives it found. The digest is of the
   * page as it was read, so that a later reading can be compared with it rather than trusted.
   */
  record AdminObjectiveSnapshotView(
      String providerVersion,
      LocalDate verifiedOn,
      String sourceUrl,
      String sourceDigest,
      String status,
      List<AdminObjectiveView> objectives) {}

  record AdminObjectiveView(String key, String title, @Schema(nullable = true) String sourceRef) {}

  /** {@code objectiveRef} is null for an interview version, which cites no exam objective. */
  record AdminMappingView(
      UUID topicId,
      @Schema(nullable = true) String objectiveRef,
      int position,
      @Schema(nullable = true) Integer weight) {}

  record AdminTopicView(
      UUID id, String slug, String name, @Schema(nullable = true) UUID parentId) {}
}

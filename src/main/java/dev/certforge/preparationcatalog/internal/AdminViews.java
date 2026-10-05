package dev.certforge.preparationcatalog.internal;

import io.swagger.v3.oas.annotations.media.Schema;
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
      List<AdminMappingView> topics) {}

  /** {@code objectiveRef} is null for an interview version, which cites no exam objective. */
  record AdminMappingView(
      UUID topicId,
      @Schema(nullable = true) String objectiveRef,
      int position,
      @Schema(nullable = true) Integer weight) {}

  record AdminTopicView(
      UUID id, String slug, String name, @Schema(nullable = true) UUID parentId) {}
}

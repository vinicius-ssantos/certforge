package dev.certforge.preparationcatalog.internal;

import dev.certforge.preparationcatalog.TrackKind;
import java.time.LocalDate;
import java.util.UUID;

/** Persistence rows. They never leave the module. */
interface CatalogRows {

  record TrackRow(
      UUID id,
      String slug,
      String name,
      TrackKind kind,
      CatalogStatus status,
      String provider,
      String certificationName) {}

  /**
   * A track version, with the exam identity beside it rather than inside it.
   *
   * <p>The exam fields are boxed and may be null: a certification version always has them, and an
   * interview version has none, which is what ADR 0016 decision 1 separated. Reading them is a
   * certification-only concern, and {@link #isCertification()} is how a caller says so out loud.
   */
  record TrackVersionRow(
      UUID id,
      UUID trackId,
      String label,
      CatalogStatus status,
      String examCode,
      String examName,
      Integer javaRelease,
      String objectivesUrl) {

    boolean isCertification() {
      return examCode != null;
    }
  }

  record TopicRow(UUID id, UUID trackId, UUID parentId, String slug, String name) {}

  /**
   * What was read off the provider's own page, and when. V17 made this separate from the exam
   * version's identity so that a version can exist before anyone has verified its objectives — the
   * Java SE 21 exam is in exactly that state — and so that re-reading the page is a new snapshot
   * rather than an edit to the exam.
   */
  record ObjectiveSnapshotRow(
      UUID trackVersionId,
      String providerVersion,
      LocalDate verifiedOn,
      String sourceUrl,
      String sourceDigest,
      String status) {}

  /** One objective of a verified snapshot. {@code sourceRef} is where on the page it was read. */
  record ObjectiveRow(UUID trackVersionId, String objectiveKey, String title, String sourceRef) {}

  /**
   * A topic's place in one track version. {@code objectiveRef} is the exam objective it answers and
   * is null for an interview version, which has no published objective to cite; {@code weight} is
   * the canonical expectation, and a job blueprint keeps its own weights elsewhere (ADR 0016).
   */
  record MappingRow(
      UUID trackVersionId, UUID topicId, String objectiveRef, int position, Integer weight) {}
}

package dev.certforge.preparationcatalog.internal;

import dev.certforge.preparationcatalog.TrackKind;
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

  record ExamVersionRow(
      UUID id,
      UUID trackId,
      String label,
      String examCode,
      String examName,
      int javaRelease,
      String objectivesUrl,
      CatalogStatus status) {}

  record TopicRow(UUID id, UUID trackId, UUID parentId, String slug, String name) {}

  record MappingRow(UUID examVersionId, UUID topicId, String objectiveRef, int position) {}
}

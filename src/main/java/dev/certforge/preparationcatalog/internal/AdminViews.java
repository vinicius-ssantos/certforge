package dev.certforge.preparationcatalog.internal;

import java.util.List;
import java.util.UUID;

/** Administrative projections. They include draft and inactive content. */
interface AdminViews {

  record AdminTrackView(
      UUID id,
      String slug,
      String name,
      String kind,
      String status,
      String provider,
      String certificationName,
      List<AdminExamVersionView> examVersions,
      List<AdminTopicView> topics) {}

  record AdminExamVersionView(
      UUID id,
      String label,
      String examCode,
      String examName,
      int javaRelease,
      String objectivesUrl,
      String status,
      List<AdminMappingView> topics) {}

  record AdminMappingView(UUID topicId, String objectiveRef, int position) {}

  record AdminTopicView(UUID id, String slug, String name, UUID parentId) {}
}

package dev.certforge.preparationcatalog.internal;

import dev.certforge.preparationcatalog.internal.AdminViews.AdminExamVersionView;
import dev.certforge.preparationcatalog.internal.AdminViews.AdminMappingView;
import dev.certforge.preparationcatalog.internal.AdminViews.AdminTopicView;
import dev.certforge.preparationcatalog.internal.AdminViews.AdminTrackView;
import dev.certforge.preparationcatalog.internal.CatalogRows.ExamVersionRow;
import dev.certforge.preparationcatalog.internal.CatalogRows.MappingRow;
import dev.certforge.preparationcatalog.internal.CatalogRows.TopicRow;
import dev.certforge.preparationcatalog.internal.CatalogRows.TrackRow;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Controlled catalog commands. Every rule that protects catalog integrity lives here so it holds
 * regardless of the caller. Each command returns the updated view of the affected track.
 */
@Service
class CatalogAdminService {

  static final Pattern SLUG = Pattern.compile("^[a-z0-9]+(-[a-z0-9]+)*$");

  private final CatalogRepository repository;

  CatalogAdminService(CatalogRepository repository) {
    this.repository = repository;
  }

  // ---- reads ---------------------------------------------------------------------------------

  @Transactional(readOnly = true)
  List<AdminTrackView> listTracks() {
    return repository.findAllTracks().stream().map(this::view).toList();
  }

  @Transactional(readOnly = true)
  AdminTrackView getTrack(UUID trackId) {
    return view(track(trackId));
  }

  // ---- track lifecycle -----------------------------------------------------------------------

  @Transactional
  AdminTrackView createTrack(String slug, String name, String provider, String certificationName) {
    requireSlug(slug);
    UUID id = UUID.randomUUID();
    repository.insertTrack(id, slug, name.trim(), provider.trim(), certificationName.trim());
    return getTrack(id);
  }

  @Transactional
  AdminTrackView activateTrack(UUID trackId) {
    TrackRow track = track(trackId);
    if (track.status() != CatalogStatus.ACTIVE) {
      repository.setTrackStatus(trackId, CatalogStatus.ACTIVE);
    }
    return getTrack(trackId);
  }

  @Transactional
  AdminTrackView deactivateTrack(UUID trackId) {
    TrackRow track = track(trackId);
    if (track.status() == CatalogStatus.DRAFT) {
      throw CatalogException.conflict(
          "invalid_status_transition", "A draft track cannot be deactivated");
    }
    repository.setTrackStatus(trackId, CatalogStatus.INACTIVE);
    return getTrack(trackId);
  }

  // ---- exam versions -------------------------------------------------------------------------

  @Transactional
  AdminTrackView createExamVersion(
      UUID trackId,
      String label,
      String examCode,
      String examName,
      int javaRelease,
      String objectivesUrl) {
    track(trackId);
    repository.insertExamVersion(
        new ExamVersionRow(
            UUID.randomUUID(),
            trackId,
            label.trim(),
            examCode.trim(),
            examName.trim(),
            javaRelease,
            objectivesUrl.trim(),
            CatalogStatus.DRAFT));
    return getTrack(trackId);
  }

  /**
   * Replaces the topic mappings of a draft exam version. Active versions are frozen so the taxonomy
   * learners see stays stable; a change requires a new exam version.
   */
  @Transactional
  AdminTrackView setMappings(UUID examVersionId, List<MappingRow> mappings) {
    ExamVersionRow version = examVersion(examVersionId);
    if (version.status() == CatalogStatus.ACTIVE) {
      throw CatalogException.conflict(
          "exam_version_not_editable", "An active exam version cannot change its topics");
    }
    validateMappings(version, mappings);
    repository.replaceMappings(examVersionId, mappings);
    return getTrack(version.trackId());
  }

  @Transactional
  AdminTrackView activateExamVersion(UUID examVersionId) {
    ExamVersionRow version = examVersion(examVersionId);
    if (version.status() == CatalogStatus.ACTIVE) {
      return getTrack(version.trackId());
    }
    if (track(version.trackId()).status() != CatalogStatus.ACTIVE) {
      throw CatalogException.conflict(
          "track_not_active", "Activate the track before activating its exam version");
    }
    if (repository.findMappings(examVersionId).isEmpty()) {
      throw CatalogException.conflict(
          "exam_version_has_no_topics", "An exam version needs at least one topic");
    }
    if (repository.findActiveExamVersion(version.trackId()).isPresent()) {
      throw CatalogException.conflict(
          "active_exam_version_exists",
          "Deactivate the current exam version before activating another");
    }
    repository.setExamVersionStatus(examVersionId, CatalogStatus.ACTIVE);
    return getTrack(version.trackId());
  }

  @Transactional
  AdminTrackView deactivateExamVersion(UUID examVersionId) {
    ExamVersionRow version = examVersion(examVersionId);
    if (version.status() == CatalogStatus.DRAFT) {
      throw CatalogException.conflict(
          "invalid_status_transition", "A draft exam version cannot be deactivated");
    }
    repository.setExamVersionStatus(examVersionId, CatalogStatus.INACTIVE);
    return getTrack(version.trackId());
  }

  // ---- topics --------------------------------------------------------------------------------

  @Transactional
  AdminTrackView createTopic(UUID trackId, String slug, String name, UUID parentId) {
    track(trackId);
    requireSlug(slug);
    if (parentId != null) {
      TopicRow parent =
          repository
              .findTopic(parentId)
              .orElseThrow(() -> CatalogException.notFound("topic_not_found", "Topic not found"));
      if (!parent.trackId().equals(trackId)) {
        throw CatalogException.invalid("topic_not_in_track", "The parent belongs to another track");
      }
      if (parent.parentId() != null) {
        throw CatalogException.invalid(
            "topic_too_deep", "Subtopics cannot have their own subtopics");
      }
    }
    repository.insertTopic(new TopicRow(UUID.randomUUID(), trackId, parentId, slug, name.trim()));
    return getTrack(trackId);
  }

  /** Corrects the display name only. The id and slug never change. */
  @Transactional
  AdminTrackView renameTopic(UUID topicId, String name) {
    TopicRow topic =
        repository
            .findTopic(topicId)
            .orElseThrow(() -> CatalogException.notFound("topic_not_found", "Topic not found"));
    repository.renameTopic(topicId, name.trim());
    return getTrack(topic.trackId());
  }

  // ---- internals -----------------------------------------------------------------------------

  private void validateMappings(ExamVersionRow version, List<MappingRow> mappings) {
    Set<UUID> topicIds = new HashSet<>();
    Set<Integer> positions = new HashSet<>();
    for (MappingRow mapping : mappings) {
      if (!topicIds.add(mapping.topicId())) {
        throw CatalogException.invalid("duplicate_topic", "A topic is mapped more than once");
      }
      if (!positions.add(mapping.position())) {
        throw CatalogException.invalid("duplicate_position", "Two topics share a position");
      }
    }
    for (MappingRow mapping : mappings) {
      TopicRow topic =
          repository
              .findTopic(mapping.topicId())
              .orElseThrow(() -> CatalogException.notFound("topic_not_found", "Topic not found"));
      if (!topic.trackId().equals(version.trackId())) {
        throw CatalogException.invalid(
            "topic_not_in_track", "A mapped topic belongs to another track");
      }
      if (topic.parentId() != null && !topicIds.contains(topic.parentId())) {
        throw CatalogException.invalid(
            "parent_topic_not_mapped", "A subtopic requires its parent topic to be mapped");
      }
    }
  }

  private static void requireSlug(String slug) {
    if (slug == null || slug.length() > 64 || !SLUG.matcher(slug).matches()) {
      throw CatalogException.invalid(
          "invalid_slug", "Slug must be lowercase letters, digits and hyphens (max 64)");
    }
  }

  private TrackRow track(UUID id) {
    return repository
        .findTrack(id)
        .orElseThrow(() -> CatalogException.notFound("track_not_found", "Track not found"));
  }

  private ExamVersionRow examVersion(UUID id) {
    return repository
        .findExamVersion(id)
        .orElseThrow(
            () -> CatalogException.notFound("exam_version_not_found", "Exam version not found"));
  }

  private AdminTrackView view(TrackRow track) {
    List<AdminExamVersionView> versions =
        repository.findExamVersions(track.id()).stream()
            .map(
                version ->
                    new AdminExamVersionView(
                        version.id(),
                        version.label(),
                        version.examCode(),
                        version.examName(),
                        version.javaRelease(),
                        version.objectivesUrl(),
                        version.status().name(),
                        repository.findMappings(version.id()).stream()
                            .map(
                                m ->
                                    new AdminMappingView(
                                        m.topicId(), m.objectiveRef(), m.position()))
                            .toList()))
            .toList();
    List<AdminTopicView> topics =
        repository.findTopics(track.id()).stream()
            .map(t -> new AdminTopicView(t.id(), t.slug(), t.name(), t.parentId()))
            .toList();
    return new AdminTrackView(
        track.id(),
        track.slug(),
        track.name(),
        track.kind().name(),
        track.status().name(),
        track.provider(),
        track.certificationName(),
        versions,
        topics);
  }
}

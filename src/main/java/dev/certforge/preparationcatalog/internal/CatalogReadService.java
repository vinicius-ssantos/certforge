package dev.certforge.preparationcatalog.internal;

import dev.certforge.preparationcatalog.ExamVersionView;
import dev.certforge.preparationcatalog.PreparationCatalog;
import dev.certforge.preparationcatalog.PreparationTrackId;
import dev.certforge.preparationcatalog.TopicContext;
import dev.certforge.preparationcatalog.TopicId;
import dev.certforge.preparationcatalog.TopicView;
import dev.certforge.preparationcatalog.TrackKind;
import dev.certforge.preparationcatalog.TrackVersionId;
import dev.certforge.preparationcatalog.TrackView;
import dev.certforge.preparationcatalog.internal.CatalogRows.MappingRow;
import dev.certforge.preparationcatalog.internal.CatalogRows.TopicRow;
import dev.certforge.preparationcatalog.internal.CatalogRows.TrackRow;
import dev.certforge.preparationcatalog.internal.CatalogRows.TrackVersionRow;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Learner-facing reads. Only active content of active tracks is ever returned. */
@Service
@Transactional(readOnly = true)
class CatalogReadService implements PreparationCatalog {

  private final CatalogRepository repository;

  CatalogReadService(CatalogRepository repository) {
    this.repository = repository;
  }

  @Override
  public List<TrackView> activeTracks() {
    return repository.findTracks(CatalogStatus.ACTIVE).stream()
        .map(this::toView)
        .flatMap(Optional::stream)
        .toList();
  }

  @Override
  public Optional<TrackView> activeTrack(String slug) {
    return repository.findActiveTrackBySlug(slug).flatMap(this::toView);
  }

  @Override
  public Optional<TopicView> findActiveTopic(TopicId id) {
    return repository
        .findActiveTopic(id.value())
        .flatMap(row -> repository.findTrack(row.trackId()))
        .flatMap(this::toView)
        .flatMap(track -> find(track.topics(), id));
  }

  /**
   * Read straight from the mapping rather than by building a learner track view and taking an id
   * out of it. The view is certification-shaped -- it names an exam -- so going through it was what
   * made an interview topic produce no context at all (ADR 0016).
   */
  @Override
  public Optional<TopicContext> findActiveTopicContext(TopicId id) {
    return repository
        .findActiveTopicContextRow(id.value())
        .map(
            row ->
                new TopicContext(
                    new TopicId(row.topicId()),
                    new PreparationTrackId(row.trackId()),
                    new TrackVersionId(row.versionId()),
                    row.kind(),
                    row.javaRelease()));
  }

  @Override
  public Optional<TrackKind> findTrackKindOfTopic(TopicId id) {
    return repository.findTrackKindOfTopic(id.value());
  }

  private Optional<TrackView> toView(TrackRow track) {
    return repository
        .findActiveExamVersion(track.id())
        // A learner track view names an exam, so a version without one cannot produce it. Today
        // only certification tracks are served, and this is what keeps that true by construction
        // rather than by unboxing a null into a Java release of 0.
        .filter(TrackVersionRow::isCertification)
        .map(
            version ->
                new TrackView(
                    new PreparationTrackId(track.id()),
                    track.slug(),
                    track.name(),
                    track.kind(),
                    track.provider(),
                    track.certificationName(),
                    toView(version),
                    topicTree(track.id(), version.id())));
  }

  /** Only called for a version that {@link TrackVersionRow#isCertification()} vouched for. */
  private static ExamVersionView toView(TrackVersionRow version) {
    return new ExamVersionView(
        new TrackVersionId(version.id()),
        version.label(),
        version.examCode(),
        version.examName(),
        version.javaRelease(),
        version.objectivesUrl());
  }

  /** Builds the ordered topic tree of an exam version from its explicit mappings. */
  private List<TopicView> topicTree(UUID trackId, UUID examVersionId) {
    Map<UUID, TopicRow> topics = new HashMap<>();
    for (TopicRow topic : repository.findTopics(trackId)) {
      topics.put(topic.id(), topic);
    }
    List<MappingRow> roots = new ArrayList<>();
    Map<UUID, List<MappingRow>> children = new HashMap<>();
    for (MappingRow mapping : repository.findMappings(examVersionId)) {
      UUID parentId = topics.get(mapping.topicId()).parentId();
      if (parentId == null) {
        roots.add(mapping);
      } else {
        children.computeIfAbsent(parentId, k -> new ArrayList<>()).add(mapping);
      }
    }
    return roots.stream().map(mapping -> node(mapping, topics, children)).toList();
  }

  private static TopicView node(
      MappingRow mapping, Map<UUID, TopicRow> topics, Map<UUID, List<MappingRow>> children) {
    TopicRow topic = topics.get(mapping.topicId());
    List<TopicView> subtopics =
        children.getOrDefault(topic.id(), List.of()).stream()
            .map(child -> node(child, topics, children))
            .toList();
    return new TopicView(
        new TopicId(topic.id()), topic.slug(), topic.name(), mapping.objectiveRef(), subtopics);
  }

  private static Optional<TopicView> find(List<TopicView> views, TopicId id) {
    for (TopicView view : views) {
      if (view.id().equals(id)) {
        return Optional.of(view);
      }
      Optional<TopicView> nested = find(view.subtopics(), id);
      if (nested.isPresent()) {
        return nested;
      }
    }
    return Optional.empty();
  }
}

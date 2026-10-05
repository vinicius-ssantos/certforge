package dev.certforge.preparationcatalog.internal;

import dev.certforge.preparationcatalog.internal.CatalogRows.MappingRow;
import dev.certforge.preparationcatalog.internal.CatalogRows.TopicRow;
import dev.certforge.preparationcatalog.internal.CatalogRows.TrackVersionRow;
import dev.certforge.preparationcatalog.internal.EditorialViews.AuthorableTopic;
import dev.certforge.preparationcatalog.internal.EditorialViews.AuthorableTrack;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Reads the catalog as an author needs it: every topic a question may be written for. */
@Service
class EditorialCatalogService {

  private final CatalogRepository repository;

  EditorialCatalogService(CatalogRepository repository) {
    this.repository = repository;
  }

  @Transactional(readOnly = true)
  List<AuthorableTrack> authorableTracks() {
    return repository.findAllTracks().stream()
        .filter(track -> track.status() != CatalogStatus.INACTIVE)
        .sorted(Comparator.comparing(CatalogRows.TrackRow::slug))
        .map(
            track ->
                new AuthorableTrack(
                    track.id(),
                    track.slug(),
                    track.name(),
                    track.kind().name(),
                    track.status().name(),
                    topicsOf(track.id())))
        .toList();
  }

  /**
   * The track's topics in reading order, nested depth first.
   *
   * <p>Order comes from the mappings of the version a question would be published against: the
   * active one if the track has one, otherwise the draft it is being prepared as. A topic the
   * version does not map is still listed, after the mapped ones, because it exists on the track and
   * an author may legitimately write for it before it is mapped -- publishing is where being
   * unmapped is refused, not authoring.
   */
  private List<AuthorableTopic> topicsOf(UUID trackId) {
    Map<UUID, Integer> order = positions(trackId);
    Map<UUID, String> objectives = objectives(trackId);
    List<TopicRow> topics = repository.findTopics(trackId);

    Map<UUID, List<TopicRow>> children = new HashMap<>();
    List<TopicRow> roots = new ArrayList<>();
    for (TopicRow topic : topics) {
      if (topic.parentId() == null) {
        roots.add(topic);
      } else {
        children.computeIfAbsent(topic.parentId(), key -> new ArrayList<>()).add(topic);
      }
    }

    List<AuthorableTopic> flat = new ArrayList<>();
    appendSorted(roots, children, order, objectives, 0, flat);
    return flat;
  }

  private void appendSorted(
      List<TopicRow> siblings,
      Map<UUID, List<TopicRow>> children,
      Map<UUID, Integer> order,
      Map<UUID, String> objectives,
      int depth,
      List<AuthorableTopic> into) {
    // Mapped topics first, in the version's order; then the unmapped ones, by slug, so the list is
    // stable rather than dependent on what the database happens to return.
    //
    // A copy, because the leaf case is handed List.of(), which cannot be sorted in place. Sorting
    // the caller's list would also be a side effect this method has no business having.
    List<TopicRow> ordered = new ArrayList<>(siblings);
    ordered.sort(
        Comparator.<TopicRow, Integer>comparing(
                topic -> order.getOrDefault(topic.id(), Integer.MAX_VALUE))
            .thenComparing(TopicRow::slug));
    for (TopicRow topic : ordered) {
      into.add(
          new AuthorableTopic(
              topic.id(), topic.slug(), topic.name(), depth, objectives.get(topic.id())));
      appendSorted(
          children.getOrDefault(topic.id(), List.of()),
          children,
          order,
          objectives,
          depth + 1,
          into);
    }
  }

  private Map<UUID, Integer> positions(UUID trackId) {
    Map<UUID, Integer> order = new HashMap<>();
    relevantVersion(trackId)
        .ifPresent(
            version ->
                repository
                    .findMappings(version.id())
                    .forEach(mapping -> order.put(mapping.topicId(), mapping.position())));
    return order;
  }

  private Map<UUID, String> objectives(UUID trackId) {
    Map<UUID, String> refs = new HashMap<>();
    relevantVersion(trackId)
        .ifPresent(
            version -> {
              for (MappingRow mapping : repository.findMappings(version.id())) {
                if (mapping.objectiveRef() != null) {
                  refs.put(mapping.topicId(), mapping.objectiveRef());
                }
              }
            });
    return refs;
  }

  /** The version a question written now would be published against. */
  private Optional<TrackVersionRow> relevantVersion(UUID trackId) {
    List<TrackVersionRow> versions = repository.findExamVersions(trackId);
    return versions.stream()
        .filter(version -> version.status() == CatalogStatus.ACTIVE)
        .findFirst()
        .or(
            () ->
                versions.stream()
                    .filter(version -> version.status() == CatalogStatus.DRAFT)
                    .findFirst());
  }
}

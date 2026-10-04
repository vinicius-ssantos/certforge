package dev.certforge.preparationcatalog;

import java.util.List;
import java.util.Optional;

/**
 * Read contract of the preparation catalog for other modules. It only ever returns active content;
 * administrative state stays inside the module.
 */
public interface PreparationCatalog {

  /** All active tracks that have an active exam version, in a stable order. */
  List<TrackView> activeTracks();

  /** The active track with the given slug. */
  Optional<TrackView> activeTrack(String slug);

  /** The topic if it is part of the active exam version of an active track. */
  Optional<TopicView> findActiveTopic(TopicId id);

  /** The publishing context of an active topic, or empty if it is not active. */
  Optional<TopicContext> findActiveTopicContext(TopicId id);

  /**
   * What kind of preparation the topic's track is, whatever state either is in.
   *
   * <p>Separate from {@link #findActiveTopicContext(TopicId)} on purpose: the completeness rules of
   * a revision depend on the kind, and they are checked while the question is still a draft on a
   * topic that may not be mapped into any active version yet. Asking for the context there would
   * refuse perfectly ordinary drafts.
   */
  Optional<TrackKind> findTrackKindOfTopic(TopicId id);
}

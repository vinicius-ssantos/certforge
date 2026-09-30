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
}

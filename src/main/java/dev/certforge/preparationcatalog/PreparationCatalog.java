package dev.certforge.preparationcatalog;

import java.util.List;
import java.util.Optional;
import java.util.Set;

/**
 * Read contract of the preparation catalog for other modules. It only ever returns active content;
 * administrative state stays inside the module.
 */
public interface PreparationCatalog {

  /** All active tracks that have an active exam version, in a stable order. */
  List<TrackView> activeTracks();

  /** The active track with the given slug. */
  Optional<TrackView> activeTrack(String slug);

  /**
   * The active interview track with the given slug, and the live version of its taxonomy.
   *
   * <p>{@link #activeTrack(String)} cannot answer for one: a {@link TrackView} names an exam and an
   * interview version has none, so that read filters interview tracks out by construction.
   */
  Optional<InterviewTrackView> activeInterviewTrack(String slug);

  /**
   * Every active interview track, each with the live version of its taxonomy.
   *
   * <p>The plural of the read above, and for the same reason: a learner browsing interview
   * preparation cannot find it through {@link #activeTracks()}, which answers only for
   * certifications.
   */
  List<InterviewTrackView> activeInterviewTracks();

  /** The topic if it is part of the active exam version of an active track. */
  Optional<TopicView> findActiveTopic(TopicId id);

  /** The publishing context of an active topic, or empty if it is not active. */
  Optional<TopicContext> findActiveTopicContext(TopicId id);

  /**
   * The objective keys of one exam version's verified snapshot, or empty when nobody has read the
   * provider's page for it.
   *
   * <p>The question bank asks this when publishing a revision that claims an objective: a claim
   * against a page nobody has read, or a key that page does not list, is refused there rather than
   * stored and believed.
   */
  Set<String> verifiedObjectiveKeys(TrackVersionId trackVersionId);

  /**
   * What kind of preparation the topic's track is, whatever state either is in.
   *
   * <p>Separate from {@link #findActiveTopicContext(TopicId)} on purpose: the completeness rules of
   * a revision depend on the kind, and they are checked while the question is still a draft on a
   * topic that may not be mapped into any active version yet. Asking for the context there would
   * refuse perfectly ordinary drafts.
   */
  Optional<TrackKind> findTrackKindOfTopic(TopicId id);

  /**
   * The slug of a topic, whatever kind of track it belongs to and whether or not it is mapped into
   * an active version.
   *
   * <p>{@link #findActiveTopic(TopicId)} cannot answer for an interview topic: it reads through the
   * learner track views, which name an exam and therefore exclude interview tracks. This reads the
   * topic itself, and exists so that something holding a topic id — a blueprint, for instance — can
   * name it without knowing what kind of track it came from.
   */
  Optional<String> findTopicSlug(TopicId id);
}

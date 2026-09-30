package dev.certforge.preparationcatalog;

import java.util.List;

/**
 * Learner-visible catalog entry: an active certification track with its active exam version and
 * ordered topics. Draft and inactive content is never represented by this type.
 */
public record TrackView(
    PreparationTrackId id,
    String slug,
    String name,
    TrackKind kind,
    String provider,
    String certificationName,
    ExamVersionView examVersion,
    List<TopicView> topics) {}

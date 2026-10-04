package dev.certforge.preparationcatalog;

import java.util.Objects;
import java.util.Optional;

/**
 * Where an active topic lives: its track, the kind of preparation that track is, and the active
 * track version it is mapped in. Content is bound to this context when it is published.
 *
 * <p>{@code javaRelease} is the release the version's exam targets, which only a certification has.
 * ADR 0016 rejected making it blindly nullable, because a null would then mean "interview" only to
 * a reader who already knew that. So the kind is carried explicitly and the constructor enforces
 * the relationship: a certification context always has a release, and an interview context never
 * does. Callers read it through {@link #javaRelease()}, which cannot be mistaken for a number.
 */
public record TopicContext(
    TopicId topicId,
    PreparationTrackId trackId,
    TrackVersionId trackVersionId,
    TrackKind kind,
    Integer release) {

  public TopicContext {
    Objects.requireNonNull(topicId, "topicId");
    Objects.requireNonNull(trackId, "trackId");
    Objects.requireNonNull(trackVersionId, "trackVersionId");
    Objects.requireNonNull(kind, "kind");
    if (kind == TrackKind.CERTIFICATION && release == null) {
      throw new IllegalArgumentException("A certification context must carry a Java release");
    }
    if (kind != TrackKind.CERTIFICATION && release != null) {
      throw new IllegalArgumentException("Only a certification context carries a Java release");
    }
  }

  /** The Java release the exam targets, present only for a certification context. */
  public Optional<Integer> javaRelease() {
    return Optional.ofNullable(release);
  }
}

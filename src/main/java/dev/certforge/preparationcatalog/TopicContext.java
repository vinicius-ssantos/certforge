package dev.certforge.preparationcatalog;

/**
 * Where an active topic lives: its track and the active track version it is mapped in. Used to bind
 * content to the context it was approved for.
 *
 * <p>{@code javaRelease} is the release the version's exam targets, and is therefore certification
 * only. It is still required here because only a certification version can hold a mapped topic
 * today: ADR 0016 decision 6, which makes the Java release conditional on the track kind, is a
 * separate change. Until it lands, an interview version produces no context and nothing can be
 * published against it -- which is the behaviour before this type was generalised, not a new limit.
 */
public record TopicContext(
    TopicId topicId, PreparationTrackId trackId, TrackVersionId trackVersionId, int javaRelease) {}

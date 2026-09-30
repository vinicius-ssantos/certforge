package dev.certforge.preparationcatalog;

/**
 * Where an active topic lives: its track and the active exam version it is mapped in, with the Java
 * release that exam targets. Used to bind content to a certification context.
 */
public record TopicContext(
    TopicId topicId, PreparationTrackId trackId, ExamVersionId examVersionId, int javaRelease) {}

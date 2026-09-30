package dev.certforge.preparationcatalog;

import java.util.List;

/**
 * A topic as shown for one exam version, in exam order. {@code objectiveRef} is the certification
 * objective the topic maps to.
 */
public record TopicView(
    TopicId id, String slug, String name, String objectiveRef, List<TopicView> subtopics) {}

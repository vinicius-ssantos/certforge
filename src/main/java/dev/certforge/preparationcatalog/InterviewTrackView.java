package dev.certforge.preparationcatalog;

import java.util.List;

/**
 * An active interview track and the version of its taxonomy that is live, with its topics.
 *
 * <p>Separate from {@link TrackView} because that one names an exam — code, name, Java release,
 * objectives URL — and an interview taxonomy has none of those. ADR 0016 decision 1 kept the exam
 * identity beside a version rather than inside it for exactly this reason, and building a learner
 * track view of an interview track was the thing that could not be done: it filters to versions
 * that carry an exam, by construction, so a null is never unboxed into a Java release of zero.
 *
 * <p>So this is the shape an interview session asks for. It names a taxonomy version and its
 * topics, and nothing about an exam.
 */
public record InterviewTrackView(
    PreparationTrackId id,
    String slug,
    String name,
    TrackVersionId versionId,
    String versionLabel,
    List<TopicView> topics) {

  public InterviewTrackView {
    topics = topics == null ? List.of() : List.copyOf(topics);
  }
}

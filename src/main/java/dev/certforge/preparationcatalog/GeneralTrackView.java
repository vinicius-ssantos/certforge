package dev.certforge.preparationcatalog;

import java.util.List;

/**
 * An active general-knowledge track and the version of its taxonomy that is live, with its topics.
 *
 * <p>The structural twin of {@link InterviewTrackView}, and for the same reason: {@link TrackView}
 * names an exam -- code, name, Java release, objectives URL -- and a general track cites none of
 * those any more than an interview taxonomy does (#176). Kept as its own named type rather than
 * reused under the interview one because the two are different domain concepts that happen to share
 * a shape today; ADR 0016 prefers an explicit type per concept over a generic one conditioned on a
 * kind field, and a future divergence (a general track growing something an interview taxonomy does
 * not need, say) should not have to retrofit a name that was never about it.
 */
public record GeneralTrackView(
    PreparationTrackId id,
    String slug,
    String name,
    TrackVersionId versionId,
    String versionLabel,
    List<TopicView> topics) {

  public GeneralTrackView {
    topics = topics == null ? List.of() : List.copyOf(topics);
  }
}

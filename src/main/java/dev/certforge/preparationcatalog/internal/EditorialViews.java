package dev.certforge.preparationcatalog.internal;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;
import java.util.UUID;

/** What the editorial desk reads from the catalog. */
interface EditorialViews {

  /**
   * A track a question may be written for, with the topics available on it.
   *
   * <p>{@code kind} and {@code status} are included because an author needs to know which taxonomy
   * they are writing for: the same subject appears on a certification track and an interview track
   * as two separate topics on purpose (ADR 0014), and a name alone does not say which is which.
   */
  record AuthorableTrack(
      UUID id,
      String slug,
      String name,
      String kind,
      String status,
      List<AuthorableTopic> topics) {}

  /**
   * A topic, with its depth so a flat list can be indented without the client rebuilding the tree.
   *
   * <p>{@code objectiveRef} is the exam objective the topic answers, and is null on an interview
   * track, which cites none. An author reads it to know what the question has to be about.
   */
  record AuthorableTopic(
      UUID id, String slug, String name, int depth, @Schema(nullable = true) String objectiveRef) {}
}

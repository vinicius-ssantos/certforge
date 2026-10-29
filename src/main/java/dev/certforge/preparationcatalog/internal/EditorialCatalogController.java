package dev.certforge.preparationcatalog.internal;

import dev.certforge.preparationcatalog.internal.EditorialViews.AuthorableTrack;
import dev.certforge.preparationcatalog.internal.EditorialViews.ObjectiveSourceView;
import java.util.List;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * What the editorial desk needs from the catalog: the topics a question may be written for.
 *
 * <p>This exists because the question editor was reading the *learner* catalog, which serves only
 * an active track with an active version. That worked for as long as there was exactly one
 * permanently active track, and stopped working the moment a draft track existed: its topics were
 * invisible to the only people who could write content for it. An editor is not a learner, and
 * should not be limited to what a learner can see.
 *
 * <p>Separate from {@link CatalogAdminController} because that requires CATALOG_MANAGE, which an
 * editor has no reason to hold: reading the taxonomy you write against is not administering it.
 */
@RestController
@RequestMapping("/api/editorial/catalog")
@PreAuthorize(
    "hasAnyAuthority('CONTENT_AUTHOR', 'CONTENT_REVIEW', 'CONTENT_PUBLISH', 'CONTENT_AI_REVIEW')")
class EditorialCatalogController {

  private final EditorialCatalogService service;

  EditorialCatalogController(EditorialCatalogService service) {
    this.service = service;
  }

  /**
   * Every track a question may be written for, with its topics in reading order.
   *
   * <p>Draft tracks are included: authoring content is how a track stops being empty, so refusing
   * to show a draft would make the draft state useless. Inactive tracks are excluded, because a
   * retired track is not something new content should be written for.
   */
  @GetMapping("/topics")
  List<AuthorableTrack> topics() {
    return service.authorableTracks();
  }

  /**
   * Where the exam version a question on this topic would publish against had its objectives read,
   * and whether that reading is current (#177). A reviewer judging a question's claimed objective
   * keys reads this beside the question's own references, which are evidence for the answer rather
   * than for the objective. Keyed by topic rather than by exam version id because a revision
   * carries no exam version id until it publishes -- see {@link
   * EditorialCatalogService#objectiveSourcesForTopic}.
   */
  @GetMapping("/topics/{topicId}/objective-sources")
  ObjectiveSourceView objectiveSources(@PathVariable UUID topicId) {
    return service.objectiveSourcesForTopic(topicId);
  }
}

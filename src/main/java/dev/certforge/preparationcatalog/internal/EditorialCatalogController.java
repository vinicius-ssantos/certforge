package dev.certforge.preparationcatalog.internal;

import dev.certforge.preparationcatalog.internal.EditorialViews.AuthorableTrack;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
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
@PreAuthorize("hasAnyAuthority('CONTENT_AUTHOR', 'CONTENT_REVIEW', 'CONTENT_PUBLISH')")
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
}

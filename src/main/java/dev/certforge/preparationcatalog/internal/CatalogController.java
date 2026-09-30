package dev.certforge.preparationcatalog.internal;

import dev.certforge.preparationcatalog.PreparationCatalog;
import dev.certforge.preparationcatalog.TrackView;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Learner catalog. Exposes active certification content only. */
@RestController
@RequestMapping("/api/catalog/tracks")
@PreAuthorize("hasAuthority('STUDY')")
class CatalogController {

  private final PreparationCatalog catalog;

  CatalogController(PreparationCatalog catalog) {
    this.catalog = catalog;
  }

  @GetMapping
  List<TrackView> tracks() {
    return catalog.activeTracks();
  }

  @GetMapping("/{slug}")
  TrackView track(@PathVariable String slug) {
    return catalog
        .activeTrack(slug)
        .orElseThrow(() -> CatalogException.notFound("track_not_found", "Track not found"));
  }
}

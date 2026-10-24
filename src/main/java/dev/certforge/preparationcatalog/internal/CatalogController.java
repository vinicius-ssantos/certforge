package dev.certforge.preparationcatalog.internal;

import dev.certforge.preparationcatalog.GeneralTrackView;
import dev.certforge.preparationcatalog.PreparationCatalog;
import dev.certforge.preparationcatalog.TrackView;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Learner catalog. Exposes active content a learner may study, in the two shapes it comes in: a
 * certification track, which names an exam, and a general-knowledge taxonomy, which does not
 * (#176).
 *
 * <p>They are separate paths rather than one list with a kind field, because the two views carry
 * different things -- an exam version and a Java release on one side, a taxonomy version on the
 * other -- and a single payload would have to make both nullable to say either.
 */
@RestController
@RequestMapping("/api/catalog")
@PreAuthorize("hasAuthority('STUDY')")
class CatalogController {

  private final PreparationCatalog catalog;

  CatalogController(PreparationCatalog catalog) {
    this.catalog = catalog;
  }

  @GetMapping("/tracks")
  List<TrackView> tracks() {
    return catalog.activeTracks();
  }

  @GetMapping("/tracks/{slug}")
  TrackView track(@PathVariable String slug) {
    return catalog
        .activeTrack(slug)
        .orElseThrow(() -> CatalogException.notFound("track_not_found", "Track not found"));
  }

  @GetMapping("/general-tracks")
  List<GeneralTrackView> generalTracks() {
    return catalog.activeGeneralTracks();
  }

  @GetMapping("/general-tracks/{slug}")
  GeneralTrackView generalTrack(@PathVariable String slug) {
    return catalog
        .activeGeneralTrack(slug)
        .orElseThrow(
            () ->
                CatalogException.notFound(
                    "general_track_not_found", "No active general track with that slug"));
  }
}

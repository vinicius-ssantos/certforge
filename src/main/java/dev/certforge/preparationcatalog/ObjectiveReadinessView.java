package dev.certforge.preparationcatalog;

import java.time.LocalDate;
import java.util.List;

/**
 * How ready a certification track's content is against its own exam objectives (#176): how current
 * the reading of the provider's page is, and how much of it a published question already claims.
 *
 * <p>Absent on {@link TrackView} exactly when nobody has read the provider's page yet -- there is
 * no snapshot to report readiness against, so none is implied (the same convention {@code
 * ExamVersionView#javaRelease} and {@code EditorialViews.ObjectiveSourceView} already use for a
 * fact that may not exist yet).
 */
public record ObjectiveReadinessView(
    String providerVersion,
    LocalDate verifiedOn,
    String status,
    String sourceUrl,
    int totalObjectives,
    int claimedObjectives,
    List<ObjectiveGapView> gaps) {}

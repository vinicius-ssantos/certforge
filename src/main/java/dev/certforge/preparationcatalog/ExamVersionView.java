package dev.certforge.preparationcatalog;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * An active certification exam version.
 *
 * <p>{@code javaRelease} is null for an exam that is not about a Java release. ADR 0017 decided
 * that a Kubernetes or AWS exam carries none rather than a synthetic one, and V17 made the column
 * nullable for it; this field was still a primitive, so building this view for such an exam threw
 * before it could be served.
 */
public record ExamVersionView(
    TrackVersionId id,
    String label,
    String examCode,
    String examName,
    @Schema(nullable = true) Integer javaRelease,
    String objectivesUrl) {}

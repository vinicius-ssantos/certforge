package dev.certforge.labs;

/**
 * A learner-facing summary of one shipped lab, for browsing the catalog before starting a session.
 * Deliberately narrower than {@link LabSpec}: the image reference, sandbox limits, fixture path and
 * evaluation probes are this project's own authoring detail, never the learner's concern or
 * business.
 */
public record LabSummary(String labId, String title, String description, int timeoutSeconds) {}

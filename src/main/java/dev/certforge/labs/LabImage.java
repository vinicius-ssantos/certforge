package dev.certforge.labs;

/**
 * The container image a lab's microVM boots from -- a Vercel Container Registry image (ADR 0028),
 * public or team-scoped. {@code ref} must be digest-pinned ({@code registry/repo@sha256:<digest>}),
 * never a floating tag -- enforced by {@code LabSpecValidator}, not merely documented here.
 */
public record LabImage(String ref) {}

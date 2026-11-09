package dev.certforge.labs;

/**
 * The static, committed bundle a lab's image is built from -- never fetched live at session start.
 * {@code path} names a bundle directory under {@code labs/fixtures/} on the classpath, not a single
 * file, since a lab may need more than one fixture file.
 */
public record LabFixture(String path) {}

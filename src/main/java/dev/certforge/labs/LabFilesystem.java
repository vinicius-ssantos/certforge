package dev.certforge.labs;

/**
 * The lab session's writable scratch space. Everything else in the guest filesystem is read-only;
 * {@code writableScratchMiB} bounds the one place that is not.
 */
public record LabFilesystem(Integer writableScratchMiB) {}

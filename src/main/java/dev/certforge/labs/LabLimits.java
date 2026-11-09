package dev.certforge.labs;

/**
 * Hard caps the orchestrator enforces on the microVM itself (defense in depth, not the primary
 * boundary -- in-guest cgroups are secondary). Every field is required and must be positive: there
 * is no implicit default that widens access.
 */
public record LabLimits(
    Integer wallClockSeconds,
    Integer memoryMiB,
    Integer cpuMillicores,
    Integer diskMiB,
    Integer processCount) {}

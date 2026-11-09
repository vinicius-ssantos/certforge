package dev.certforge.labs;

import java.util.List;

/**
 * The one authoring surface for a hands-on lab (ADR 0027, {@code
 * docs/architecture/hands-on-labs-isolation.md}). A field left out, or a limit left unbounded,
 * means the lab does not ship -- {@code LabSpecValidator} enforces this mechanically, not merely by
 * convention.
 *
 * <p>This type describes a lab; it does not provision one. The microVM orchestrator, terminal
 * bridge, and grader that would actually run a session against this spec are follow-on work.
 */
public record LabSpec(
    String labId,
    Isolation isolation,
    LabImage image,
    LabFixture fixture,
    LabObjective objective,
    List<String> allowedCommands,
    LabLimits limits,
    LabNetwork network,
    LabFilesystem filesystem,
    LabEvaluation evaluation) {}

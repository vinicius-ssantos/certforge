package dev.certforge.labs;

import java.util.List;

/**
 * The one authoring surface for a hands-on lab (ADR 0027, ADR 0028, {@code
 * docs/architecture/hands-on-labs-isolation.md}). A field left out, or a limit left unbounded,
 * means the lab does not ship -- {@code LabSpecValidator} enforces this mechanically, not merely by
 * convention.
 *
 * <p>This type describes a lab; it does not provision one. {@link LabOrchestrator} (backed by
 * Vercel Sandbox, ADR 0028) is what actually runs a session against this spec and grades it; the
 * terminal bridge is Vercel's own controller-hosted PTY, reached directly by the learner's browser
 * (ADR 0029), never by this backend.
 */
public record LabSpec(
    String labId,
    LabImage image,
    LabFixture fixture,
    LabObjective objective,
    List<String> allowedCommands,
    LabSandbox sandbox,
    LabNetwork network,
    LabFilesystem filesystem,
    LabEvaluation evaluation) {}

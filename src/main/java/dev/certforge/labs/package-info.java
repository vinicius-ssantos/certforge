/**
 * Hands-on lab specifications for Docker, Kubernetes and IaC labs (#175, ADR 0027, {@code
 * docs/architecture/hands-on-labs-isolation.md}).
 *
 * <p>This module defines and validates {@code LabSpec}s and ships the three prototype labs the
 * issue names as versioned, validated data. It provisions nothing: the microVM orchestrator,
 * terminal bridge and grader are follow-on work this module's types describe but do not implement
 * (see the architecture doc's Rollout, phase 2 steps 2 onward).
 */
@ApplicationModule(
    displayName = "labs",
    allowedDependencies = {})
package dev.certforge.labs;

import org.springframework.modulith.ApplicationModule;

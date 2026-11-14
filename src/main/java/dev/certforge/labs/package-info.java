/**
 * Hands-on lab specifications for Docker, Kubernetes and IaC labs (#175, ADR 0027, ADR 0028, {@code
 * docs/architecture/hands-on-labs-isolation.md}).
 *
 * <p>This module defines and validates {@code LabSpec}s and ships the three prototype labs the
 * issue names as versioned, validated data. See the architecture doc's Rollout for which of the
 * three has a working session behind it so far, and which still have only their spec.
 */
@ApplicationModule(
    displayName = "labs",
    allowedDependencies = {"platform"})
package dev.certforge.labs;

import org.springframework.modulith.ApplicationModule;

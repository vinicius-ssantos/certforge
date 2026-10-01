/** Security- and integrity-relevant administrative facts. */
@ApplicationModule(
    displayName = "audit",
    allowedDependencies = {"platform", "identity"})
package dev.certforge.audit;

import org.springframework.modulith.ApplicationModule;

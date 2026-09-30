/**
 * Authentication, account lifecycle, roles and permissions. Exposes stable identifiers and
 * authorization decisions; depends on no other module.
 */
@ApplicationModule(
    displayName = "identity",
    allowedDependencies = {"platform"})
package dev.certforge.identity;

import org.springframework.modulith.ApplicationModule;

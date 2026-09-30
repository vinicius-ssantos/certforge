/**
 * Cross-cutting web infrastructure shared by every module: the stable problem response contract and
 * request correlation.
 */
@ApplicationModule(
    displayName = "platform",
    allowedDependencies = {})
package dev.certforge.platform;

import org.springframework.modulith.ApplicationModule;

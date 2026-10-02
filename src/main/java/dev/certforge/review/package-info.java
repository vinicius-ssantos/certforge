/** The review queue: what is worth a learner's next twenty minutes, and why (ADR 0013). */
@ApplicationModule(
    displayName = "review",
    allowedDependencies = {"platform", "identity", "preparationcatalog", "questionbank", "study"})
package dev.certforge.review;

import org.springframework.modulith.ApplicationModule;

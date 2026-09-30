/**
 * Question identities, immutable revisions and the editorial lifecycle (module {@code
 * question-bank}).
 */
@ApplicationModule(
    displayName = "question-bank",
    allowedDependencies = {"identity", "preparationcatalog", "audit"})
package dev.certforge.questionbank;

import org.springframework.modulith.ApplicationModule;

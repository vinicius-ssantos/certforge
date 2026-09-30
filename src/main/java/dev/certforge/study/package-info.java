/** Study sessions, question selection and answer submission orchestration. */
@ApplicationModule(
    displayName = "study",
    allowedDependencies = {"platform", "identity", "preparationcatalog", "questionbank"})
package dev.certforge.study;

import org.springframework.modulith.ApplicationModule;

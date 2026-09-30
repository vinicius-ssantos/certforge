/** Study sessions, question selection and answer submission orchestration. */
@ApplicationModule(
    displayName = "study",
    allowedDependencies = {"identity", "preparationcatalog", "questionbank"})
package dev.certforge.study;

import org.springframework.modulith.ApplicationModule;

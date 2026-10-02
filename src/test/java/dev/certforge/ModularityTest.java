package dev.certforge;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static org.assertj.core.api.Assertions.assertThat;

import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import java.util.Set;
import java.util.stream.Collectors;
import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModule;
import org.springframework.modulith.core.ApplicationModules;

class ModularityTest {

  private static final Set<String> EXPECTED_MODULES =
      Set.of(
          "platform",
          "identity",
          "preparationcatalog",
          "questionbank",
          "study",
          "progress",
          "review",
          "audit");

  private final ApplicationModules modules = ApplicationModules.of(CertForgeApplication.class);

  @Test
  void declaresExactlyTheInitialModules() {
    Set<String> names =
        modules.stream()
            .map(ApplicationModule::getIdentifier)
            .map(Object::toString)
            .collect(Collectors.toSet());

    assertThat(names).isEqualTo(EXPECTED_MODULES);
  }

  @Test
  void verifiesModuleBoundariesAndDependencyDirection() {
    modules.verify();
  }

  @Test
  void keepsPersistenceTypesInsideModuleInternals() {
    var imported =
        new ClassFileImporter()
            .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
            .importPackages("dev.certforge");

    classes()
        .that()
        .haveSimpleNameEndingWith("Repository")
        .or()
        .haveSimpleNameEndingWith("Entity")
        .should()
        .resideInAnyPackage("..internal..")
        .allowEmptyShould(true)
        .check(imported);
  }
}

package dev.certforge.study.internal;

import java.time.Duration;
import java.util.Map;
import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Known mock-exam formats. New certification versions opt in here instead of inheriting guesses.
 */
@Component
class MockExamBlueprintCatalog {

  private static final MockExamBlueprint JAVA_SE_21 =
      new MockExamBlueprint("1Z0-830", 50, Duration.ofMinutes(120), 68, 5);

  private final Map<String, MockExamBlueprint> byExamCode =
      Map.of(JAVA_SE_21.examCode(), JAVA_SE_21);

  Optional<MockExamBlueprint> find(String examCode) {
    return Optional.ofNullable(byExamCode.get(examCode));
  }
}

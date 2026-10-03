package dev.certforge.study.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Duration;
import org.junit.jupiter.api.Test;

class MockExamBlueprintTest {

  @Test
  void java21BlueprintMatchesTheConfiguredPracticeFormat() {
    MockExamBlueprint blueprint = new MockExamBlueprintCatalog().find("1Z0-830").orElseThrow();

    assertThat(blueprint.questionCount()).isEqualTo(50);
    assertThat(blueprint.timeLimit()).isEqualTo(Duration.ofMinutes(120));
    assertThat(blueprint.passingPercentage()).isEqualTo(68);
    assertThat(blueprint.questionsPerTopic()).isEqualTo(5);
    assertThat(blueprint.topicCount()).isEqualTo(10);
    assertThat(blueprint.passingCorrectCount()).isEqualTo(34);
  }

  @Test
  void rejectsBlueprintsThatCannotBeDistributedExactlyAcrossTopics() {
    assertThatThrownBy(
            () -> new MockExamBlueprint("TEST", 50, Duration.ofMinutes(90), 70, 6))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("divide questionCount");
  }

  @Test
  void unknownExamVersionsDoNotSilentlyInheritAnotherFormat() {
    assertThat(new MockExamBlueprintCatalog().find("1Z0-999")).isEmpty();
  }
}

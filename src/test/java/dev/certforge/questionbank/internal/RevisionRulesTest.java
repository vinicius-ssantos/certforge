package dev.certforge.questionbank.internal;

import static org.assertj.core.api.Assertions.assertThat;

import dev.certforge.questionbank.Difficulty;
import dev.certforge.questionbank.QuestionType;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class RevisionRulesTest {

  private static final RevisionContent.Reference REFERENCE =
      new RevisionContent.Reference("JLS 14.20", "https://docs.oracle.com/javase/specs/");

  private static RevisionContent.Option option(String key, boolean correct) {
    return new RevisionContent.Option(key, "Option " + key, correct, "Because " + key);
  }

  private static RevisionContent content(QuestionType type, List<RevisionContent.Option> options) {
    return new RevisionContent(
        type,
        UUID.randomUUID(),
        21,
        Difficulty.MEDIUM,
        "Requires knowing switch patterns",
        "What is printed?",
        "Explanation",
        options,
        List.of(REFERENCE));
  }

  @Test
  void acceptsACompleteSingleChoiceRevision() {
    var content =
        content(QuestionType.SINGLE_CHOICE, List.of(option("A", true), option("B", false)));

    assertThat(RevisionRules.violations(content)).isEmpty();
  }

  @Test
  void acceptsACompleteMultipleChoiceRevisionWithSeveralCorrectOptions() {
    var content =
        content(
            QuestionType.MULTIPLE_CHOICE,
            List.of(option("A", true), option("B", true), option("C", false)));

    assertThat(RevisionRules.violations(content)).isEmpty();
  }

  @Test
  void singleChoiceNeedsExactlyOneCorrectOption() {
    var none = content(QuestionType.SINGLE_CHOICE, List.of(option("A", false), option("B", false)));
    var two = content(QuestionType.SINGLE_CHOICE, List.of(option("A", true), option("B", true)));

    assertThat(RevisionRules.violations(none))
        .containsExactly("single_choice_requires_exactly_one_correct_option");
    assertThat(RevisionRules.violations(two))
        .containsExactly("single_choice_requires_exactly_one_correct_option");
  }

  @Test
  void multipleChoiceNeedsAtLeastOneCorrectOption() {
    var content =
        content(QuestionType.MULTIPLE_CHOICE, List.of(option("A", false), option("B", false)));

    assertThat(RevisionRules.violations(content))
        .containsExactly("multiple_choice_requires_a_correct_option");
  }

  @Test
  void needsAtLeastTwoOptionsWithUniqueKeys() {
    var one = content(QuestionType.MULTIPLE_CHOICE, List.of(option("A", true)));
    var duplicate =
        content(QuestionType.MULTIPLE_CHOICE, List.of(option("A", true), option("A", false)));

    assertThat(RevisionRules.violations(one)).contains("options_too_few");
    assertThat(RevisionRules.violations(duplicate)).contains("option_key_duplicate");
  }

  @Test
  void everyOptionNeedsTextAndAnExplanation() {
    var content =
        content(
            QuestionType.SINGLE_CHOICE,
            List.of(option("A", true), new RevisionContent.Option("B", " ", false, null)));

    assertThat(RevisionRules.violations(content))
        .contains("option_text_missing", "option_explanation_missing");
  }

  @Test
  void requiresAnAuthoritativeHttpsReference() {
    var options = List.of(option("A", true), option("B", false));
    var none =
        new RevisionContent(
            QuestionType.SINGLE_CHOICE,
            UUID.randomUUID(),
            21,
            Difficulty.EASY,
            "r",
            "p",
            "e",
            options,
            List.of());
    var insecure =
        new RevisionContent(
            QuestionType.SINGLE_CHOICE,
            UUID.randomUUID(),
            21,
            Difficulty.EASY,
            "r",
            "p",
            "e",
            options,
            List.of(new RevisionContent.Reference("Doc", "http://example.com")));

    assertThat(RevisionRules.violations(none)).containsExactly("references_missing");
    assertThat(RevisionRules.violations(insecure)).containsExactly("reference_invalid");
  }

  @Test
  void reportsEveryMissingRequiredField() {
    var empty =
        new RevisionContent(
            QuestionType.SINGLE_CHOICE, null, null, null, null, null, null, List.of(), List.of());

    assertThat(RevisionRules.violations(empty))
        .contains(
            "prompt_missing",
            "topic_missing",
            "java_release_missing",
            "difficulty_missing",
            "difficulty_rationale_missing",
            "explanation_missing",
            "options_too_few",
            "references_missing");
  }
}

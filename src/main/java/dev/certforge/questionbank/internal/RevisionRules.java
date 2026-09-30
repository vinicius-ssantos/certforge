package dev.certforge.questionbank.internal;

import dev.certforge.questionbank.QuestionType;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

/**
 * Domain invariants of a question revision. A revision may be saved while incomplete, but it can
 * leave DRAFT (and later be published) only when this returns no violations.
 */
final class RevisionRules {

  static final int MIN_OPTIONS = 2;

  private RevisionRules() {}

  /** Stable, sorted violation codes; empty when the content is complete and consistent. */
  static List<String> violations(RevisionContent content) {
    Set<String> found = new TreeSet<>();
    if (isBlank(content.prompt())) {
      found.add("prompt_missing");
    }
    if (content.topicId() == null) {
      found.add("topic_missing");
    }
    if (content.javaRelease() == null || content.javaRelease() < 1) {
      found.add("java_release_missing");
    }
    if (content.difficulty() == null) {
      found.add("difficulty_missing");
    }
    if (isBlank(content.difficultyRationale())) {
      found.add("difficulty_rationale_missing");
    }
    if (isBlank(content.explanation())) {
      found.add("explanation_missing");
    }
    checkOptions(content, found);
    checkReferences(content, found);
    return List.copyOf(found);
  }

  private static void checkOptions(RevisionContent content, Set<String> found) {
    List<RevisionContent.Option> options = content.options();
    if (options.size() < MIN_OPTIONS) {
      found.add("options_too_few");
    }
    Set<String> keys = new HashSet<>();
    long correct = 0;
    for (RevisionContent.Option option : options) {
      if (!keys.add(option.key())) {
        found.add("option_key_duplicate");
      }
      if (isBlank(option.text())) {
        found.add("option_text_missing");
      }
      if (isBlank(option.explanation())) {
        found.add("option_explanation_missing");
      }
      if (option.correct()) {
        correct++;
      }
    }
    if (content.type() == QuestionType.SINGLE_CHOICE && correct != 1) {
      found.add("single_choice_requires_exactly_one_correct_option");
    }
    if (content.type() == QuestionType.MULTIPLE_CHOICE && correct < 1) {
      found.add("multiple_choice_requires_a_correct_option");
    }
  }

  private static void checkReferences(RevisionContent content, Set<String> found) {
    if (content.references().isEmpty()) {
      found.add("references_missing");
    }
    for (RevisionContent.Reference reference : content.references()) {
      if (isBlank(reference.title())
          || reference.url() == null
          || !reference.url().startsWith("https://")) {
        found.add("reference_invalid");
      }
    }
  }

  private static boolean isBlank(String value) {
    return value == null || value.isBlank();
  }
}

package dev.certforge.questionbank.internal;

import dev.certforge.questionbank.Difficulty;
import dev.certforge.questionbank.QuestionType;
import dev.certforge.questionbank.Seniority;
import java.util.List;
import java.util.UUID;

/**
 * The editable content of a revision. Drafts may be incomplete, so most fields are nullable; {@link
 * RevisionRules} decides when the content is complete enough to leave DRAFT.
 */
record RevisionContent(
    QuestionType type,
    UUID topicId,
    Integer javaRelease,
    /** The level this is asked at. Interview questions only; see {@link Seniority}. */
    Seniority seniority,
    Difficulty difficulty,
    String difficultyRationale,
    String prompt,
    String explanation,
    List<Option> options,
    List<Reference> references) {

  RevisionContent {
    options = options == null ? List.of() : List.copyOf(options);
    references = references == null ? List.of() : List.copyOf(references);
  }

  record Option(String key, String text, boolean correct, String explanation) {}

  record Reference(String title, String url) {}
}

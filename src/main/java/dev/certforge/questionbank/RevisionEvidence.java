package dev.certforge.questionbank;

import dev.certforge.preparationcatalog.TopicId;
import java.util.List;

/**
 * Full content of one revision, including the answer key. This is server-side evidence for
 * correctness checks and for showing an attempt's original revision after submission. It must never
 * be serialized to a learner before an answer has been accepted.
 */
public record RevisionEvidence(
    QuestionId questionId,
    QuestionRevisionId revisionId,
    int revisionNumber,
    RevisionStatus status,
    QuestionType type,
    TopicId topicId,
    int javaRelease,
    String prompt,
    String explanation,
    List<Option> options,
    List<Reference> references) {

  /** An option with its correctness and the reason it is correct or incorrect. */
  public record Option(String key, String text, boolean correct, String explanation) {}

  /** An authoritative source supporting the answer. */
  public record Reference(String title, String url) {}
}

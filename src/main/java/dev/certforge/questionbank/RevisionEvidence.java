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
    List<Reference> references,
    /** The programme the build ran and what it printed. Null when the question has none. */
    Verification verification) {

  /** The shape before verification evidence existed, for callers that have none to give. */
  public RevisionEvidence(
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
    this(
        questionId,
        revisionId,
        revisionNumber,
        status,
        type,
        topicId,
        javaRelease,
        prompt,
        explanation,
        options,
        references,
        null);
  }

  /** An option with its correctness and the reason it is correct or incorrect. */
  public record Option(String key, String text, boolean correct, String explanation) {}

  /** An authoritative source supporting the answer. */
  public record Reference(String title, String url) {}

  /**
   * The evidence behind the answer: every source the build compiles, in the order the pack lists
   * them, and what the programme printed.
   *
   * <p>It travels with the rest of this record and inherits its rule — never serialized to a
   * learner before an answer has been accepted. The output of a verification programme frequently
   * is the answer.
   */
  public record Verification(List<SourceFile> files, String output) {

    public Verification {
      files = files == null ? List.of() : List.copyOf(files);
    }
  }

  public record SourceFile(String path, String body) {}
}

package dev.certforge.study.internal;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * What a learner receives after an answer has been accepted. Only this type carries the answer key,
 * the explanations and the references, and it is created only from an accepted attempt.
 */
interface AttemptViews {

  record AttemptResult(
      int position,
      UUID revisionId,
      List<String> selectedOptions,
      boolean correct,
      String confidence,
      long elapsedMillis,
      Instant submittedAt,
      Answer answer) {}

  /**
   * What the learner is shown once an answer has been accepted.
   *
   * <p>Everything in here is answer material. It is built only on the paths that have already
   * established the learner may see it, and the verification evidence is no different: the output
   * of a question's programme frequently is the answer.
   */
  record Answer(
      List<String> correctOptions,
      String explanation,
      List<OptionAnswer> options,
      List<Reference> references,
      Verification verification) {}

  /** The programme the build ran for this question and what it printed. Null when there is none. */
  record Verification(List<SourceFile> files, String output) {}

  record SourceFile(String path, String body) {}

  record OptionAnswer(String key, String text, boolean correct, String explanation) {}

  record Reference(String title, String url) {}
}

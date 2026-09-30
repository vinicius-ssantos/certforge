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

  record Answer(
      List<String> correctOptions,
      String explanation,
      List<OptionAnswer> options,
      List<Reference> references) {}

  record OptionAnswer(String key, String text, boolean correct, String explanation) {}

  record Reference(String title, String url) {}
}

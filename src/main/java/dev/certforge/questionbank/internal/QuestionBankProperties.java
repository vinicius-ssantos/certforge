package dev.certforge.questionbank.internal;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Editorial policy switches.
 *
 * @param requireReviewerSeparation when true (the default), the reviewer of a revision must not be
 *     its author. A single-maintainer deployment may turn it off explicitly.
 */
@ConfigurationProperties("certforge.question-bank")
record QuestionBankProperties(Boolean requireReviewerSeparation) {

  QuestionBankProperties {
    requireReviewerSeparation = requireReviewerSeparation == null || requireReviewerSeparation;
  }
}

package dev.certforge.questionbank.internal;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * @param aiReviewConfirmationWindow how long an {@code AI_APPROVED} publication (ADR 0022) stays
 *     eligible for new study before a {@code CONTENT_REVIEW} account must confirm it or it lapses
 *     out of selection again.
 */
@ConfigurationProperties("certforge.editorial")
record QuestionBankProperties(Duration aiReviewConfirmationWindow) {

  QuestionBankProperties {
    aiReviewConfirmationWindow =
        aiReviewConfirmationWindow == null ? Duration.ofDays(14) : aiReviewConfirmationWindow;
  }
}

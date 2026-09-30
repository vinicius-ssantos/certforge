package dev.certforge.study.internal;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Session policy.
 *
 * @param sessionTtl how long a session may stay in progress before it expires
 * @param defaultQuestionCount number of questions when the learner does not ask for a number
 * @param maxQuestionCount the largest session a learner may request
 */
@ConfigurationProperties("certforge.study")
record StudyProperties(
    Duration sessionTtl, Integer defaultQuestionCount, Integer maxQuestionCount) {

  StudyProperties {
    sessionTtl = sessionTtl == null ? Duration.ofHours(24) : sessionTtl;
    defaultQuestionCount = defaultQuestionCount == null ? 10 : defaultQuestionCount;
    maxQuestionCount = maxQuestionCount == null ? 20 : maxQuestionCount;
  }
}

package dev.certforge.platform.internal;

import io.micrometer.core.instrument.config.MeterFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Keeps metric cardinality bounded. Tag values in this application come from fixed sets of codes,
 * never from user input, and these filters are a safety net: if a new code path ever tried to turn
 * arbitrary text into a tag value, the extra series would be dropped instead of growing memory
 * without limit.
 */
@Configuration
class MetricsConfig {

  /** At most this many distinct problem codes; there are far fewer by design. */
  private static final int MAX_DISTINCT_CODES = 100;

  /** At most this many distinct values of any other tag on the application's own meters. */
  private static final int MAX_DISTINCT_VALUES = 20;

  @Bean
  MeterFilter boundProblemCodes() {
    return MeterFilter.maximumAllowableTags(
        "certforge.domain.failures", "code", MAX_DISTINCT_CODES, MeterFilter.deny());
  }

  @Bean
  MeterFilter boundAuthenticationReasons() {
    return MeterFilter.maximumAllowableTags(
        "certforge.auth.failures", "reason", MAX_DISTINCT_VALUES, MeterFilter.deny());
  }

  @Bean
  MeterFilter boundEditorialActions() {
    return MeterFilter.maximumAllowableTags(
        "certforge.editorial.transitions", "action", MAX_DISTINCT_VALUES, MeterFilter.deny());
  }

  @Bean
  MeterFilter boundAttemptOutcomes() {
    return MeterFilter.maximumAllowableTags(
        "certforge.attempts.submitted", "outcome", MAX_DISTINCT_VALUES, MeterFilter.deny());
  }
}

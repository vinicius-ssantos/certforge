package dev.certforge.labs;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * How a lab session is graded. The only kind this project runs: a grader outside the learner's
 * shell context runs read-only probes against the session's final state; the learner's shell never
 * self-reports success.
 */
public enum EvaluationType {
  @JsonProperty("deterministic-probe")
  DETERMINISTIC_PROBE
}

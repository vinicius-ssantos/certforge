package dev.certforge.labs;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Network egress a lab session's microVM is allowed. {@code NONE} is the default and expected value
 * once a lab's own images are pre-cached; {@code IMAGE_PULL_ONLY} must be justified per lab and
 * reaches only the specific registry its pinned digest lives on.
 */
public enum Egress {
  @JsonProperty("none")
  NONE,
  @JsonProperty("image-pull-only")
  IMAGE_PULL_ONLY
}

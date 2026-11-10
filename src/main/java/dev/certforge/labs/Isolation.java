package dev.certforge.labs;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Which sandbox tier a lab runs under. {@code KATA} (Kata Containers / Firecracker microVMs) is the
 * default for any lab that itself needs a nested container runtime; {@code GVISOR} is the lighter
 * alternative for labs that do not (ADR 0027).
 */
public enum Isolation {
  @JsonProperty("kata")
  KATA,
  @JsonProperty("gvisor")
  GVISOR
}

package dev.certforge.labs.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import dev.certforge.labs.Egress;
import dev.certforge.labs.EvaluationType;
import org.junit.jupiter.api.Test;

/**
 * The shipped lab catalog boots with zero Spring context, so these tests exercise exactly the same
 * code path a real application startup does.
 */
class LabSpecRegistryTest {

  private final LabSpecRegistry registry = new LabSpecRegistry();

  @Test
  void loadsExactlyTheThreePrototypeLabs() {
    assertThat(registry.all()).hasSize(3);
    assertThat(registry.findByLabId("readiness-probe-wrong-port-v1")).isPresent();
    assertThat(registry.findByLabId("service-selector-mismatch-v1")).isPresent();
    assertThat(registry.findByLabId("docker-multistage-bloat-v1")).isPresent();
  }

  @Test
  void everyPrototypeLabDefaultsToNoNetworkEgressAndDeterministicGrading() {
    assertThat(registry.all())
        .allSatisfy(
            spec -> {
              assertThat(spec.network().egress()).isEqualTo(Egress.NONE);
              assertThat(spec.evaluation().type()).isEqualTo(EvaluationType.DETERMINISTIC_PROBE);
            });
  }

  @Test
  void returnsNoLabForAnUnknownId() {
    assertThat(registry.findByLabId("does-not-exist")).isEmpty();
  }

  @Test
  void refusesToLoadWhenNoSpecMatchesThePattern() {
    assertThatThrownBy(
            () ->
                new LabSpecRegistry(
                    "classpath*:labs/specs-does-not-exist/*.json", new FixtureBundles()))
        .isInstanceOf(IllegalStateException.class);
  }
}

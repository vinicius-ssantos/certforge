package dev.certforge.labs.internal;

import dev.certforge.labs.LabEvaluationCheck;
import dev.certforge.labs.LabSandbox;
import dev.certforge.labs.LabSpec;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.function.Predicate;
import java.util.regex.Pattern;

/**
 * Domain invariants of a {@link LabSpec}. A spec that leaves any field out, or any limit unbounded,
 * does not ship -- there is no implicit default that widens access (ADR 0027, ADR 0028).
 */
final class LabSpecValidator {

  private static final Pattern DIGEST_PINNED_REF = Pattern.compile(".+@sha256:[A-Fa-f0-9]{64}$");
  private static final Pattern URL_SCHEME = Pattern.compile("^[a-zA-Z][a-zA-Z0-9+.-]*://.*");

  private LabSpecValidator() {}

  /**
   * Stable, sorted violation codes; empty when the spec is complete and safe to ship.
   *
   * <p>{@code fixtureBundleExists} is asked about {@link dev.certforge.labs.LabFixture#path()}
   * rather than resolved here, so this checker stays pure and IO-free -- the one caller that cares
   * about real classpath resources ({@code LabSpecRegistry}) decides how to check.
   */
  static List<String> violations(LabSpec spec, Predicate<String> fixtureBundleExists) {
    Set<String> found = new TreeSet<>();

    if (isBlank(spec.labId())) {
      found.add("lab_id_missing");
    }

    checkImage(spec, found);
    checkFixture(spec, fixtureBundleExists, found);

    if (spec.objective() == null || isBlank(spec.objective().title())) {
      found.add("objective_title_missing");
    }
    if (spec.objective() == null || isBlank(spec.objective().description())) {
      found.add("objective_description_missing");
    }

    checkAllowedCommands(spec, found);
    checkSandbox(spec.sandbox(), found);

    if (spec.network() == null || spec.network().egress() == null) {
      found.add("egress_missing");
    }
    if (spec.filesystem() == null || notPositive(spec.filesystem().writableScratchMiB())) {
      found.add("writable_scratch_mib_invalid");
    }

    checkEvaluation(spec, found);

    return List.copyOf(found);
  }

  private static void checkImage(LabSpec spec, Set<String> found) {
    if (spec.image() == null || isBlank(spec.image().ref())) {
      found.add("image_ref_missing");
    } else if (!DIGEST_PINNED_REF.matcher(spec.image().ref()).matches()) {
      found.add("image_ref_not_pinned_to_digest");
    }
  }

  private static void checkFixture(
      LabSpec spec, Predicate<String> fixtureBundleExists, Set<String> found) {
    String path = spec.fixture() == null ? null : spec.fixture().path();
    if (isBlank(path)) {
      found.add("fixture_path_missing");
    } else if (path.startsWith("/") || URL_SCHEME.matcher(path).matches()) {
      found.add("fixture_path_absolute_or_url");
    } else if (!fixtureBundleExists.test(path)) {
      found.add("fixture_path_not_found");
    }
  }

  private static void checkAllowedCommands(LabSpec spec, Set<String> found) {
    List<String> commands = spec.allowedCommands();
    if (commands == null || commands.isEmpty()) {
      found.add("allowed_commands_missing");
    } else if (commands.stream().anyMatch(LabSpecValidator::isBlank)) {
      found.add("allowed_command_invalid");
    }
  }

  private static void checkSandbox(LabSandbox sandbox, Set<String> found) {
    if (sandbox == null || notPositive(sandbox.vcpus())) {
      found.add("vcpus_invalid");
    } else if (sandbox.vcpus() != 1 && sandbox.vcpus() % 2 != 0) {
      found.add("vcpus_must_be_one_or_even");
    }
    if (sandbox == null || notPositive(sandbox.timeoutSeconds())) {
      found.add("timeout_seconds_invalid");
    }
    if (sandbox == null || !Boolean.FALSE.equals(sandbox.persistent())) {
      found.add("persistent_must_be_false");
    }
  }

  private static void checkEvaluation(LabSpec spec, Set<String> found) {
    if (spec.evaluation() == null || spec.evaluation().type() == null) {
      found.add("evaluation_type_missing");
    }
    List<LabEvaluationCheck> checks = spec.evaluation() == null ? null : spec.evaluation().checks();
    if (checks == null || checks.isEmpty()) {
      found.add("evaluation_checks_missing");
      return;
    }
    for (LabEvaluationCheck check : checks) {
      if (isBlank(check.description())) {
        found.add("evaluation_check_description_missing");
      }
      if (isBlank(check.probe())) {
        found.add("evaluation_check_probe_missing");
      }
    }
  }

  private static boolean notPositive(Integer value) {
    return value == null || value <= 0;
  }

  private static boolean isBlank(String value) {
    return value == null || value.isBlank();
  }
}

package dev.certforge.labs.internal;

import static org.assertj.core.api.Assertions.assertThat;

import dev.certforge.labs.Egress;
import dev.certforge.labs.EvaluationType;
import dev.certforge.labs.LabEvaluation;
import dev.certforge.labs.LabEvaluationCheck;
import dev.certforge.labs.LabFilesystem;
import dev.certforge.labs.LabFixture;
import dev.certforge.labs.LabImage;
import dev.certforge.labs.LabNetwork;
import dev.certforge.labs.LabObjective;
import dev.certforge.labs.LabSandbox;
import dev.certforge.labs.LabSpec;
import java.util.List;
import java.util.function.Predicate;
import org.junit.jupiter.api.Test;

class LabSpecValidatorTest {

  private static final Predicate<String> FIXTURE_EXISTS = path -> true;
  private static final Predicate<String> FIXTURE_MISSING = path -> false;

  private static LabSpec golden() {
    return new LabSpec(
        "readiness-probe-wrong-port-v1",
        new LabImage(
            "docker.io/library/busybox@sha256:"
                + "73aaf090f3d85aa34ee199857f03fa3a95c8ede2ffd4cc2cdb5b94e566b11662"),
        new LabFixture("readiness-probe-wrong-port-v1"),
        new LabObjective("Fix a readiness probe", "Edit the manifest so the Pod becomes Ready."),
        List.of("kubectl"),
        new LabSandbox(1, 900, false),
        new LabNetwork(Egress.NONE),
        new LabFilesystem(64),
        new LabEvaluation(
            EvaluationType.DETERMINISTIC_PROBE,
            List.of(new LabEvaluationCheck("Pod is Ready", "kubectl get pod ..."))));
  }

  private static List<String> violations(LabSpec spec) {
    return LabSpecValidator.violations(spec, FIXTURE_EXISTS);
  }

  @Test
  void acceptsACompleteSpec() {
    assertThat(violations(golden())).isEmpty();
  }

  @Test
  void requiresALabId() {
    var spec = withLabId(golden(), "");
    assertThat(violations(spec)).containsExactly("lab_id_missing");
  }

  @Test
  void requiresAnImageRef() {
    var spec = withImageRef(golden(), "");
    assertThat(violations(spec)).containsExactly("image_ref_missing");
  }

  @Test
  void rejectsAFloatingImageTag() {
    var spec = withImageRef(golden(), "docker.io/library/busybox:stable");
    assertThat(violations(spec)).containsExactly("image_ref_not_pinned_to_digest");
  }

  @Test
  void requiresAFixturePath() {
    var spec = withFixturePath(golden(), "");
    assertThat(violations(spec)).containsExactly("fixture_path_missing");
  }

  @Test
  void rejectsAnAbsoluteFixturePath() {
    var spec = withFixturePath(golden(), "/etc/passwd");
    assertThat(violations(spec)).containsExactly("fixture_path_absolute_or_url");
  }

  @Test
  void rejectsAFixtureUrl() {
    var spec = withFixturePath(golden(), "https://example.com/fixture.yaml");
    assertThat(violations(spec)).containsExactly("fixture_path_absolute_or_url");
  }

  @Test
  void rejectsAFixtureBundleThatDoesNotExist() {
    assertThat(LabSpecValidator.violations(golden(), FIXTURE_MISSING))
        .containsExactly("fixture_path_not_found");
  }

  @Test
  void requiresAnObjectiveTitle() {
    var g = golden();
    var spec = withObjective(g, new LabObjective("", g.objective().description()));
    assertThat(violations(spec)).containsExactly("objective_title_missing");
  }

  @Test
  void requiresAnObjectiveDescription() {
    var g = golden();
    var spec = withObjective(g, new LabObjective(g.objective().title(), ""));
    assertThat(violations(spec)).containsExactly("objective_description_missing");
  }

  @Test
  void requiresAtLeastOneAllowedCommand() {
    var spec = withAllowedCommands(golden(), List.of());
    assertThat(violations(spec)).containsExactly("allowed_commands_missing");
  }

  @Test
  void rejectsABlankAllowedCommand() {
    var spec = withAllowedCommands(golden(), List.of("kubectl", ""));
    assertThat(violations(spec)).containsExactly("allowed_command_invalid");
  }

  @Test
  void requiresAPositiveVcpuCount() {
    var g = golden();
    assertThat(violations(withSandbox(g, new LabSandbox(0, 900, false))))
        .containsExactly("vcpus_invalid");
    assertThat(violations(withSandbox(g, new LabSandbox(null, 900, false))))
        .containsExactly("vcpus_invalid");
  }

  @Test
  void requiresVcpusToBeOneOrEven() {
    var spec = withSandbox(golden(), new LabSandbox(3, 900, false));
    assertThat(violations(spec)).containsExactly("vcpus_must_be_one_or_even");
  }

  @Test
  void requiresAPositiveTimeout() {
    var spec = withSandbox(golden(), new LabSandbox(1, 0, false));
    assertThat(violations(spec)).containsExactly("timeout_seconds_invalid");
  }

  @Test
  void requiresPersistentToBeExplicitlyFalse() {
    var g = golden();
    assertThat(violations(withSandbox(g, new LabSandbox(1, 900, true))))
        .containsExactly("persistent_must_be_false");
    assertThat(violations(withSandbox(g, new LabSandbox(1, 900, null))))
        .containsExactly("persistent_must_be_false");
  }

  @Test
  void requiresAnEgressPosture() {
    var g = golden();
    var spec = withNetwork(g, new LabNetwork(null));
    assertThat(violations(spec)).containsExactly("egress_missing");
  }

  @Test
  void requiresPositiveWritableScratch() {
    var spec = withFilesystem(golden(), new LabFilesystem(0));
    assertThat(violations(spec)).containsExactly("writable_scratch_mib_invalid");
  }

  @Test
  void requiresAnEvaluationType() {
    var g = golden();
    var spec = withEvaluation(g, new LabEvaluation(null, g.evaluation().checks()));
    assertThat(violations(spec)).containsExactly("evaluation_type_missing");
  }

  @Test
  void requiresAtLeastOneEvaluationCheck() {
    var g = golden();
    var spec = withEvaluation(g, new LabEvaluation(g.evaluation().type(), List.of()));
    assertThat(violations(spec)).containsExactly("evaluation_checks_missing");
  }

  @Test
  void requiresEveryEvaluationCheckToHaveADescriptionAndAProbe() {
    var g = golden();
    var spec =
        withEvaluation(
            g, new LabEvaluation(g.evaluation().type(), List.of(new LabEvaluationCheck("", ""))));
    assertThat(violations(spec))
        .containsExactlyInAnyOrder(
            "evaluation_check_description_missing", "evaluation_check_probe_missing");
  }

  private static LabSpec withLabId(LabSpec g, String labId) {
    return new LabSpec(
        labId,
        g.image(),
        g.fixture(),
        g.objective(),
        g.allowedCommands(),
        g.sandbox(),
        g.network(),
        g.filesystem(),
        g.evaluation());
  }

  private static LabSpec withImageRef(LabSpec g, String ref) {
    return new LabSpec(
        g.labId(),
        new LabImage(ref),
        g.fixture(),
        g.objective(),
        g.allowedCommands(),
        g.sandbox(),
        g.network(),
        g.filesystem(),
        g.evaluation());
  }

  private static LabSpec withFixturePath(LabSpec g, String path) {
    return new LabSpec(
        g.labId(),
        g.image(),
        new LabFixture(path),
        g.objective(),
        g.allowedCommands(),
        g.sandbox(),
        g.network(),
        g.filesystem(),
        g.evaluation());
  }

  private static LabSpec withObjective(LabSpec g, LabObjective objective) {
    return new LabSpec(
        g.labId(),
        g.image(),
        g.fixture(),
        objective,
        g.allowedCommands(),
        g.sandbox(),
        g.network(),
        g.filesystem(),
        g.evaluation());
  }

  private static LabSpec withAllowedCommands(LabSpec g, List<String> commands) {
    return new LabSpec(
        g.labId(),
        g.image(),
        g.fixture(),
        g.objective(),
        commands,
        g.sandbox(),
        g.network(),
        g.filesystem(),
        g.evaluation());
  }

  private static LabSpec withSandbox(LabSpec g, LabSandbox sandbox) {
    return new LabSpec(
        g.labId(),
        g.image(),
        g.fixture(),
        g.objective(),
        g.allowedCommands(),
        sandbox,
        g.network(),
        g.filesystem(),
        g.evaluation());
  }

  private static LabSpec withNetwork(LabSpec g, LabNetwork network) {
    return new LabSpec(
        g.labId(),
        g.image(),
        g.fixture(),
        g.objective(),
        g.allowedCommands(),
        g.sandbox(),
        network,
        g.filesystem(),
        g.evaluation());
  }

  private static LabSpec withFilesystem(LabSpec g, LabFilesystem filesystem) {
    return new LabSpec(
        g.labId(),
        g.image(),
        g.fixture(),
        g.objective(),
        g.allowedCommands(),
        g.sandbox(),
        g.network(),
        filesystem,
        g.evaluation());
  }

  private static LabSpec withEvaluation(LabSpec g, LabEvaluation evaluation) {
    return new LabSpec(
        g.labId(),
        g.image(),
        g.fixture(),
        g.objective(),
        g.allowedCommands(),
        g.sandbox(),
        g.network(),
        g.filesystem(),
        evaluation);
  }
}

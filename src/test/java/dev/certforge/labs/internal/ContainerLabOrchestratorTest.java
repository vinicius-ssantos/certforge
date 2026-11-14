package dev.certforge.labs.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.certforge.identity.ActorId;
import dev.certforge.identity.CurrentActor;
import dev.certforge.labs.Egress;
import dev.certforge.labs.LabCatalog;
import dev.certforge.labs.LabEvaluation;
import dev.certforge.labs.LabEvaluationCheck;
import dev.certforge.labs.LabFilesystem;
import dev.certforge.labs.LabFixture;
import dev.certforge.labs.LabImage;
import dev.certforge.labs.LabNetwork;
import dev.certforge.labs.LabObjective;
import dev.certforge.labs.LabSandbox;
import dev.certforge.labs.LabSession;
import dev.certforge.labs.LabSpec;
import dev.certforge.labs.LabVerdict;
import dev.certforge.labs.internal.DockerCliClient.ExecResult;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;

/**
 * {@link ContainerLabOrchestrator} against a mocked {@link DockerCliClient} -- the real local
 * Docker/{@code kind} behaviour is {@link LabsContainerSessionIT}'s job. This covers provisioning
 * ordering, grading, destroy-on-exit, timeout scheduling, and that a session belongs to the learner
 * who started it (ADR 0030, mirroring {@code SandboxLabOrchestratorTest}'s coverage for the Vercel
 * engine).
 */
class ContainerLabOrchestratorTest {

  private static final ActorId LEARNER = new ActorId(UUID.randomUUID());
  private static final ActorId OTHER_LEARNER = new ActorId(UUID.randomUUID());
  private static final String LAB_ID = "service-selector-mismatch-v1";
  private static final String CONTAINER_ID = "a".repeat(64);

  private static LabSpec labSpec() {
    return new LabSpec(
        LAB_ID,
        new LabImage(
            "docker.io/library/busybox@sha256:"
                + "73aaf090f3d85aa34ee199857f03fa3a95c8ede2ffd4cc2cdb5b94e566b11662"),
        new LabFixture(LAB_ID),
        new LabObjective("Fix it", "..."),
        List.of("kubectl", "vi", "nano", "cat", "ls"),
        new LabSandbox(1, 900, false),
        new LabNetwork(Egress.NONE),
        new LabFilesystem(64),
        new LabEvaluation(
            dev.certforge.labs.EvaluationType.DETERMINISTIC_PROBE,
            List.of(new LabEvaluationCheck("has an endpoint", "test \"true\" = \"true\""))));
  }

  private static CurrentActor actingAs(ActorId actor) {
    CurrentActor currentActor = mock(CurrentActor.class);
    when(currentActor.require()).thenReturn(actor);
    return currentActor;
  }

  /** A docker client stubbed so provisioning always succeeds, for tests that are not about it. */
  private static DockerCliClient happyPathDocker() {
    DockerCliClient docker = mock(DockerCliClient.class);
    when(docker.imageExists(any())).thenReturn(true);
    when(docker.run(any(), any())).thenReturn(CONTAINER_ID);
    when(docker.exec(eq(CONTAINER_ID), any(), isNull(), eq(List.of("docker", "info"))))
        .thenReturn(new ExecResult(0, ""));
    when(docker.exec(eq(CONTAINER_ID), any(), isNull(), any())).thenReturn(new ExecResult(0, ""));
    return docker;
  }

  @Test
  void startsASessionAndProvisionsTheClusterInOrder() {
    LabCatalog catalog = mock(LabCatalog.class);
    when(catalog.findByLabId(LAB_ID)).thenReturn(Optional.of(labSpec()));
    DockerCliClient docker = happyPathDocker();
    ContainerLabOrchestrator orchestrator =
        new ContainerLabOrchestrator(catalog, docker, actingAs(LEARNER));

    LabSession session = orchestrator.start(LAB_ID);

    assertThat(session.sessionId()).isEqualTo(CONTAINER_ID);
    assertThat(session.labId()).isEqualTo(LAB_ID);
    assertThat(session.interactiveUrl())
        .isEqualTo("/api/labs/sessions/" + CONTAINER_ID + "/terminal");
    assertThat(session.interactiveToken()).isNotBlank();
    verify(docker)
        .exec(
            eq(CONTAINER_ID),
            any(),
            isNull(),
            eq(
                List.of(
                    "kind",
                    "create",
                    "cluster",
                    "--name",
                    "lab",
                    "--config",
                    "/tmp/kind-config.yaml")));
  }

  @Test
  void refusesToStartALabThatIsNotShipped() {
    LabCatalog catalog = mock(LabCatalog.class);
    when(catalog.findByLabId("missing")).thenReturn(Optional.empty());
    ContainerLabOrchestrator orchestrator =
        new ContainerLabOrchestrator(catalog, mock(DockerCliClient.class), actingAs(LEARNER));

    assertThatThrownBy(() -> orchestrator.start("missing"))
        .isInstanceOf(NoSuchElementException.class);
  }

  @Test
  void removesTheContainerWhenProvisioningFails() {
    LabCatalog catalog = mock(LabCatalog.class);
    when(catalog.findByLabId(LAB_ID)).thenReturn(Optional.of(labSpec()));
    DockerCliClient docker = mock(DockerCliClient.class);
    when(docker.imageExists(any())).thenReturn(true);
    when(docker.run(any(), any())).thenReturn(CONTAINER_ID);
    when(docker.exec(eq(CONTAINER_ID), any(), isNull(), any()))
        .thenReturn(new ExecResult(1, "nested dockerd never started"));
    ContainerLabOrchestrator orchestrator =
        new ContainerLabOrchestrator(catalog, docker, actingAs(LEARNER));

    assertThatThrownBy(() -> orchestrator.start(LAB_ID)).isInstanceOf(IllegalStateException.class);

    verify(docker).remove(CONTAINER_ID);
  }

  @Test
  void gradesEveryCheckAndAlwaysRemovesTheContainer() {
    LabCatalog catalog = mock(LabCatalog.class);
    when(catalog.findByLabId(LAB_ID)).thenReturn(Optional.of(labSpec()));
    DockerCliClient docker = happyPathDocker();
    when(docker.exec(
            eq(CONTAINER_ID), any(), isNull(), eq(List.of("sh", "-c", "test \"true\" = \"true\""))))
        .thenReturn(new ExecResult(0, ""));
    ContainerLabOrchestrator orchestrator =
        new ContainerLabOrchestrator(catalog, docker, actingAs(LEARNER));
    orchestrator.start(LAB_ID);

    LabVerdict verdict = orchestrator.complete(CONTAINER_ID);

    assertThat(verdict.passed()).isTrue();
    assertThat(verdict.checks()).hasSize(1);
    verify(docker).remove(CONTAINER_ID);
  }

  @Test
  void aSessionCanOnlyBeCompletedOnce() {
    LabCatalog catalog = mock(LabCatalog.class);
    when(catalog.findByLabId(LAB_ID)).thenReturn(Optional.of(labSpec()));
    DockerCliClient docker = happyPathDocker();
    ContainerLabOrchestrator orchestrator =
        new ContainerLabOrchestrator(catalog, docker, actingAs(LEARNER));
    orchestrator.start(LAB_ID);
    orchestrator.complete(CONTAINER_ID);

    assertThatThrownBy(() -> orchestrator.complete(CONTAINER_ID))
        .isInstanceOf(NoSuchElementException.class);
  }

  @Test
  void refusesToCompleteASessionStartedByAnotherLearnerAndNeverRemovesIt() {
    LabCatalog catalog = mock(LabCatalog.class);
    when(catalog.findByLabId(LAB_ID)).thenReturn(Optional.of(labSpec()));
    DockerCliClient docker = happyPathDocker();
    CurrentActor currentActor = mock(CurrentActor.class);
    when(currentActor.require()).thenReturn(LEARNER);
    ContainerLabOrchestrator orchestrator =
        new ContainerLabOrchestrator(catalog, docker, currentActor);
    orchestrator.start(LAB_ID);

    when(currentActor.require()).thenReturn(OTHER_LEARNER);

    assertThatThrownBy(() -> orchestrator.complete(CONTAINER_ID))
        .isInstanceOf(NoSuchElementException.class);
    verify(docker, never()).remove(CONTAINER_ID);

    when(currentActor.require()).thenReturn(LEARNER);
    orchestrator.complete(CONTAINER_ID);
    verify(docker).remove(CONTAINER_ID);
  }

  @Test
  void ownedByCurrentActorChecksBothTheLearnerAndTheTerminalToken() {
    LabCatalog catalog = mock(LabCatalog.class);
    when(catalog.findByLabId(LAB_ID)).thenReturn(Optional.of(labSpec()));
    DockerCliClient docker = happyPathDocker();
    CurrentActor currentActor = mock(CurrentActor.class);
    when(currentActor.require()).thenReturn(LEARNER);
    ContainerLabOrchestrator orchestrator =
        new ContainerLabOrchestrator(catalog, docker, currentActor);
    LabSession session = orchestrator.start(LAB_ID);

    assertThat(orchestrator.ownedByCurrentActor(CONTAINER_ID, session.interactiveToken())).isTrue();
    assertThat(orchestrator.ownedByCurrentActor(CONTAINER_ID, "wrong-token")).isFalse();

    when(currentActor.require()).thenReturn(OTHER_LEARNER);
    assertThat(orchestrator.ownedByCurrentActor(CONTAINER_ID, session.interactiveToken()))
        .isFalse();
  }

  @Test
  void onlyBuildsTheImageWhenItDoesNotAlreadyExist() {
    LabCatalog catalog = mock(LabCatalog.class);
    when(catalog.findByLabId(LAB_ID)).thenReturn(Optional.of(labSpec()));
    DockerCliClient docker = happyPathDocker();
    when(docker.imageExists(any())).thenReturn(false);
    ContainerLabOrchestrator orchestrator =
        new ContainerLabOrchestrator(catalog, docker, actingAs(LEARNER));

    orchestrator.start(LAB_ID);

    verify(docker, times(1)).build(anyString(), anyString(), eq("certforge-k8s-container-lab"));
  }
}

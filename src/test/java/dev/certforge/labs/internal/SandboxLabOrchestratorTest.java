package dev.certforge.labs.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.certforge.identity.ActorId;
import dev.certforge.identity.CurrentActor;
import dev.certforge.labs.Egress;
import dev.certforge.labs.EvaluationType;
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
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;

/**
 * {@link SandboxLabOrchestrator} against a mocked {@link VercelSandboxClient} -- the real HTTP
 * contract is {@link VercelSandboxClientTest}'s job; this covers provisioning, session tracking,
 * grading, that a session is always stopped (ADR 0027 decision 5) even when grading itself fails,
 * and that a session belongs to the learner who started it.
 */
class SandboxLabOrchestratorTest {

  private static final ActorId LEARNER = new ActorId(UUID.randomUUID());
  private static final ActorId OTHER_LEARNER = new ActorId(UUID.randomUUID());

  private static LabSpec labWithCommands(String... allowedCommands) {
    return new LabSpec(
        "a-lab",
        new LabImage(
            "docker.io/library/busybox@sha256:"
                + "73aaf090f3d85aa34ee199857f03fa3a95c8ede2ffd4cc2cdb5b94e566b11662"),
        new LabFixture("a-lab"),
        new LabObjective("Fix it", "..."),
        List.of(allowedCommands),
        new LabSandbox(1, 900, false),
        new LabNetwork(Egress.NONE),
        new LabFilesystem(64),
        new LabEvaluation(
            EvaluationType.DETERMINISTIC_PROBE,
            List.of(
                new LabEvaluationCheck("check one", "true"),
                new LabEvaluationCheck("check two", "false"))));
  }

  /** A {@link CurrentActor} stand-in that always resolves to the given actor. */
  private static CurrentActor actingAs(ActorId actor) {
    CurrentActor currentActor = mock(CurrentActor.class);
    when(currentActor.require()).thenReturn(actor);
    return currentActor;
  }

  @Test
  void startsASessionAndProvisionsDockerWhenTheLabAllowsIt() {
    LabCatalog catalog = mock(LabCatalog.class);
    VercelSandboxClient client = mock(VercelSandboxClient.class);
    LabSpec spec = labWithCommands("docker", "cat");
    when(catalog.findByLabId("a-lab")).thenReturn(Optional.of(spec));
    when(client.createSession(spec)).thenReturn("sbx_1");
    when(client.openInteractive("sbx_1"))
        .thenReturn(new VercelSandboxClient.InteractiveCredential("wss://x", "tok"));
    SandboxLabOrchestrator orchestrator =
        new SandboxLabOrchestrator(catalog, client, actingAs(LEARNER));

    LabSession session = orchestrator.start("a-lab");

    assertThat(session).isEqualTo(new LabSession("sbx_1", "a-lab", "wss://x", "tok"));
    verify(client).startDetached("sbx_1", "dockerd", List.of(), true);
  }

  @Test
  void doesNotProvisionDockerForALabThatDoesNotAllowIt() {
    LabCatalog catalog = mock(LabCatalog.class);
    VercelSandboxClient client = mock(VercelSandboxClient.class);
    LabSpec spec = labWithCommands("cat", "ls");
    when(catalog.findByLabId("a-lab")).thenReturn(Optional.of(spec));
    when(client.createSession(spec)).thenReturn("sbx_1");
    when(client.openInteractive("sbx_1"))
        .thenReturn(new VercelSandboxClient.InteractiveCredential("wss://x", "tok"));
    SandboxLabOrchestrator orchestrator =
        new SandboxLabOrchestrator(catalog, client, actingAs(LEARNER));

    orchestrator.start("a-lab");

    verify(client, never()).startDetached(any(), any(), any(), anyBoolean());
  }

  @Test
  void refusesToStartALabThatIsNotShipped() {
    LabCatalog catalog = mock(LabCatalog.class);
    when(catalog.findByLabId("missing")).thenReturn(Optional.empty());
    SandboxLabOrchestrator orchestrator =
        new SandboxLabOrchestrator(catalog, mock(VercelSandboxClient.class), actingAs(LEARNER));

    assertThatThrownBy(() -> orchestrator.start("missing"))
        .isInstanceOf(NoSuchElementException.class);
  }

  @Test
  void gradesEveryCheckAsItsOwnCallNeverTheLearnersSessionAndStopsAfterward() {
    LabCatalog catalog = mock(LabCatalog.class);
    VercelSandboxClient client = mock(VercelSandboxClient.class);
    LabSpec spec = labWithCommands("docker");
    when(catalog.findByLabId("a-lab")).thenReturn(Optional.of(spec));
    when(client.createSession(spec)).thenReturn("sbx_1");
    when(client.openInteractive("sbx_1"))
        .thenReturn(new VercelSandboxClient.InteractiveCredential("wss://x", "tok"));
    when(client.runToCompletion(
            eq("sbx_1"), eq("sh"), eq(List.of("-c", "true")), eq(false), anyLong()))
        .thenReturn(0);
    when(client.runToCompletion(
            eq("sbx_1"), eq("sh"), eq(List.of("-c", "false")), eq(false), anyLong()))
        .thenReturn(1);
    SandboxLabOrchestrator orchestrator =
        new SandboxLabOrchestrator(catalog, client, actingAs(LEARNER));
    orchestrator.start("a-lab");

    LabVerdict verdict = orchestrator.complete("sbx_1");

    assertThat(verdict.passed()).isFalse();
    assertThat(verdict.checks()).hasSize(2);
    assertThat(verdict.checks().get(0).description()).isEqualTo("check one");
    assertThat(verdict.checks().get(0).passed()).isTrue();
    assertThat(verdict.checks().get(1).description()).isEqualTo("check two");
    assertThat(verdict.checks().get(1).passed()).isFalse();
    verify(client).stop("sbx_1");
  }

  @Test
  void stopsTheSessionEvenWhenGradingItselfThrows() {
    LabCatalog catalog = mock(LabCatalog.class);
    VercelSandboxClient client = mock(VercelSandboxClient.class);
    LabSpec spec = labWithCommands("docker");
    when(catalog.findByLabId("a-lab")).thenReturn(Optional.of(spec));
    when(client.createSession(spec)).thenReturn("sbx_1");
    when(client.openInteractive("sbx_1"))
        .thenReturn(new VercelSandboxClient.InteractiveCredential("wss://x", "tok"));
    when(client.runToCompletion(any(), any(), any(), anyBoolean(), anyLong()))
        .thenThrow(new RuntimeException("the sandbox timed out"));
    SandboxLabOrchestrator orchestrator =
        new SandboxLabOrchestrator(catalog, client, actingAs(LEARNER));
    orchestrator.start("a-lab");

    assertThatThrownBy(() -> orchestrator.complete("sbx_1")).isInstanceOf(RuntimeException.class);

    verify(client).stop("sbx_1");
  }

  @Test
  void refusesToCompleteASessionThatWasNeverStarted() {
    SandboxLabOrchestrator orchestrator =
        new SandboxLabOrchestrator(
            mock(LabCatalog.class), mock(VercelSandboxClient.class), actingAs(LEARNER));

    assertThatThrownBy(() -> orchestrator.complete("sbx_never"))
        .isInstanceOf(NoSuchElementException.class);
  }

  @Test
  void aSessionCanOnlyBeCompletedOnce() {
    LabCatalog catalog = mock(LabCatalog.class);
    VercelSandboxClient client = mock(VercelSandboxClient.class);
    LabSpec spec = labWithCommands("docker");
    when(catalog.findByLabId("a-lab")).thenReturn(Optional.of(spec));
    when(client.createSession(spec)).thenReturn("sbx_1");
    when(client.openInteractive("sbx_1"))
        .thenReturn(new VercelSandboxClient.InteractiveCredential("wss://x", "tok"));
    SandboxLabOrchestrator orchestrator =
        new SandboxLabOrchestrator(catalog, client, actingAs(LEARNER));
    orchestrator.start("a-lab");
    orchestrator.complete("sbx_1");

    assertThatThrownBy(() -> orchestrator.complete("sbx_1"))
        .isInstanceOf(NoSuchElementException.class);
  }

  @Test
  void refusesToCompleteASessionStartedByAnotherLearnerAndNeverStopsIt() {
    LabCatalog catalog = mock(LabCatalog.class);
    VercelSandboxClient client = mock(VercelSandboxClient.class);
    LabSpec spec = labWithCommands("docker");
    when(catalog.findByLabId("a-lab")).thenReturn(Optional.of(spec));
    when(client.createSession(spec)).thenReturn("sbx_1");
    when(client.openInteractive("sbx_1"))
        .thenReturn(new VercelSandboxClient.InteractiveCredential("wss://x", "tok"));
    CurrentActor currentActor = mock(CurrentActor.class);
    when(currentActor.require()).thenReturn(LEARNER);
    SandboxLabOrchestrator orchestrator = new SandboxLabOrchestrator(catalog, client, currentActor);
    orchestrator.start("a-lab");

    when(currentActor.require()).thenReturn(OTHER_LEARNER);

    assertThatThrownBy(() -> orchestrator.complete("sbx_1"))
        .isInstanceOf(NoSuchElementException.class);
    verify(client, never()).stop("sbx_1");

    when(currentActor.require()).thenReturn(LEARNER);
    orchestrator.complete("sbx_1");
    verify(client).stop("sbx_1");
  }
}

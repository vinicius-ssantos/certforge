package dev.certforge.labs.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import dev.certforge.labs.LabSession;
import dev.certforge.labs.LabVerdict;
import java.util.List;
import java.util.NoSuchElementException;
import org.junit.jupiter.api.Test;

/**
 * {@link LabOrchestratorRouter} dispatches by {@code labId} at {@code start}, and tries the
 * container engine's session map before the Vercel one at {@code complete} (ADR 0030) -- both
 * engines are mocked here; their own behaviour is {@code SandboxLabOrchestratorTest}'s and {@code
 * ContainerLabOrchestratorTest}'s job.
 */
class LabOrchestratorRouterTest {

  @Test
  void routesAContainerLabsStartToTheContainerEngine() {
    SandboxLabOrchestrator sandbox = mock(SandboxLabOrchestrator.class);
    ContainerLabOrchestrator container = mock(ContainerLabOrchestrator.class);
    LabSession expected = new LabSession("c1", "service-selector-mismatch-v1", "/terminal", "tok");
    when(container.start("service-selector-mismatch-v1")).thenReturn(expected);
    LabOrchestratorRouter router = new LabOrchestratorRouter(sandbox, container);

    assertThat(router.start("service-selector-mismatch-v1")).isEqualTo(expected);
    verify(sandbox, org.mockito.Mockito.never()).start(org.mockito.ArgumentMatchers.any());
  }

  @Test
  void routesEveryOtherLabsStartToTheSandboxEngine() {
    SandboxLabOrchestrator sandbox = mock(SandboxLabOrchestrator.class);
    ContainerLabOrchestrator container = mock(ContainerLabOrchestrator.class);
    LabSession expected = new LabSession("sbx_1", "docker-multistage-bloat-v1", "wss://x", "tok");
    when(sandbox.start("docker-multistage-bloat-v1")).thenReturn(expected);
    LabOrchestratorRouter router = new LabOrchestratorRouter(sandbox, container);

    assertThat(router.start("docker-multistage-bloat-v1")).isEqualTo(expected);
    verify(container, org.mockito.Mockito.never()).start(org.mockito.ArgumentMatchers.any());
  }

  @Test
  void completeTriesTheContainerEngineFirstThenFallsBackToSandbox() {
    SandboxLabOrchestrator sandbox = mock(SandboxLabOrchestrator.class);
    ContainerLabOrchestrator container = mock(ContainerLabOrchestrator.class);
    LabVerdict expected = new LabVerdict(true, List.of());
    when(container.complete("sbx_1")).thenThrow(new NoSuchElementException("no session"));
    when(sandbox.complete("sbx_1")).thenReturn(expected);
    LabOrchestratorRouter router = new LabOrchestratorRouter(sandbox, container);

    assertThat(router.complete("sbx_1")).isEqualTo(expected);
  }

  @Test
  void completePropagatesNoSuchElementWhenNeitherEngineKnowsTheSession() {
    SandboxLabOrchestrator sandbox = mock(SandboxLabOrchestrator.class);
    ContainerLabOrchestrator container = mock(ContainerLabOrchestrator.class);
    when(container.complete("missing")).thenThrow(new NoSuchElementException("no session"));
    when(sandbox.complete("missing")).thenThrow(new NoSuchElementException("no session"));
    LabOrchestratorRouter router = new LabOrchestratorRouter(sandbox, container);

    assertThatThrownBy(() -> router.complete("missing")).isInstanceOf(NoSuchElementException.class);
  }
}

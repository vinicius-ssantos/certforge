package dev.certforge.labs.internal;

import dev.certforge.labs.LabOrchestrator;
import dev.certforge.labs.LabSession;
import dev.certforge.labs.LabVerdict;
import org.springframework.stereotype.Component;

/**
 * The only {@link LabOrchestrator} bean -- dispatches by {@code labId} at {@link #start} to either
 * engine, and by which engine's own session-id shape {@code complete} is called with otherwise.
 * {@link SandboxLabOrchestrator} and {@link ContainerLabOrchestrator} are plain classes, not {@code
 * LabOrchestrator} themselves, specifically so Spring never has two candidates for {@link
 * LabsController}'s single {@code LabOrchestrator} constructor parameter.
 *
 * <p>{@link ContainerLabOrchestrator#SUPPORTED_LAB_IDS} names the two labs ADR 0030 temporarily
 * moved off Vercel Sandbox; every other lab stays on {@link SandboxLabOrchestrator}. A {@code
 * complete} call is routed by trying the container engine's session map first -- its session ids
 * are plain Docker container ids, which never collide with Vercel's own session id shape, so trying
 * one engine and falling through to the other on a miss is unambiguous.
 */
@Component
class LabOrchestratorRouter implements LabOrchestrator {

  private final SandboxLabOrchestrator sandboxEngine;
  private final ContainerLabOrchestrator containerEngine;

  LabOrchestratorRouter(
      SandboxLabOrchestrator sandboxEngine, ContainerLabOrchestrator containerEngine) {
    this.sandboxEngine = sandboxEngine;
    this.containerEngine = containerEngine;
  }

  @Override
  public LabSession start(String labId) {
    if (ContainerLabOrchestrator.SUPPORTED_LAB_IDS.contains(labId)) {
      return containerEngine.start(labId);
    }
    return sandboxEngine.start(labId);
  }

  @Override
  public LabVerdict complete(String sessionId) {
    try {
      return containerEngine.complete(sessionId);
    } catch (java.util.NoSuchElementException e) {
      return sandboxEngine.complete(sessionId);
    }
  }
}

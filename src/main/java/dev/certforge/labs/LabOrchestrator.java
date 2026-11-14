package dev.certforge.labs;

/**
 * Provisions and grades hands-on lab sessions. This is the one surface {@code LabsController}
 * calls; {@code LabOrchestratorRouter} is its only implementation, dispatching to {@code
 * SandboxLabOrchestrator} (Vercel Sandbox, ADR 0028) for every lab except the two {@code
 * ContainerLabOrchestrator} temporarily runs over a plain Docker container instead (ADR 0030). A
 * session belongs to the learner who started it; no other authenticated learner can complete or
 * observe it, on either engine.
 */
public interface LabOrchestrator {

  /**
   * Starts a session for the named lab: creates its sandbox, runs whatever provisioning the {@link
   * LabSpec} needs (e.g. starting a nested Docker daemon), and opens interactive access.
   *
   * @throws java.util.NoSuchElementException if no lab is shipped under that id
   */
  LabSession start(String labId);

  /**
   * Grades a session against its lab's {@link LabEvaluation} checks, as the orchestrator's own
   * calls -- never the learner's terminal session -- and stops the session unconditionally
   * afterward (ADR 0027 decision 5), whether grading succeeded or not.
   *
   * @throws java.util.NoSuchElementException if no session was started under that id, or it was
   *     started by a different learner than the current caller -- the same exception either way, so
   *     a caller probing ids cannot tell a missing session from someone else's
   */
  LabVerdict complete(String sessionId);
}

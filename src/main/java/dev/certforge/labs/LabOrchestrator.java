package dev.certforge.labs;

/**
 * Provisions and grades hands-on lab sessions on Vercel Sandbox (ADR 0028). This is the one surface
 * a future controller calls -- it owns the Sandbox API credential and the session's lifecycle;
 * nothing about the learner's own command stream passes through it (ADR 0029).
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
   * @throws java.util.NoSuchElementException if no session was started under that id
   */
  LabVerdict complete(String sessionId);
}

package dev.certforge.labs.internal;

import dev.certforge.identity.ActorId;
import dev.certforge.identity.CurrentActor;
import dev.certforge.labs.LabCatalog;
import dev.certforge.labs.LabCheckResult;
import dev.certforge.labs.LabEvaluationCheck;
import dev.certforge.labs.LabOrchestrator;
import dev.certforge.labs.LabSession;
import dev.certforge.labs.LabSpec;
import dev.certforge.labs.LabVerdict;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

/**
 * {@link LabOrchestrator} over {@link VercelSandboxClient} (ADR 0028). Session-to-lab tracking is
 * in-memory, per application instance -- the same posture {@code IdentityProperties.Throttle}
 * already takes for this project's other per-instance runtime state, and sessions are already
 * bounded in number and lifetime ({@code LabSandbox.timeoutSeconds}), so nothing here needs to
 * survive a restart.
 */
@Component
class SandboxLabOrchestrator implements LabOrchestrator {

  private record StartedSession(String labId, ActorId learner) {}

  private final LabCatalog catalog;
  private final VercelSandboxClient client;
  private final CurrentActor currentActor;
  private final Map<String, StartedSession> sessionsById = new ConcurrentHashMap<>();

  SandboxLabOrchestrator(
      LabCatalog catalog, VercelSandboxClient client, CurrentActor currentActor) {
    this.catalog = catalog;
    this.client = client;
    this.currentActor = currentActor;
  }

  @Override
  public LabSession start(String labId) {
    LabSpec spec = requireLab(labId);
    String sessionId = client.createSession(spec);
    provision(sessionId, spec);
    VercelSandboxClient.InteractiveCredential credential = client.openInteractive(sessionId);
    sessionsById.put(sessionId, new StartedSession(labId, currentActor.require()));
    return new LabSession(sessionId, labId, credential.url(), credential.token());
  }

  /**
   * @throws NoSuchElementException if no session was started under that id, or it was started by a
   *     different learner -- the same outcome either way, so a caller probing ids cannot tell one
   *     apart from the other.
   */
  @Override
  public LabVerdict complete(String sessionId) {
    StartedSession session = sessionsById.get(sessionId);
    if (session == null || !session.learner().equals(currentActor.require())) {
      throw new NoSuchElementException("no session " + sessionId);
    }
    sessionsById.remove(sessionId);
    LabSpec spec = requireLab(session.labId());
    try {
      return grade(sessionId, spec);
    } finally {
      client.stop(sessionId);
    }
  }

  /**
   * Starts whatever a lab's fixture needs running before the learner's interactive session begins.
   * The Docker lab's image installs {@code docker.io} at build time but starts no daemon -- there
   * is no systemd here to do that automatically (ADR 0028 decision 7), so this is the one place a
   * nested daemon is started, once, outside the learner's own command stream.
   */
  private void provision(String sessionId, LabSpec spec) {
    if (spec.allowedCommands().contains("docker")) {
      client.startDetached(sessionId, "dockerd", List.of(), true);
    }
  }

  /**
   * Runs every {@link LabEvaluationCheck} as this orchestrator's own call -- never the learner's
   * terminal-bridge session (ADR 0027 decision 4) -- through a shell, since a probe like a size
   * budget check (`size=$(...); test ...`) needs one to evaluate; that shell is never given
   * anything the learner typed, only the LabSpec's own committed probe text.
   */
  private LabVerdict grade(String sessionId, LabSpec spec) {
    List<LabCheckResult> results = new ArrayList<>();
    long timeoutMs = spec.sandbox().timeoutSeconds() * 1000L;
    for (LabEvaluationCheck check : spec.evaluation().checks()) {
      int exitCode =
          client.runToCompletion(sessionId, "sh", List.of("-c", check.probe()), false, timeoutMs);
      results.add(new LabCheckResult(check.description(), exitCode == 0));
    }
    boolean passed = results.stream().allMatch(LabCheckResult::passed);
    return new LabVerdict(passed, List.copyOf(results));
  }

  private LabSpec requireLab(String labId) {
    return catalog
        .findByLabId(labId)
        .orElseThrow(() -> new NoSuchElementException("no lab named " + labId));
  }
}

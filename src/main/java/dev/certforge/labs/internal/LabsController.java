package dev.certforge.labs.internal;

import dev.certforge.labs.LabCatalog;
import dev.certforge.labs.LabOrchestrator;
import dev.certforge.labs.LabSession;
import dev.certforge.labs.LabSpec;
import dev.certforge.labs.LabSummary;
import dev.certforge.labs.LabVerdict;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Starts and grades hands-on lab sessions. {@link #start} hands back a credential for the learner's
 * browser to reach the session's terminal -- for most labs, Vercel's own controller-hosted PTY,
 * never touching this backend (ADR 0029); for the two labs ADR 0030 temporarily runs over a plain
 * container, this project's own terminal bridge instead ({@code LabTerminalWebSocketHandler}).
 */
@RestController
@RequestMapping("/api/labs")
@PreAuthorize("hasAuthority('STUDY')")
class LabsController {

  private final LabOrchestrator orchestrator;
  private final LabCatalog catalog;

  LabsController(LabOrchestrator orchestrator, LabCatalog catalog) {
    this.orchestrator = orchestrator;
    this.catalog = catalog;
  }

  /** The shipped catalog, in the one shape a learner needs to decide which lab to start. */
  @GetMapping
  List<LabSummary> list() {
    return catalog.all().stream().map(LabsController::summarize).toList();
  }

  private static LabSummary summarize(LabSpec spec) {
    return new LabSummary(
        spec.labId(),
        spec.objective().title(),
        spec.objective().description(),
        spec.sandbox().timeoutSeconds());
  }

  @PostMapping("/{labId}/sessions")
  @ResponseStatus(HttpStatus.CREATED)
  LabSession start(@PathVariable String labId) {
    try {
      return orchestrator.start(labId);
    } catch (NoSuchElementException e) {
      throw LabsException.notFound("lab_not_found", "Lab not found");
    }
  }

  @PostMapping("/sessions/{sessionId}/complete")
  LabVerdict complete(@PathVariable String sessionId) {
    try {
      return orchestrator.complete(sessionId);
    } catch (NoSuchElementException e) {
      throw LabsException.notFound("lab_session_not_found", "Lab session not found");
    }
  }
}

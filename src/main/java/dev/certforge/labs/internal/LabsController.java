package dev.certforge.labs.internal;

import dev.certforge.labs.LabOrchestrator;
import dev.certforge.labs.LabSession;
import dev.certforge.labs.LabVerdict;
import java.util.NoSuchElementException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * Starts and grades hands-on lab sessions. The learner's own command stream never passes through
 * this backend (ADR 0029): {@link #start} only hands back the one-time credential their browser
 * uses to reach Vercel's controller-hosted terminal directly.
 */
@RestController
@RequestMapping("/api/labs")
@PreAuthorize("hasAuthority('STUDY')")
class LabsController {

  private final LabOrchestrator orchestrator;

  LabsController(LabOrchestrator orchestrator) {
    this.orchestrator = orchestrator;
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

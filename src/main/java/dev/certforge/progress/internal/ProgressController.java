package dev.certforge.progress.internal;

import dev.certforge.progress.internal.ProgressViews.RebuildResult;
import dev.certforge.progress.internal.ProgressViews.Reconciliation;
import dev.certforge.progress.internal.ProgressViews.TopicProgress;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** The learner's own progress. Every operation requires the STUDY permission. */
@RestController
@RequestMapping("/api/progress")
@PreAuthorize("hasAuthority('STUDY')")
class ProgressController {

  private final ProgressService service;

  ProgressController(ProgressService service) {
    this.service = service;
  }

  @GetMapping("/topics")
  List<TopicProgress> topics() {
    return service.topics();
  }

  /** Whether the stored projection matches the attempts, and where it does not. */
  @GetMapping("/reconciliation")
  Reconciliation reconciliation() {
    return service.reconcile();
  }

  /** Recomputes the projection from the attempts. Safe to call at any time. */
  @PostMapping("/rebuild")
  RebuildResult rebuild() {
    return service.rebuild();
  }
}

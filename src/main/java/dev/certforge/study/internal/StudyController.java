package dev.certforge.study.internal;

import dev.certforge.study.internal.SessionViews.SessionSummary;
import dev.certforge.study.internal.SessionViews.SessionView;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Learner study sessions. Every operation requires the STUDY permission. */
@RestController
@RequestMapping("/api/study/sessions")
@PreAuthorize("hasAuthority('STUDY')")
class StudyController {

  private final StudyService service;

  StudyController(StudyService service) {
    this.service = service;
  }

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  SessionView start(@Valid @RequestBody StartRequest request) {
    return service.start(request.topicId(), request.questionCount(), request.revisionIds());
  }

  @GetMapping
  List<SessionSummary> list(@RequestParam(required = false) SessionStatus status) {
    return service.list(status);
  }

  @GetMapping("/{sessionId}")
  SessionView get(@PathVariable UUID sessionId) {
    return service.get(sessionId);
  }

  @PostMapping("/{sessionId}/complete")
  SessionView complete(@PathVariable UUID sessionId) {
    return service.complete(sessionId);
  }

  @PostMapping("/{sessionId}/abandon")
  SessionView abandon(@PathVariable UUID sessionId) {
    return service.abandon(sessionId);
  }

  /** {@code questionCount} is optional; the server applies its default and limits. */
  record StartRequest(@NotNull UUID topicId, Integer questionCount, List<UUID> revisionIds) {}
}

package dev.certforge.audit.internal;

import dev.certforge.audit.internal.AuditRepository.EventRow;
import dev.certforge.platform.Page;
import dev.certforge.platform.PageCursor;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** Read access to the audit trail, for administrators with the AUDIT_READ permission. */
@RestController
@RequestMapping("/api/admin/audit")
@PreAuthorize("hasAuthority('AUDIT_READ')")
class AuditController {

  /** One recorded fact: who did what to which subject, when, and in which request. */
  record AuditEventView(
      UUID id, UUID actorId, String action, String subject, Instant occurredAt, String requestId) {}

  private final AuditRepository repository;

  AuditController(AuditRepository repository) {
    this.repository = repository;
  }

  /** Events newest first with keyset pagination. Filters: subject, actor and action. */
  @GetMapping
  @Transactional(readOnly = true)
  ResponseEntity<Page<AuditEventView>> events(
      @RequestParam(required = false) String subject,
      @RequestParam(required = false) UUID actorId,
      @RequestParam(required = false) String action,
      @RequestParam(required = false) String cursor,
      @RequestParam(required = false) Integer size) {
    int limit = Page.size(size);
    List<EventRow> rows =
        repository.find(subject, actorId, action, PageCursor.decodeOrNull(cursor), limit + 1);
    Page<AuditEventView> page =
        Page.of(
            rows,
            limit,
            row ->
                new AuditEventView(
                    row.id(),
                    row.actorId(),
                    row.action(),
                    row.subject(),
                    row.occurredAt(),
                    row.requestId()),
            row -> new PageCursor(row.occurredAt(), row.id()));
    return ResponseEntity.ok().cacheControl(CacheControl.noStore()).body(page);
  }
}

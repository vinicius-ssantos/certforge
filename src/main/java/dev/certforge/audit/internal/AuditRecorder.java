package dev.certforge.audit.internal;

import dev.certforge.audit.AuditFact;
import dev.certforge.audit.internal.AuditRepository.EventRow;
import dev.certforge.platform.RequestId;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * Persists every published {@link AuditFact}. The listener runs synchronously inside the
 * transaction of the action being audited, so the action and its audit record commit or roll back
 * together: there is never an audited action without a record, nor a record of an action that did
 * not happen. If the record cannot be written, the action fails.
 */
@Component
class AuditRecorder {

  private final AuditRepository repository;

  AuditRecorder(AuditRepository repository) {
    this.repository = repository;
  }

  @EventListener
  void record(AuditFact fact) {
    repository.insert(
        new EventRow(
            UUID.randomUUID(),
            fact.actor().value(),
            fact.action(),
            fact.subject(),
            fact.occurredAt().truncatedTo(ChronoUnit.MICROS),
            RequestId.current()));
  }
}

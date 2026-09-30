package dev.certforge.audit;

import dev.certforge.identity.ActorId;
import java.time.Instant;
import java.util.Objects;

/**
 * Immutable record of an auditable administrative action. Other modules describe what happened
 * through this type instead of reaching into audit persistence.
 */
public record AuditFact(ActorId actor, String action, String subject, Instant occurredAt) {

  public AuditFact {
    Objects.requireNonNull(actor, "actor");
    Objects.requireNonNull(action, "action");
    Objects.requireNonNull(subject, "subject");
    Objects.requireNonNull(occurredAt, "occurredAt");
  }
}

package dev.certforge.audit.internal;

import dev.certforge.platform.PageCursor;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
class AuditRepository {

  record EventRow(
      UUID id, UUID actorId, String action, String subject, Instant occurredAt, String requestId) {}

  private final JdbcClient jdbc;

  AuditRepository(JdbcClient jdbc) {
    this.jdbc = jdbc;
  }

  void insert(EventRow row) {
    jdbc.sql(
            "insert into certforge.audit_event (id, actor_id, action, subject, occurred_at,"
                + " request_id) values (:id, :actor, :action, :subject, :at, :request)")
        .param("id", row.id())
        .param("actor", row.actorId())
        .param("action", row.action())
        .param("subject", row.subject())
        .param("at", OffsetDateTime.ofInstant(row.occurredAt(), ZoneOffset.UTC))
        .param("request", row.requestId())
        .update();
  }

  /** Events newest first, strictly after the cursor, optionally filtered. */
  List<EventRow> find(String subject, UUID actorId, String action, PageCursor after, int limit) {
    StringBuilder where = new StringBuilder(" where true");
    if (subject != null) {
      where.append(" and subject = :subject");
    }
    if (actorId != null) {
      where.append(" and actor_id = :actor");
    }
    if (action != null) {
      where.append(" and action = :action");
    }
    if (after != null) {
      where.append(" and (occurred_at, id) < (:cursorAt, :cursorId)");
    }
    var statement =
        jdbc.sql(
                "select id, actor_id, action, subject, occurred_at, request_id"
                    + " from certforge.audit_event"
                    + where
                    + " order by occurred_at desc, id desc limit :limit")
            .param("limit", limit);
    if (subject != null) {
      statement = statement.param("subject", subject);
    }
    if (actorId != null) {
      statement = statement.param("actor", actorId);
    }
    if (action != null) {
      statement = statement.param("action", action);
    }
    if (after != null) {
      statement =
          statement
              .param("cursorAt", OffsetDateTime.ofInstant(after.at(), ZoneOffset.UTC))
              .param("cursorId", after.id());
    }
    return statement
        .query(
            (rs, n) ->
                new EventRow(
                    rs.getObject("id", UUID.class),
                    rs.getObject("actor_id", UUID.class),
                    rs.getString("action"),
                    rs.getString("subject"),
                    rs.getObject("occurred_at", OffsetDateTime.class).toInstant(),
                    rs.getString("request_id")))
        .list();
  }
}

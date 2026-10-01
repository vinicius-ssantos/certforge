-- Audit module: an append-only record of integrity-relevant administrative facts.
--
-- Each row says who did what to which subject and when, and carries the correlation id of the
-- request so it can be tied to the logs. Rows are written in the same transaction as the action
-- they describe, so an action and its audit record commit or roll back together.

CREATE TABLE certforge.audit_event (
    id          UUID         PRIMARY KEY,
    actor_id    UUID         NOT NULL,
    action      VARCHAR(64)  NOT NULL,
    subject     VARCHAR(200) NOT NULL,
    occurred_at TIMESTAMPTZ  NOT NULL,
    request_id  VARCHAR(64)
);

CREATE INDEX audit_event_recent  ON certforge.audit_event (occurred_at DESC, id DESC);
CREATE INDEX audit_event_subject ON certforge.audit_event (subject, occurred_at DESC);
CREATE INDEX audit_event_actor   ON certforge.audit_event (actor_id, occurred_at DESC);

-- Audit evidence is never rewritten or removed, by anyone.
CREATE FUNCTION certforge.audit_guard_event() RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'Audit event % is append-only', OLD.id;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_guard_event
    BEFORE UPDATE OR DELETE ON certforge.audit_event
    FOR EACH ROW EXECUTE FUNCTION certforge.audit_guard_event();

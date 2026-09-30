-- Study module: topic-focused study sessions and their immutable question snapshot.
-- Tables are owned by the study module. Other modules are referenced by id only, with no
-- cross-module foreign keys.

CREATE TABLE certforge.study_session (
    id              UUID        PRIMARY KEY,
    learner_id      UUID        NOT NULL,
    topic_id        UUID        NOT NULL,
    exam_version_id UUID        NOT NULL,
    status          VARCHAR(16) NOT NULL DEFAULT 'IN_PROGRESS'
        CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'ABANDONED', 'EXPIRED')),
    requested_count INT         NOT NULL CHECK (requested_count >= 1),
    created_at      TIMESTAMPTZ NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL,
    closed_at       TIMESTAMPTZ,
    CHECK ((status = 'IN_PROGRESS') = (closed_at IS NULL))
);

-- A learner has at most one session in progress per topic. This also makes concurrent starts
-- safe: exactly one of them can insert.
CREATE UNIQUE INDEX study_session_one_active
    ON certforge.study_session (learner_id, topic_id) WHERE status = 'IN_PROGRESS';

CREATE INDEX study_session_learner ON certforge.study_session (learner_id, created_at DESC);

-- The snapshot: which revisions the session contains and in which order. Revisions are
-- immutable, so this is enough to keep a session stable when content is later replaced or
-- deprecated.
CREATE TABLE certforge.study_session_question (
    session_id  UUID NOT NULL REFERENCES certforge.study_session (id),
    position    INT  NOT NULL CHECK (position >= 0),
    revision_id UUID NOT NULL,
    PRIMARY KEY (session_id, position),
    UNIQUE (session_id, revision_id)
);

-- The snapshot is frozen once written: rows can never be updated or deleted, and can only be
-- inserted by the transaction that created the session itself.
CREATE FUNCTION certforge.study_guard_snapshot() RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
        RAISE EXCEPTION 'The question snapshot of study session % is immutable', OLD.session_id;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM certforge.study_session
         WHERE id = NEW.session_id AND xmin = pg_current_xact_id()::xid) THEN
        RAISE EXCEPTION 'The question snapshot of study session % is immutable', NEW.session_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER study_guard_snapshot
    BEFORE INSERT OR UPDATE OR DELETE ON certforge.study_session_question
    FOR EACH ROW EXECUTE FUNCTION certforge.study_guard_snapshot();

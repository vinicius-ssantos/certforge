-- Study module: timed mock exams, immutable question snapshots and immutable submitted responses.
-- Mock exams are intentionally separate from ordinary topic-focused study sessions. They share
-- identities and published question revisions, but keep their own lifecycle and evidence contract.

CREATE TABLE certforge.mock_exam_session (
    id                    UUID        PRIMARY KEY,
    learner_id            UUID        NOT NULL,
    track_id              UUID        NOT NULL,
    exam_version_id       UUID        NOT NULL,
    status                VARCHAR(16) NOT NULL DEFAULT 'IN_PROGRESS'
        CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'EXPIRED')),
    question_count        INT         NOT NULL CHECK (question_count >= 1),
    time_limit_seconds    BIGINT      NOT NULL CHECK (time_limit_seconds >= 1),
    passing_percentage    INT         NOT NULL CHECK (passing_percentage BETWEEN 1 AND 100),
    questions_per_topic   INT         NOT NULL CHECK (questions_per_topic >= 1),
    created_at            TIMESTAMPTZ NOT NULL,
    expires_at            TIMESTAMPTZ NOT NULL,
    closed_at             TIMESTAMPTZ,
    CHECK (question_count % questions_per_topic = 0),
    CHECK (expires_at > created_at),
    CHECK ((status = 'IN_PROGRESS') = (closed_at IS NULL))
);

-- Resume means there is at most one in-progress mock per learner and preparation track.
CREATE UNIQUE INDEX mock_exam_one_active
    ON certforge.mock_exam_session (learner_id, track_id)
    WHERE status = 'IN_PROGRESS';

CREATE INDEX mock_exam_learner
    ON certforge.mock_exam_session (learner_id, created_at DESC);

CREATE TABLE certforge.mock_exam_question (
    session_id  UUID NOT NULL REFERENCES certforge.mock_exam_session (id),
    position    INT  NOT NULL CHECK (position >= 0),
    topic_id    UUID NOT NULL,
    revision_id UUID NOT NULL,
    PRIMARY KEY (session_id, position),
    UNIQUE (session_id, revision_id)
);

-- The plan is an immutable snapshot: a later publication, replacement or deprecation cannot alter
-- the exact questions, topics or order of an already-started mock.
CREATE FUNCTION certforge.mock_exam_guard_snapshot() RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'DELETE' OR TG_OP = 'UPDATE' THEN
        RAISE EXCEPTION 'The question snapshot of mock exam % is immutable', OLD.session_id;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM certforge.mock_exam_session
         WHERE id = NEW.session_id AND xmin = pg_current_xact_id()::xid) THEN
        RAISE EXCEPTION 'The question snapshot of mock exam % is immutable', NEW.session_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mock_exam_guard_snapshot
    BEFORE INSERT OR UPDATE OR DELETE ON certforge.mock_exam_question
    FOR EACH ROW EXECUTE FUNCTION certforge.mock_exam_guard_snapshot();

CREATE TABLE certforge.mock_exam_response (
    id                  UUID         PRIMARY KEY,
    session_id          UUID         NOT NULL,
    position            INT          NOT NULL,
    learner_id          UUID         NOT NULL,
    revision_id         UUID         NOT NULL,
    selected_options    VARCHAR(64)  NOT NULL,
    submitted_at        TIMESTAMPTZ  NOT NULL,
    idempotency_key     VARCHAR(64)  NOT NULL,
    request_fingerprint CHAR(64)     NOT NULL,
    FOREIGN KEY (session_id, position)
        REFERENCES certforge.mock_exam_question (session_id, position),
    UNIQUE (session_id, position),
    UNIQUE (learner_id, idempotency_key)
);

CREATE INDEX mock_exam_response_learner
    ON certforge.mock_exam_response (learner_id, submitted_at DESC);

-- Responses are immutable evidence. Insertion requires an in-progress mock owned by the learner,
-- the exact snapshotted revision at that position and a submission timestamp not after expires_at.
-- The row lock serializes response insertion against closing the mock.
CREATE FUNCTION certforge.mock_exam_guard_response() RETURNS trigger AS $$
DECLARE
    expected_revision UUID;
    deadline TIMESTAMPTZ;
BEGIN
    IF TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'Mock exam response % is immutable evidence', OLD.id;
    END IF;

    SELECT q.revision_id, s.expires_at
      INTO expected_revision, deadline
      FROM certforge.mock_exam_session s
      JOIN certforge.mock_exam_question q
        ON q.session_id = s.id AND q.position = NEW.position
     WHERE s.id = NEW.session_id
       AND s.learner_id = NEW.learner_id
       AND s.status = 'IN_PROGRESS'
     FOR SHARE OF s;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Mock exam % is not in progress for this learner', NEW.session_id;
    END IF;
    IF expected_revision <> NEW.revision_id THEN
        RAISE EXCEPTION 'Mock exam response revision does not match the snapshot';
    END IF;
    IF NEW.submitted_at > deadline THEN
        RAISE EXCEPTION 'Mock exam % has expired', NEW.session_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mock_exam_guard_response
    BEFORE INSERT OR UPDATE OR DELETE ON certforge.mock_exam_response
    FOR EACH ROW EXECUTE FUNCTION certforge.mock_exam_guard_response();

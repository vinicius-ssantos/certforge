-- Study module: immutable evidence of submitted answers.
--
-- One accepted attempt per session question. The idempotency key is scoped to the learner, so a
-- retried request can be recognised and answered with the original result.

CREATE TABLE certforge.study_attempt (
    id                  UUID         PRIMARY KEY,
    session_id          UUID         NOT NULL,
    position            INT          NOT NULL,
    learner_id          UUID         NOT NULL,
    -- The exact revision shown to the learner, taken from the session snapshot.
    revision_id         UUID         NOT NULL,
    selected_options    VARCHAR(64)  NOT NULL,
    correct             BOOLEAN      NOT NULL,
    confidence          VARCHAR(8)   NOT NULL CHECK (confidence IN ('LOW', 'MEDIUM', 'HIGH')),
    elapsed_ms          BIGINT       NOT NULL CHECK (elapsed_ms BETWEEN 0 AND 86400000),
    submitted_at        TIMESTAMPTZ  NOT NULL,
    idempotency_key     VARCHAR(64)  NOT NULL,
    request_fingerprint CHAR(64)     NOT NULL,
    FOREIGN KEY (session_id, position)
        REFERENCES certforge.study_session_question (session_id, position),
    UNIQUE (session_id, position),
    UNIQUE (learner_id, idempotency_key)
);

CREATE INDEX study_attempt_learner ON certforge.study_attempt (learner_id, submitted_at DESC);

-- Attempts are evidence: never updated or deleted. Inserting requires the session to belong to
-- the learner and to be in progress; the row lock makes closing a session wait for an attempt
-- that is being written, so no attempt can slip in after a session is closed.
CREATE FUNCTION certforge.study_guard_attempt() RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'Study attempt % is immutable evidence', OLD.id;
    END IF;
    PERFORM 1 FROM certforge.study_session
     WHERE id = NEW.session_id AND learner_id = NEW.learner_id AND status = 'IN_PROGRESS'
       FOR SHARE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Study session % is not in progress for this learner', NEW.session_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER study_guard_attempt
    BEFORE INSERT OR UPDATE OR DELETE ON certforge.study_attempt
    FOR EACH ROW EXECUTE FUNCTION certforge.study_guard_attempt();

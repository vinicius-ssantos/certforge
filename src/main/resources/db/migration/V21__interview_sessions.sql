-- #21: interview study sessions — a third study aggregate, beside ordinary sessions and mock runs.
--
-- ADR 0020 explains why it is a third one rather than a kind column on study_session: an interview
-- session spans a subset of topics, mixes objective and guided-response items whose evaluation
-- cannot be the same, exposes reviewed follow-up prompts, and must not move certification
-- readiness. ADR 0015 already refused to put a second set of semantics into the study aggregate;
-- this is that refusal a second time.
CREATE TABLE certforge.interview_session (
    id               UUID        PRIMARY KEY,
    learner_id       UUID        NOT NULL,
    track_version_id UUID        NOT NULL REFERENCES certforge.catalog_track_version (id),
    status           VARCHAR(16) NOT NULL DEFAULT 'IN_PROGRESS'
        CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'ABANDONED', 'EXPIRED')),
    requested_count  INT         NOT NULL CHECK (requested_count >= 1),
    created_at       TIMESTAMPTZ NOT NULL,
    expires_at       TIMESTAMPTZ NOT NULL,
    closed_at        TIMESTAMPTZ,
    CHECK ((status = 'IN_PROGRESS') = (closed_at IS NULL))
);

-- One interview session in progress per learner per track version, enforced by a partial unique
-- index so concurrent starts are safe: exactly one of them can insert.
CREATE UNIQUE INDEX interview_session_one_active
    ON certforge.interview_session (learner_id, track_version_id) WHERE status = 'IN_PROGRESS';

CREATE INDEX interview_session_learner
    ON certforge.interview_session (learner_id, created_at DESC);

-- The ordered snapshot, frozen by the database below: later publication, replacement or
-- deprecation of a revision never changes a session in flight, and a completed session cannot be
-- rewritten by a content edit.
CREATE TABLE certforge.interview_session_question (
    session_id  UUID NOT NULL REFERENCES certforge.interview_session (id),
    position    INT  NOT NULL CHECK (position >= 0),
    revision_id UUID NOT NULL REFERENCES certforge.qb_question_revision (id),
    topic_id    UUID NOT NULL REFERENCES certforge.catalog_topic (id),
    PRIMARY KEY (session_id, position),
    UNIQUE (session_id, revision_id)
);

-- What a learner did with one item.
--
-- Two kinds of row in one table, and the check constraint is what keeps them from being confused:
--
--   * an OBJECTIVE response carries the options selected and whether they were correct, exactly as
--     a study attempt does;
--   * a GUIDED response carries neither, because ADR 0019 scores nothing about a guided answer. It
--     records that the learner answered and how long they took. Their own words stay in their
--     browser and are never sent: there is no use the product could make of them that would not be
--     a claim about the person.
CREATE TABLE certforge.interview_response (
    id                  UUID         PRIMARY KEY,
    session_id          UUID         NOT NULL,
    position            INT          NOT NULL,
    learner_id          UUID         NOT NULL,
    -- The exact revision shown to the learner, taken from the session snapshot.
    revision_id         UUID         NOT NULL,
    item_kind           VARCHAR(16)  NOT NULL CHECK (item_kind IN ('OBJECTIVE', 'GUIDED')),
    selected_options    VARCHAR(64),
    correct             BOOLEAN,
    confidence          VARCHAR(8)   NOT NULL CHECK (confidence IN ('LOW', 'MEDIUM', 'HIGH')),
    elapsed_ms          BIGINT       NOT NULL CHECK (elapsed_ms BETWEEN 0 AND 86400000),
    submitted_at        TIMESTAMPTZ  NOT NULL,
    idempotency_key     VARCHAR(64)  NOT NULL,
    request_fingerprint CHAR(64)     NOT NULL,
    FOREIGN KEY (session_id, position)
        REFERENCES certforge.interview_session_question (session_id, position),
    UNIQUE (session_id, position),
    UNIQUE (learner_id, idempotency_key),
    CHECK (
        (item_kind = 'OBJECTIVE' AND selected_options IS NOT NULL AND correct IS NOT NULL)
        OR (item_kind = 'GUIDED' AND selected_options IS NULL AND correct IS NULL)
    )
);

CREATE INDEX interview_response_learner
    ON certforge.interview_response (learner_id, submitted_at DESC);

-- Responses are evidence: never updated or deleted. Inserting requires the session to belong to
-- the learner and to be in progress; the row lock makes closing a session wait for a response that
-- is being written, so none can slip in after the session closes. Copied in shape from
-- study_guard_attempt, deliberately: the guarantee is the same one and should read the same way.
CREATE FUNCTION certforge.interview_guard_response() RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'Interview response % is immutable evidence', OLD.id;
    END IF;
    PERFORM 1 FROM certforge.interview_session
     WHERE id = NEW.session_id AND learner_id = NEW.learner_id AND status = 'IN_PROGRESS'
       FOR SHARE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Interview session % is not in progress for this learner', NEW.session_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER interview_response_is_evidence
    BEFORE INSERT OR UPDATE OR DELETE ON certforge.interview_response
    FOR EACH ROW EXECUTE FUNCTION certforge.interview_guard_response();

-- The snapshot is frozen the same way, and for the same reason: a session is reproducible from its
-- own evidence only if nothing can reorder or replace what it showed.
CREATE FUNCTION certforge.interview_guard_snapshot() RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'Interview session snapshot is immutable';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER interview_session_question_is_frozen
    BEFORE INSERT OR UPDATE OR DELETE ON certforge.interview_session_question
    FOR EACH ROW EXECUTE FUNCTION certforge.interview_guard_snapshot();

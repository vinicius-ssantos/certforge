-- Question bank module: logical questions, immutable revisions, options, references, reviews.
-- Tables are owned by the question-bank module; other modules reference revisions by id only.

CREATE TABLE certforge.qb_question (
    id         UUID        PRIMARY KEY,
    created_by UUID        NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE certforge.qb_question_revision (
    id                   UUID        PRIMARY KEY,
    question_id          UUID        NOT NULL REFERENCES certforge.qb_question (id),
    revision_number      INT         NOT NULL CHECK (revision_number >= 1),
    status               VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
        CHECK (status IN ('DRAFT', 'TECHNICAL_REVIEW', 'APPROVED', 'PUBLISHED', 'DEPRECATED')),
    question_type        VARCHAR(20) NOT NULL CHECK (question_type IN ('SINGLE_CHOICE', 'MULTIPLE_CHOICE')),
    topic_id             UUID,
    java_release         INT CHECK (java_release > 0),
    difficulty           VARCHAR(10) CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    difficulty_rationale TEXT,
    prompt               TEXT,
    explanation          TEXT,
    author_id            UUID        NOT NULL,
    -- Bound to the certification context when the revision is published.
    exam_version_id      UUID,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    submitted_at         TIMESTAMPTZ,
    published_at         TIMESTAMPTZ,
    published_by         UUID,
    deprecated_at        TIMESTAMPTZ,
    UNIQUE (question_id, revision_number)
);

-- A question has at most one published revision per exam context.
CREATE UNIQUE INDEX qb_revision_one_published
    ON certforge.qb_question_revision (question_id, exam_version_id) WHERE status = 'PUBLISHED';

-- A question has at most one revision being authored, reviewed or awaiting publication.
CREATE UNIQUE INDEX qb_revision_one_open
    ON certforge.qb_question_revision (question_id)
    WHERE status IN ('DRAFT', 'TECHNICAL_REVIEW', 'APPROVED');

CREATE INDEX qb_revision_published_topic
    ON certforge.qb_question_revision (topic_id) WHERE status = 'PUBLISHED';

CREATE TABLE certforge.qb_revision_option (
    revision_id UUID        NOT NULL REFERENCES certforge.qb_question_revision (id),
    option_key  VARCHAR(1)  NOT NULL CHECK (option_key ~ '^[A-Z]$'),
    position    INT         NOT NULL CHECK (position >= 0),
    text        TEXT        NOT NULL,
    correct     BOOLEAN     NOT NULL,
    explanation TEXT,
    PRIMARY KEY (revision_id, option_key),
    UNIQUE (revision_id, position)
);

CREATE TABLE certforge.qb_revision_reference (
    revision_id UUID         NOT NULL REFERENCES certforge.qb_question_revision (id),
    position    INT          NOT NULL CHECK (position >= 0),
    title       VARCHAR(300) NOT NULL,
    url         VARCHAR(500) NOT NULL,
    PRIMARY KEY (revision_id, position)
);

CREATE TABLE certforge.qb_content_review (
    id          UUID        PRIMARY KEY,
    revision_id UUID        NOT NULL REFERENCES certforge.qb_question_revision (id),
    reviewer_id UUID        NOT NULL,
    decision    VARCHAR(20) NOT NULL CHECK (decision IN ('APPROVED', 'CHANGES_REQUESTED')),
    comment     TEXT,
    decided_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Immutability guards. The application enforces the same rules; these triggers make them hold
-- for every writer. Content is editable only while a revision is a DRAFT. Once submitted, only
-- lifecycle columns (status, timestamps, exam_version_id, published_by) may change.

CREATE FUNCTION certforge.qb_guard_revision() RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        IF OLD.status <> 'DRAFT' THEN
            RAISE EXCEPTION 'Question revision % is % and cannot be deleted', OLD.id, OLD.status;
        END IF;
        RETURN OLD;
    END IF;
    IF OLD.status <> 'DRAFT' AND (
           NEW.question_id          IS DISTINCT FROM OLD.question_id
        OR NEW.revision_number      IS DISTINCT FROM OLD.revision_number
        OR NEW.question_type        IS DISTINCT FROM OLD.question_type
        OR NEW.topic_id             IS DISTINCT FROM OLD.topic_id
        OR NEW.java_release         IS DISTINCT FROM OLD.java_release
        OR NEW.difficulty           IS DISTINCT FROM OLD.difficulty
        OR NEW.difficulty_rationale IS DISTINCT FROM OLD.difficulty_rationale
        OR NEW.prompt               IS DISTINCT FROM OLD.prompt
        OR NEW.explanation          IS DISTINCT FROM OLD.explanation
        OR NEW.author_id            IS DISTINCT FROM OLD.author_id) THEN
        RAISE EXCEPTION 'Question revision % is % and its content is immutable', OLD.id, OLD.status;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER qb_guard_revision
    BEFORE UPDATE OR DELETE ON certforge.qb_question_revision
    FOR EACH ROW EXECUTE FUNCTION certforge.qb_guard_revision();

CREATE FUNCTION certforge.qb_guard_revision_child() RETURNS trigger AS $$
DECLARE
    parent_id     UUID;
    parent_status VARCHAR(20);
BEGIN
    IF TG_OP = 'DELETE' THEN
        parent_id := OLD.revision_id;
    ELSE
        parent_id := NEW.revision_id;
    END IF;
    SELECT status INTO parent_status FROM certforge.qb_question_revision WHERE id = parent_id;
    IF parent_status IS NOT NULL AND parent_status <> 'DRAFT' THEN
        RAISE EXCEPTION 'Question revision % is % and its options and references are immutable',
            parent_id, parent_status;
    END IF;
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER qb_guard_option
    BEFORE INSERT OR UPDATE OR DELETE ON certforge.qb_revision_option
    FOR EACH ROW EXECUTE FUNCTION certforge.qb_guard_revision_child();

CREATE TRIGGER qb_guard_reference
    BEFORE INSERT OR UPDATE OR DELETE ON certforge.qb_revision_reference
    FOR EACH ROW EXECUTE FUNCTION certforge.qb_guard_revision_child();

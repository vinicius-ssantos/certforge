-- Guided-response interview questions (#19).
-- The criteria belong to the immutable revision: a later edit creates a new revision rather than
-- changing what a learner's historical response was evaluated/self-reviewed against.

ALTER TABLE certforge.qb_question_revision
    DROP CONSTRAINT qb_question_revision_question_type_check;

ALTER TABLE certforge.qb_question_revision
    ADD CONSTRAINT qb_question_revision_question_type_check
    CHECK (question_type IN ('SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'GUIDED_RESPONSE'));

CREATE TABLE certforge.qb_guided_response (
    revision_id       UUID PRIMARY KEY REFERENCES certforge.qb_question_revision (id),
    reference_answer  TEXT NOT NULL
);

CREATE TABLE certforge.qb_guided_expected_concept (
    revision_id UUID    NOT NULL REFERENCES certforge.qb_question_revision (id),
    position    INT     NOT NULL CHECK (position >= 0),
    required    BOOLEAN NOT NULL,
    text        TEXT    NOT NULL,
    explanation TEXT,
    PRIMARY KEY (revision_id, position)
);

CREATE TABLE certforge.qb_guided_common_mistake (
    revision_id UUID NOT NULL REFERENCES certforge.qb_question_revision (id),
    position    INT  NOT NULL CHECK (position >= 0),
    text        TEXT NOT NULL,
    PRIMARY KEY (revision_id, position)
);

CREATE TABLE certforge.qb_guided_follow_up (
    revision_id UUID NOT NULL REFERENCES certforge.qb_question_revision (id),
    position    INT  NOT NULL CHECK (position >= 0),
    prompt      TEXT NOT NULL,
    PRIMARY KEY (revision_id, position)
);

-- Reuse the child immutability guard introduced with the question bank. Once a revision leaves
-- DRAFT, its reference answer and criteria are evidence and cannot be rewritten underneath an
-- approval or historical learner response.
CREATE TRIGGER qb_guard_guided_response
    BEFORE INSERT OR UPDATE OR DELETE ON certforge.qb_guided_response
    FOR EACH ROW EXECUTE FUNCTION certforge.qb_guard_revision_child();

CREATE TRIGGER qb_guard_guided_expected_concept
    BEFORE INSERT OR UPDATE OR DELETE ON certforge.qb_guided_expected_concept
    FOR EACH ROW EXECUTE FUNCTION certforge.qb_guard_revision_child();

CREATE TRIGGER qb_guard_guided_common_mistake
    BEFORE INSERT OR UPDATE OR DELETE ON certforge.qb_guided_common_mistake
    FOR EACH ROW EXECUTE FUNCTION certforge.qb_guard_revision_child();

CREATE TRIGGER qb_guard_guided_follow_up
    BEFORE INSERT OR UPDATE OR DELETE ON certforge.qb_guided_follow_up
    FOR EACH ROW EXECUTE FUNCTION certforge.qb_guard_revision_child();

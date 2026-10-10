-- The evidence behind a question's answer: the programme the build compiles and runs, and what it
-- printed (#183).
--
-- Every question in `content/java-se-21` already carries one, and the build checks the answer key
-- against it. Until now none of it reached the database, so a learner was told an answer was
-- correct and never shown the thing that settles it.
--
-- It is stored, not executed. The output recorded here is a fact the build established when the
-- pack was imported; nothing in the running system runs the programme, and code execution stays
-- out of scope.

-- What the programme printed. Nullable: a question without one is still a question, and the
-- content rules do not require it.
ALTER TABLE certforge.qb_question_revision
    ADD COLUMN verification_output TEXT;

-- Every source the build compiles, not only the file the learner sees. Seven questions in the
-- pack are a module graph — `module-info.java` plus the classes it exports — and for those the
-- single file would be the least interesting part. `position` keeps the order the pack lists
-- them in, so the entry point stays first; `path` is the file's place in that graph.
CREATE TABLE certforge.qb_revision_verification_file (
    revision_id UUID NOT NULL REFERENCES certforge.qb_question_revision (id),
    position    INT  NOT NULL CHECK (position >= 0),
    path        TEXT NOT NULL,
    body        TEXT NOT NULL,
    PRIMARY KEY (revision_id, position),
    UNIQUE (revision_id, path)
);

-- The same immutability the rest of a revision's content has. This is evidence a reviewer weighed
-- when they approved the question, and the thing a learner is shown as proof afterwards; it must
-- not be rewritten under either of them.
CREATE TRIGGER qb_guard_revision_verification_file
    BEFORE INSERT OR UPDATE OR DELETE ON certforge.qb_revision_verification_file
    FOR EACH ROW EXECUTE FUNCTION certforge.qb_guard_revision_child();

-- `verification_output` joins the frozen columns for the same reason.
CREATE OR REPLACE FUNCTION certforge.qb_guard_revision() RETURNS trigger AS $$
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
        OR NEW.seniority            IS DISTINCT FROM OLD.seniority
        OR NEW.difficulty           IS DISTINCT FROM OLD.difficulty
        OR NEW.difficulty_rationale IS DISTINCT FROM OLD.difficulty_rationale
        OR NEW.prompt               IS DISTINCT FROM OLD.prompt
        OR NEW.explanation          IS DISTINCT FROM OLD.explanation
        OR NEW.verification_output  IS DISTINCT FROM OLD.verification_output
        OR NEW.author_id            IS DISTINCT FROM OLD.author_id) THEN
        RAISE EXCEPTION 'Question revision % is % and its content is immutable', OLD.id, OLD.status;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

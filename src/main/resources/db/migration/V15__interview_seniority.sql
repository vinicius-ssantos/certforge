-- Seniority (ADR 0016 decision 5), in the two places it belongs.
--
-- A track declares what it prepares someone for, the way catalog_certification_profile already
-- declares which certification a track is about. An interview track prepares someone for a role at
-- a level, and both of those are facts about the track rather than about any one question.
--
-- A question declares the level at which it is expected to be answered. That cannot live only on
-- the track: the same topic is asked of a Pleno and a Senior candidate, and what differs is what
-- the answer has to contain. "Pleno/Senior expectations are explicit rather than inferred from
-- free text", which #18 asked for, is only satisfiable per question.

CREATE TABLE certforge.catalog_interview_profile (
    track_id         UUID         PRIMARY KEY REFERENCES certforge.catalog_track (id),
    role_family      VARCHAR(100) NOT NULL,
    seniority_target VARCHAR(16)  NOT NULL CHECK (seniority_target IN ('PLENO', 'SENIOR'))
);

-- The track V14 seeded. Its target is SENIOR because the track is named for the harder of the two
-- and a Senior candidate is expected to answer a Pleno question; a Pleno-targeted track would be a
-- different row, not a different reading of this one.
INSERT INTO certforge.catalog_interview_profile (track_id, role_family, seniority_target)
VALUES ('a1000000-0000-4000-8000-000000000002', 'Java Backend', 'SENIOR');

-- Nullable, because a certification question has no seniority to state: an exam objective is true
-- or it is not, and there is no level at which it is asked. The application refuses the field on a
-- certification track and requires it on an interview one, the same way it treats java_release.
ALTER TABLE certforge.qb_question_revision
    ADD COLUMN seniority VARCHAR(16) CHECK (seniority IN ('PLENO', 'SENIOR'));

-- Seniority is content, not lifecycle: it changes what a correct answer must contain, so a
-- reviewer approved a question at a level and that cannot move underneath them afterwards. The
-- guard from V5 lists the columns frozen once a revision leaves DRAFT, and this belongs in it.
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
        OR NEW.author_id            IS DISTINCT FROM OLD.author_id) THEN
        RAISE EXCEPTION 'Question revision % is % and its content is immutable', OLD.id, OLD.status;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

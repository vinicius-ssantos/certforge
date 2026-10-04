-- Generalises the exam version into a track version (ADR 0016 decision 1).
--
-- Before this, the only thing topics could be mapped into, ordered by and bound to was an exam
-- version, and publishing a question required one. A track with no exam -- which an interview
-- track is by definition -- could therefore hold no published question at all. The thing topics
-- are mapped into is now a *track* version, and the exam-specific identity moves beside it, the
-- same way catalog_certification_profile already separates certification identity from the track.
--
-- Nothing about certification behaviour changes. Every existing row keeps its id, so every
-- published question stays bound to exactly what it was bound to before.

-- INTERVIEW becomes a kind the database accepts. V3 reserved it in a comment only.
ALTER TABLE certforge.catalog_track
    DROP CONSTRAINT catalog_track_kind_check;
ALTER TABLE certforge.catalog_track
    ADD CONSTRAINT catalog_track_kind_check CHECK (kind IN ('CERTIFICATION', 'INTERVIEW'));

-- The version itself keeps its id, its track, its label and its lifecycle.
ALTER TABLE certforge.catalog_exam_version RENAME TO catalog_track_version;
ALTER INDEX certforge.catalog_exam_version_one_active RENAME TO catalog_track_version_one_active;

-- What only a certification has. Keyed by the version rather than the track, because a track may
-- have several versions and each one is a different exam revision.
CREATE TABLE certforge.catalog_certification_exam (
    track_version_id UUID         PRIMARY KEY REFERENCES certforge.catalog_track_version (id) ON DELETE CASCADE,
    exam_code        VARCHAR(32)  NOT NULL,
    exam_name        VARCHAR(200) NOT NULL,
    java_release     INT          NOT NULL CHECK (java_release > 0),
    objectives_url   VARCHAR(500) NOT NULL
);

INSERT INTO certforge.catalog_certification_exam
    (track_version_id, exam_code, exam_name, java_release, objectives_url)
SELECT id, exam_code, exam_name, java_release, objectives_url
FROM certforge.catalog_track_version;

ALTER TABLE certforge.catalog_track_version
    DROP COLUMN exam_code,
    DROP COLUMN exam_name,
    DROP COLUMN java_release,
    DROP COLUMN objectives_url;

-- The topic mapping belongs to a track version now. objective_ref becomes nullable because an
-- interview topic has no published objective to cite, and weight carries the canonical
-- expectation that ADR 0016 decision 7 puts here (a job blueprint keeps its own, elsewhere).
ALTER TABLE certforge.catalog_exam_version_topic RENAME TO catalog_track_version_topic;
ALTER TABLE certforge.catalog_track_version_topic RENAME COLUMN exam_version_id TO track_version_id;
ALTER TABLE certforge.catalog_track_version_topic ALTER COLUMN objective_ref DROP NOT NULL;
ALTER TABLE certforge.catalog_track_version_topic ADD COLUMN weight INT CHECK (weight > 0);

-- A certification version must still name an objective for every topic it maps. That is a rule
-- across two tables, so a CHECK cannot express it; this is the same approach the question bank
-- already takes for immutability, and it holds for every writer rather than only the application.
CREATE FUNCTION certforge.catalog_guard_objective_ref() RETURNS trigger AS $$
BEGIN
    IF NEW.objective_ref IS NULL
       AND EXISTS (SELECT 1 FROM certforge.catalog_certification_exam
                   WHERE track_version_id = NEW.track_version_id) THEN
        RAISE EXCEPTION 'Track version % is a certification exam, so topic % needs an objective_ref',
            NEW.track_version_id, NEW.topic_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER catalog_guard_objective_ref
    BEFORE INSERT OR UPDATE ON certforge.catalog_track_version_topic
    FOR EACH ROW EXECUTE FUNCTION certforge.catalog_guard_objective_ref();

-- What a published revision is bound to is the track version. The column is renamed rather than
-- replaced, so ADR 0003's guarantee is untouched: a published revision still points at exactly
-- the context it was approved for, and the partial unique index below still prevents two
-- published revisions of one question in one context.
ALTER TABLE certforge.qb_question_revision RENAME COLUMN exam_version_id TO track_version_id;

-- A practice session is composed against the version its topic was mapped in, and that works for
-- either kind of track, so it generalises with the rest.
ALTER TABLE certforge.study_session RENAME COLUMN exam_version_id TO track_version_id;

-- mock_exam_session.exam_version_id is deliberately NOT renamed. A mock exam simulates a specific
-- exam -- it is what "Start 1Z0-830 mock" means -- so there the name is the accurate one, and an
-- interview equivalent would be a different thing with a different lifecycle (#24), not this row
-- with a wider column.

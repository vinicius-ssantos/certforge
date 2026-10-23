-- #23: which expected concepts a learner says their own answer covered.
--
-- The issue asks for "expected-concept coverage" as interview evidence, and ADR 0019 forbids the
-- only other way to get it: nothing about a guided answer is scored, and the learner's words are
-- never sent to the server, so the product cannot judge what an answer covered. It can ask.
--
-- So these rows are the learner's own marks, recorded beside their response and immutable with it.
-- Every number built on them is explainable as "you said so, on these dates, about these
-- questions", which is what #23 means by a metric that can be explained from persisted evidence.
-- They are not a score: there is no threshold here, nothing is required, and marking nothing is a
-- legitimate answer that means only that the learner did not say.
CREATE TABLE certforge.interview_response_concept (
    response_id      UUID    NOT NULL REFERENCES certforge.interview_response (id),
    concept_position INT     NOT NULL CHECK (concept_position >= 0),
    covered          BOOLEAN NOT NULL,
    PRIMARY KEY (response_id, concept_position)
);

CREATE INDEX interview_response_concept_by_response
    ON certforge.interview_response_concept (response_id);

-- Immutable with the response it belongs to: evidence a learner gave about one sitting is not
-- rewritten by a later sitting, and a weakness signal has to be rebuildable from exactly what was
-- recorded. A second attempt at the same question is a second response, with its own marks.
CREATE FUNCTION certforge.interview_guard_concept() RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
        RAISE EXCEPTION 'Interview self-assessment is immutable evidence';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER interview_response_concept_is_evidence
    BEFORE INSERT OR UPDATE OR DELETE ON certforge.interview_response_concept
    FOR EACH ROW EXECUTE FUNCTION certforge.interview_guard_concept();

COMMENT ON TABLE certforge.interview_response_concept IS
    'A learner''s own marks about which expected concepts their guided answer covered; never a score.';

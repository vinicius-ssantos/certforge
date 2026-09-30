-- Progress module: a rebuildable projection of accepted attempts per learner and topic.
-- It is derived data: study_attempt is the evidence, this table can always be recomputed from it.

CREATE TABLE certforge.progress_topic (
    learner_id       UUID        NOT NULL,
    topic_id         UUID        NOT NULL,
    attempted        INT         NOT NULL CHECK (attempted >= 0),
    correct          INT         NOT NULL CHECK (correct >= 0 AND correct <= attempted),
    last_activity_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (learner_id, topic_id)
);

-- Keyset pagination of the learner's history: newest first, with the id as a total-order
-- tie-breaker so pages never skip or repeat a row.
CREATE INDEX study_attempt_history ON certforge.study_attempt (learner_id, submitted_at DESC, id DESC);
CREATE INDEX study_session_history ON certforge.study_session (learner_id, created_at DESC, id DESC);

-- #22: a job description turned into a weighted study blueprint, with every weight traceable.
--
-- Two things kept apart on purpose, because the issue asks for both and they pull in opposite
-- directions. The job context — the text someone pasted, the requirements they listed, the edits
-- they made — is the learner's own material and belongs to their blueprint. The canonical taxonomy
-- is the project's, reviewed, and a blueprint never changes it: a blueprint points at topics and
-- weighs them for one learner's preparation, and the next learner's taxonomy is untouched.
--
-- The mapping is stored, not just the result. "Why is Concurrency weighted three?" is answerable
-- from these rows — three terms matched, here they are, this is where each one came from — which is
-- what the issue means by an explainable source, and what makes a blueprint reproducible: rerunning
-- the match over the saved input has to produce the saved mapping.
CREATE TABLE certforge.interview_blueprint (
    id               UUID         PRIMARY KEY,
    learner_id       UUID         NOT NULL,
    track_version_id UUID         NOT NULL REFERENCES certforge.catalog_track_version (id),
    job_title        VARCHAR(200),
    -- What was pasted, kept verbatim: a blueprint that cannot show its own input cannot be
    -- reproduced from it, and paraphrasing a job description would be inventing one.
    source_text      TEXT,
    created_at       TIMESTAMPTZ  NOT NULL
);

CREATE INDEX interview_blueprint_learner
    ON certforge.interview_blueprint (learner_id, created_at DESC);

-- A requirement the learner listed or confirmed, in the order they gave them. `matched` is false
-- for one nothing in the dictionary recognises: #22 asks that unknown technologies be surfaced
-- rather than silently guessed, and a row that says "this was not understood" is how it is
-- surfaced rather than dropped.
CREATE TABLE certforge.interview_blueprint_requirement (
    blueprint_id UUID         NOT NULL REFERENCES certforge.interview_blueprint (id),
    position     INT          NOT NULL CHECK (position >= 0),
    text         VARCHAR(300) NOT NULL,
    matched      BOOLEAN      NOT NULL,
    PRIMARY KEY (blueprint_id, position)
);

-- One topic's weight, and why it has it.
--
-- `source` is the honest part: MATCHED means terms in the job description reached this topic, and
-- the terms are in the table below; LEARNER means the weight is the learner's own decision, which
-- the issue requires be allowed and which must never be presented as something the description
-- said.
CREATE TABLE certforge.interview_blueprint_topic (
    blueprint_id UUID        NOT NULL REFERENCES certforge.interview_blueprint (id),
    topic_id     UUID        NOT NULL REFERENCES certforge.catalog_topic (id),
    weight       INT         NOT NULL CHECK (weight BETWEEN 1 AND 5),
    source       VARCHAR(16) NOT NULL CHECK (source IN ('MATCHED', 'LEARNER')),
    PRIMARY KEY (blueprint_id, topic_id)
);

-- The exact phrase that reached a topic, and where it was read from. A weight with no rows here is
-- a weight the learner set; a weight with rows can be explained word by word.
CREATE TABLE certforge.interview_blueprint_match (
    blueprint_id UUID         NOT NULL,
    topic_id     UUID         NOT NULL,
    term         VARCHAR(100) NOT NULL,
    found_in     VARCHAR(16)  NOT NULL CHECK (found_in IN ('DESCRIPTION', 'REQUIREMENT')),
    PRIMARY KEY (blueprint_id, topic_id, term, found_in),
    FOREIGN KEY (blueprint_id, topic_id)
        REFERENCES certforge.interview_blueprint_topic (blueprint_id, topic_id) ON DELETE CASCADE
);

COMMENT ON TABLE certforge.interview_blueprint IS
    'A learner''s job-description blueprint: their context, weighing the canonical taxonomy without changing it.';

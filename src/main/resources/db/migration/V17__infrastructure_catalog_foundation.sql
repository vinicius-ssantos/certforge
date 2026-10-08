-- #165: provider-neutral certification snapshots and a third, general-knowledge track kind.
-- Additive only; existing Java certification and interview identifiers and revisions are unchanged.
ALTER TABLE certforge.catalog_track DROP CONSTRAINT catalog_track_kind_check;
ALTER TABLE certforge.catalog_track ADD CONSTRAINT catalog_track_kind_check
    CHECK (kind IN ('CERTIFICATION', 'INTERVIEW', 'GENERAL'));

-- A Java release is meaningful only for Java exams; preserve Java 21 while allowing CNCF/AWS.
ALTER TABLE certforge.catalog_certification_exam ALTER COLUMN java_release DROP NOT NULL;

-- A versioned snapshot is separate from stable track identity, and deliberately nullable
-- for existing versions until source governance has verified the official objectives.
CREATE TABLE certforge.catalog_exam_objective_snapshot (
    track_version_id UUID PRIMARY KEY
        REFERENCES certforge.catalog_certification_exam(track_version_id) ON DELETE CASCADE,
    provider_version VARCHAR(100) NOT NULL,
    verified_on DATE NOT NULL,
    source_url VARCHAR(500) NOT NULL CHECK (source_url ~ '^https://[^ ]+$'),
    source_digest VARCHAR(71) NOT NULL
        CHECK (source_digest ~ '^sha256:[0-9a-f]{64}$'),
    status VARCHAR(20) NOT NULL DEFAULT 'VERIFIED'
        CHECK (status IN ('VERIFIED', 'STALE', 'RETIRED')),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Per-objective identity is stable within an exam snapshot. A topic may support more than
-- one objective, so it cannot be represented by the old single objective_ref column alone.
CREATE TABLE certforge.catalog_exam_objective (
    track_version_id UUID NOT NULL
        REFERENCES certforge.catalog_exam_objective_snapshot(track_version_id) ON DELETE CASCADE,
    objective_key VARCHAR(120) NOT NULL,
    title VARCHAR(400) NOT NULL,
    source_ref VARCHAR(500),
    PRIMARY KEY(track_version_id, objective_key)
);
CREATE TABLE certforge.catalog_exam_objective_topic (
    track_version_id UUID NOT NULL,
    objective_key VARCHAR(120) NOT NULL,
    topic_id UUID NOT NULL REFERENCES certforge.catalog_topic(id),
    PRIMARY KEY(track_version_id, objective_key, topic_id),
    FOREIGN KEY(track_version_id, objective_key)
        REFERENCES certforge.catalog_exam_objective(track_version_id, objective_key) ON DELETE CASCADE,
    FOREIGN KEY(track_version_id, topic_id)
        REFERENCES certforge.catalog_track_version_topic(track_version_id, topic_id)
);

COMMENT ON TABLE certforge.catalog_exam_objective_snapshot IS
    'Verified snapshot metadata for official exam objectives; legacy versions have no snapshot until reviewed.';

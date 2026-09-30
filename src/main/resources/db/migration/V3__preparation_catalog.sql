-- Preparation catalog module: tracks, certification profile, exam versions and topics.
-- Tables are owned by the preparation-catalog module; other modules reference them by id only.

CREATE TABLE certforge.catalog_track (
    id         UUID         PRIMARY KEY,
    slug       VARCHAR(64)  NOT NULL UNIQUE,
    name       VARCHAR(200) NOT NULL,
    -- Only certification tracks exist in v0.1.0. INTERVIEW is reserved in code and is added
    -- to this constraint by the migration that introduces interview behavior.
    kind       VARCHAR(32)  NOT NULL CHECK (kind IN ('CERTIFICATION')),
    status     VARCHAR(16)  NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ACTIVE', 'INACTIVE')),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Certification-specific identity, kept explicit instead of generic track fields.
CREATE TABLE certforge.catalog_certification_profile (
    track_id            UUID         PRIMARY KEY REFERENCES certforge.catalog_track (id),
    provider            VARCHAR(100) NOT NULL,
    certification_name  VARCHAR(200) NOT NULL
);

CREATE TABLE certforge.catalog_exam_version (
    id             UUID         PRIMARY KEY,
    track_id       UUID         NOT NULL REFERENCES certforge.catalog_track (id),
    label          VARCHAR(100) NOT NULL,
    exam_code      VARCHAR(32)  NOT NULL,
    exam_name      VARCHAR(200) NOT NULL,
    java_release   INT          NOT NULL CHECK (java_release > 0),
    objectives_url VARCHAR(500) NOT NULL,
    status         VARCHAR(16)  NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'ACTIVE', 'INACTIVE')),
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT now(),
    UNIQUE (track_id, label)
);

-- At most one active exam version per track.
CREATE UNIQUE INDEX catalog_exam_version_one_active
    ON certforge.catalog_exam_version (track_id) WHERE status = 'ACTIVE';

-- Stable topic identity. The display name may be corrected; id and slug never change.
CREATE TABLE certforge.catalog_topic (
    id        UUID         PRIMARY KEY,
    track_id  UUID         NOT NULL REFERENCES certforge.catalog_track (id),
    parent_id UUID         REFERENCES certforge.catalog_topic (id),
    slug      VARCHAR(64)  NOT NULL,
    name      VARCHAR(200) NOT NULL,
    UNIQUE (track_id, slug)
);

-- Explicit objective mapping and ordering of topics for one exam version.
CREATE TABLE certforge.catalog_exam_version_topic (
    exam_version_id UUID         NOT NULL REFERENCES certforge.catalog_exam_version (id) ON DELETE CASCADE,
    topic_id        UUID         NOT NULL REFERENCES certforge.catalog_topic (id),
    objective_ref   VARCHAR(300) NOT NULL,
    position        INT          NOT NULL CHECK (position >= 0),
    PRIMARY KEY (exam_version_id, topic_id),
    UNIQUE (exam_version_id, position)
);

-- The Java Backend interview taxonomy (ADR 0016 decision 3), as a DRAFT track and a DRAFT
-- taxonomy version.
--
-- Twelve topics, not the twenty-three in docs/product/interview-prep.md. The reason is in the ADR
-- and it is this repository's own evidence: the one certification track that exists has 150
-- questions of which 130 are still unreviewed by one person. A taxonomy is a promise to fill it,
-- and twenty-three topics is a promise this project cannot currently keep. The other eleven are
-- folded in as the subject matter of these twelve rather than dropped.
--
-- Behavioural communication and financial-system concerns are deliberately absent. Behavioural
-- questions have no authoritative reference, and the content policy requires one; whether that
-- policy admits a question whose evidence is editorial judgement alone is a decision that has to
-- be made before the topic exists, not after. Financial-system concerns are a lens across topics
-- 6, 9, 10 and 12 rather than a thirteenth area, and belong in a job blueprint (#22).
--
-- Both rows are DRAFT on purpose. Nothing is exposed to a learner, and nothing can be published
-- yet: publishing needs an ACTIVE track and an ACTIVE version, and activating them is a deliberate
-- act for when there is reviewed content to serve. The existing admin endpoints do that; they do
-- not require an exam.
--
-- There is no objective_ref, because an interview topic has no published objective to cite and
-- inventing one would be the mistake ADR 0014 refused when it declined to add "Data structures" to
-- the Java SE 21 track. What each topic carries instead is a weight: the canonical expectation,
-- which a job-specific blueprint may disagree with without rewriting this (ADR 0016 decision 7).
--
-- Identifiers are fixed so topic identity is stable across environments, and they continue the
-- a1/a2/a3 prefixes V4 established for tracks, versions and topics.

INSERT INTO certforge.catalog_track (id, slug, name, kind, status)
VALUES ('a1000000-0000-4000-8000-000000000002', 'java-backend-interview',
        'Java Backend — Pleno/Sênior', 'INTERVIEW', 'DRAFT');

-- A taxonomy revision, not an exam revision: the same structure, with no catalog_certification_exam
-- row beside it. That absence is what makes it an interview version.
INSERT INTO certforge.catalog_track_version (id, track_id, label, status)
VALUES ('a2000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000002',
        'Taxonomy 2026.1', 'DRAFT');

INSERT INTO certforge.catalog_topic (id, track_id, slug, name) VALUES
    ('a3000000-0000-4000-8000-000000000101', 'a1000000-0000-4000-8000-000000000002', 'java-language-runtime', 'Java language and runtime'),
    ('a3000000-0000-4000-8000-000000000102', 'a1000000-0000-4000-8000-000000000002', 'concurrency', 'Concurrency'),
    ('a3000000-0000-4000-8000-000000000103', 'a1000000-0000-4000-8000-000000000002', 'object-oriented-design', 'Object-oriented design'),
    ('a3000000-0000-4000-8000-000000000104', 'a1000000-0000-4000-8000-000000000002', 'data-structures-algorithms', 'Data structures and algorithms'),
    ('a3000000-0000-4000-8000-000000000105', 'a1000000-0000-4000-8000-000000000002', 'spring', 'Spring'),
    ('a3000000-0000-4000-8000-000000000106', 'a1000000-0000-4000-8000-000000000002', 'persistence', 'Persistence'),
    ('a3000000-0000-4000-8000-000000000107', 'a1000000-0000-4000-8000-000000000002', 'testing', 'Testing'),
    ('a3000000-0000-4000-8000-000000000108', 'a1000000-0000-4000-8000-000000000002', 'domain-boundaries', 'Domain boundaries'),
    ('a3000000-0000-4000-8000-000000000109', 'a1000000-0000-4000-8000-000000000002', 'distributed-systems', 'Distributed systems'),
    ('a3000000-0000-4000-8000-000000000110', 'a1000000-0000-4000-8000-000000000002', 'messaging', 'Messaging'),
    ('a3000000-0000-4000-8000-000000000111', 'a1000000-0000-4000-8000-000000000002', 'cloud-operations', 'Cloud and operations'),
    ('a3000000-0000-4000-8000-000000000112', 'a1000000-0000-4000-8000-000000000002', 'system-design', 'System design');

-- Weights are the canonical expectation for a Pleno/Sênior backend screen, on a 1 to 5 scale:
-- 5 is asked in almost every interview, 1 is asked when the role calls for it. They are an
-- editorial judgement about the market, not a measurement, and the position column keeps the
-- reading order independent of them.
INSERT INTO certforge.catalog_track_version_topic (track_version_id, topic_id, objective_ref, position, weight) VALUES
    ('a2000000-0000-4000-8000-000000000002', 'a3000000-0000-4000-8000-000000000101', NULL, 0, 5),
    ('a2000000-0000-4000-8000-000000000002', 'a3000000-0000-4000-8000-000000000102', NULL, 1, 4),
    ('a2000000-0000-4000-8000-000000000002', 'a3000000-0000-4000-8000-000000000103', NULL, 2, 5),
    ('a2000000-0000-4000-8000-000000000002', 'a3000000-0000-4000-8000-000000000104', NULL, 3, 3),
    ('a2000000-0000-4000-8000-000000000002', 'a3000000-0000-4000-8000-000000000105', NULL, 4, 5),
    ('a2000000-0000-4000-8000-000000000002', 'a3000000-0000-4000-8000-000000000106', NULL, 5, 5),
    ('a2000000-0000-4000-8000-000000000002', 'a3000000-0000-4000-8000-000000000107', NULL, 6, 4),
    ('a2000000-0000-4000-8000-000000000002', 'a3000000-0000-4000-8000-000000000108', NULL, 7, 3),
    ('a2000000-0000-4000-8000-000000000002', 'a3000000-0000-4000-8000-000000000109', NULL, 8, 4),
    ('a2000000-0000-4000-8000-000000000002', 'a3000000-0000-4000-8000-000000000110', NULL, 9, 4),
    ('a2000000-0000-4000-8000-000000000002', 'a3000000-0000-4000-8000-000000000111', NULL, 10, 3),
    ('a2000000-0000-4000-8000-000000000002', 'a3000000-0000-4000-8000-000000000112', NULL, 11, 3);

-- Initial Java certification catalog: Oracle Java SE 21 Developer Professional (1Z0-830).
--
-- Topics mirror the ten exam objective groups published on Oracle's exam page:
-- https://education.oracle.com/java-se-21-developer/pexam_1Z0-830
-- The wording was taken from secondary summaries because the Oracle page could not be fetched
-- when this data was written. A reviewer must compare it with the official page before any
-- question is published against these topics (see docs/architecture/preparation-catalog.md).
--
-- Identifiers are fixed so topic identity is stable across environments.

INSERT INTO certforge.catalog_track (id, slug, name, kind, status)
VALUES ('a1000000-0000-4000-8000-000000000001', 'java-certification', 'Java Certification',
        'CERTIFICATION', 'ACTIVE');

INSERT INTO certforge.catalog_certification_profile (track_id, provider, certification_name)
VALUES ('a1000000-0000-4000-8000-000000000001', 'Oracle', 'Oracle Certified Professional: Java SE Developer');

INSERT INTO certforge.catalog_exam_version
    (id, track_id, label, exam_code, exam_name, java_release, objectives_url, status)
VALUES ('a2000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000001',
        'Java SE 21 (1Z0-830)', '1Z0-830', 'Java SE 21 Developer Professional', 21,
        'https://education.oracle.com/java-se-21-developer/pexam_1Z0-830', 'ACTIVE');

INSERT INTO certforge.catalog_topic (id, track_id, slug, name) VALUES
    ('a3000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000001', 'date-time-text-numeric-boolean', 'Date, time, text, numeric and boolean values'),
    ('a3000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000001', 'program-flow', 'Controlling program flow'),
    ('a3000000-0000-4000-8000-000000000003', 'a1000000-0000-4000-8000-000000000001', 'object-oriented-concepts', 'Object-oriented concepts in Java'),
    ('a3000000-0000-4000-8000-000000000004', 'a1000000-0000-4000-8000-000000000001', 'exceptions', 'Handling exceptions'),
    ('a3000000-0000-4000-8000-000000000005', 'a1000000-0000-4000-8000-000000000001', 'arrays-collections', 'Arrays and collections'),
    ('a3000000-0000-4000-8000-000000000006', 'a1000000-0000-4000-8000-000000000001', 'streams-lambdas', 'Streams and lambda expressions'),
    ('a3000000-0000-4000-8000-000000000007', 'a1000000-0000-4000-8000-000000000001', 'packaging-modules', 'Packaging, deploying and the Java Platform Module System'),
    ('a3000000-0000-4000-8000-000000000008', 'a1000000-0000-4000-8000-000000000001', 'concurrency', 'Managing concurrent code execution'),
    ('a3000000-0000-4000-8000-000000000009', 'a1000000-0000-4000-8000-000000000001', 'java-io', 'Java I/O API'),
    ('a3000000-0000-4000-8000-000000000010', 'a1000000-0000-4000-8000-000000000001', 'localization', 'Implementing localization');

INSERT INTO certforge.catalog_exam_version_topic (exam_version_id, topic_id, objective_ref, position) VALUES
    ('a2000000-0000-4000-8000-000000000001', 'a3000000-0000-4000-8000-000000000001', 'Handling date, time, text, numeric and boolean values', 0),
    ('a2000000-0000-4000-8000-000000000001', 'a3000000-0000-4000-8000-000000000002', 'Controlling program flow', 1),
    ('a2000000-0000-4000-8000-000000000001', 'a3000000-0000-4000-8000-000000000003', 'Using object-oriented concepts in Java', 2),
    ('a2000000-0000-4000-8000-000000000001', 'a3000000-0000-4000-8000-000000000004', 'Handling exceptions', 3),
    ('a2000000-0000-4000-8000-000000000001', 'a3000000-0000-4000-8000-000000000005', 'Working with arrays and collections', 4),
    ('a2000000-0000-4000-8000-000000000001', 'a3000000-0000-4000-8000-000000000006', 'Working with streams and lambda expressions', 5),
    ('a2000000-0000-4000-8000-000000000001', 'a3000000-0000-4000-8000-000000000007', 'Packaging and deploying Java code and using the Java Platform Module System', 6),
    ('a2000000-0000-4000-8000-000000000001', 'a3000000-0000-4000-8000-000000000008', 'Managing concurrent code execution', 7),
    ('a2000000-0000-4000-8000-000000000001', 'a3000000-0000-4000-8000-000000000009', 'Using Java I/O API', 8),
    ('a2000000-0000-4000-8000-000000000001', 'a3000000-0000-4000-8000-000000000010', 'Implementing localization', 9);

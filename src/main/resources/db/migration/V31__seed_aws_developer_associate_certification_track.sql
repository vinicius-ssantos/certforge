-- #172: the third non-CNCF certification profile (AWS Certified Developer - Associate,
-- DVA-C02), the second of three AWS profiles tracked under #172 (Cloud Practitioner done in
-- V30; Solutions Architect Associate scaffolded in parallel). Catalog-only: track, version and
-- exam all start DRAFT, so nothing here is learner-visible or claims readiness until content is
-- reviewed and the track is activated.
--
-- Like Cloud Practitioner (and unlike Terraform Associate's live webpage with no pinnable
-- artifact), AWS publishes this exam guide as a versioned, dated PDF: version 2.1, published
-- December 12, 2024. That PDF is what this snapshot pins -- fetched directly via curl (not a
-- summarizing tool), confirmed byte-identical across two independent downloads, and hashed with
-- sha256 on the verifiedOn date.
--
-- DVA-C02's exam guide uses AWS's newer template: each content domain breaks into numbered
-- "Task N" statements (not the flat "Task Statement X.Y" list CLF-C02 used), with finer-grained
-- "Skill N.N.N" bullets underneath that this scaffold does not model. The objective_key /
-- objective rows below are built at the "Task N" level (DVA-<domain>.<task>), matching CLF-C02's
-- granularity and decimal-key convention even though the source document numbers tasks 1..N per
-- domain rather than 1.1, 1.2, etc. AWS gives each domain a weight percentage of scored content
-- (32/26/24/18, summing to 100), unlike HashiCorp's unweighted list, so weight is populated here
-- per domain/topic rather than left NULL.
INSERT INTO certforge.catalog_track (id, slug, name, kind, status) VALUES
('b1000000-0000-4000-8000-000000000007', 'aws-developer-associate-certification',
 'AWS Certified Developer - Associate (DVA-C02)', 'CERTIFICATION', 'DRAFT');

INSERT INTO certforge.catalog_certification_profile (track_id, provider, certification_name) VALUES
('b1000000-0000-4000-8000-000000000007', 'AWS',
 'AWS Certified Developer - Associate (DVA-C02)');

INSERT INTO certforge.catalog_track_version (id, track_id, label, status) VALUES
('b2000000-0000-4000-8000-000000000007', 'b1000000-0000-4000-8000-000000000007',
 'AWS Developer Associate DVA-C02', 'DRAFT');

INSERT INTO certforge.catalog_certification_exam
    (track_version_id, exam_code, exam_name, java_release, objectives_url)
VALUES
('b2000000-0000-4000-8000-000000000007', 'DVAC02',
 'AWS Certified Developer - Associate', NULL,
 'https://docs.aws.amazon.com/pdfs/aws-certification/latest/developer-associate-02/developer-associate-02.pdf');

INSERT INTO certforge.catalog_topic (id, track_id, slug, name) VALUES
('b3000000-0000-4000-8000-000000000053', 'b1000000-0000-4000-8000-000000000007', 'dva-development-with-aws-services', 'Development with AWS Services'),
('b3000000-0000-4000-8000-000000000054', 'b1000000-0000-4000-8000-000000000007', 'dva-security', 'Security'),
('b3000000-0000-4000-8000-000000000055', 'b1000000-0000-4000-8000-000000000007', 'dva-deployment', 'Deployment'),
('b3000000-0000-4000-8000-000000000056', 'b1000000-0000-4000-8000-000000000007', 'dva-troubleshooting-optimization', 'Troubleshooting and Optimization');

INSERT INTO certforge.catalog_track_version_topic (track_version_id, topic_id, objective_ref, weight, position) VALUES
('b2000000-0000-4000-8000-000000000007', 'b3000000-0000-4000-8000-000000000053', 'Development with AWS Services', 32, 0),
('b2000000-0000-4000-8000-000000000007', 'b3000000-0000-4000-8000-000000000054', 'Security', 26, 1),
('b2000000-0000-4000-8000-000000000007', 'b3000000-0000-4000-8000-000000000055', 'Deployment', 24, 2),
('b2000000-0000-4000-8000-000000000007', 'b3000000-0000-4000-8000-000000000056', 'Troubleshooting and Optimization', 18, 3);

INSERT INTO certforge.catalog_exam_objective_snapshot
    (track_version_id, provider_version, verified_on, source_url, source_digest, status)
VALUES
('b2000000-0000-4000-8000-000000000007',
 'AWS Certified Developer - Associate (DVA-C02), Exam Guide version 2.1 (published December 12, 2024)', '2026-11-07',
 'https://docs.aws.amazon.com/pdfs/aws-certification/latest/developer-associate-02/developer-associate-02.pdf',
 'sha256:cd9676e3d82beddf30ab47d78f822bfc278b4392b5c6acd388470c75b73c8c97', 'VERIFIED');

INSERT INTO certforge.catalog_exam_objective (track_version_id, objective_key, title, source_ref) VALUES
('b2000000-0000-4000-8000-000000000007', 'DVA-1.1', 'Develop code for applications hosted on AWS', 'Development with AWS Services'),
('b2000000-0000-4000-8000-000000000007', 'DVA-1.2', 'Develop code for AWS Lambda', 'Development with AWS Services'),
('b2000000-0000-4000-8000-000000000007', 'DVA-1.3', 'Use data stores in application development', 'Development with AWS Services'),
('b2000000-0000-4000-8000-000000000007', 'DVA-2.1', 'Implement authentication and/or authorization for applications and AWS services', 'Security'),
('b2000000-0000-4000-8000-000000000007', 'DVA-2.2', 'Implement encryption by using AWS services', 'Security'),
('b2000000-0000-4000-8000-000000000007', 'DVA-2.3', 'Manage sensitive data in application code', 'Security'),
('b2000000-0000-4000-8000-000000000007', 'DVA-3.1', 'Prepare application artifacts to be deployed to AWS', 'Deployment'),
('b2000000-0000-4000-8000-000000000007', 'DVA-3.2', 'Test applications in development environments', 'Deployment'),
('b2000000-0000-4000-8000-000000000007', 'DVA-3.3', 'Automate deployment testing', 'Deployment'),
('b2000000-0000-4000-8000-000000000007', 'DVA-3.4', 'Deploy code by using AWS Continuous Integration and Continuous Delivery (CI/CD) services', 'Deployment'),
('b2000000-0000-4000-8000-000000000007', 'DVA-4.1', 'Assist in a root cause analysis', 'Troubleshooting and Optimization'),
('b2000000-0000-4000-8000-000000000007', 'DVA-4.2', 'Instrument code for observability', 'Troubleshooting and Optimization'),
('b2000000-0000-4000-8000-000000000007', 'DVA-4.3', 'Optimize applications by using AWS services and features', 'Troubleshooting and Optimization');

INSERT INTO certforge.catalog_exam_objective_topic (track_version_id, objective_key, topic_id)
SELECT 'b2000000-0000-4000-8000-000000000007', objective_key, topic_id FROM (VALUES
    ('DVA-1.1', 'b3000000-0000-4000-8000-000000000053'::uuid), ('DVA-1.2', 'b3000000-0000-4000-8000-000000000053'::uuid), ('DVA-1.3', 'b3000000-0000-4000-8000-000000000053'::uuid),
    ('DVA-2.1', 'b3000000-0000-4000-8000-000000000054'::uuid), ('DVA-2.2', 'b3000000-0000-4000-8000-000000000054'::uuid), ('DVA-2.3', 'b3000000-0000-4000-8000-000000000054'::uuid),
    ('DVA-3.1', 'b3000000-0000-4000-8000-000000000055'::uuid), ('DVA-3.2', 'b3000000-0000-4000-8000-000000000055'::uuid), ('DVA-3.3', 'b3000000-0000-4000-8000-000000000055'::uuid), ('DVA-3.4', 'b3000000-0000-4000-8000-000000000055'::uuid),
    ('DVA-4.1', 'b3000000-0000-4000-8000-000000000056'::uuid), ('DVA-4.2', 'b3000000-0000-4000-8000-000000000056'::uuid), ('DVA-4.3', 'b3000000-0000-4000-8000-000000000056'::uuid)
) AS mapping(objective_key, topic_id);

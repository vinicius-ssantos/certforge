-- #172: the third non-CNCF certification profile (AWS Certified Developer - Associate),
-- following #173's Terraform Associate and #172's own Cloud Practitioner pattern. Catalog-only:
-- track, version and exam all start DRAFT, so nothing here is learner-visible or claims readiness
-- until content is reviewed and the track is activated.
--
-- This targets DVA-C03, not DVA-C02. DVA-C02's own exam guide states that registration for DVA-C03
-- opened October 27, 2026 and the last day to take DVA-C02 is November 30, 2026 -- a 3-week window
-- from the date this migration was written, confirmed via a human decision under #172 after an
-- initial DVA-C02 scaffold (closed, never merged) turned up that notice. Authoring content against
-- a retiring exam code would have been close to immediately obsolete.
--
-- DVA-C03 is brand new (registration opened less than two weeks before this was written) and its
-- exam guide carries no populated Revisions table yet -- there is no version number to cite, only a
-- registration-open date, so providerVersion below names that date instead of inventing a version
-- number the source does not state. Like CLF-C02 and SAA-C03, AWS publishes this guide as a
-- versioned, dated PDF, fetched directly via curl (not a summarizing tool), confirmed byte-identical
-- across two independent downloads, and hashed with sha256 on the verifiedOn date. AWS gives each
-- domain a weight percentage of scored content (30/26/22/22), so weight is populated per topic here
-- rather than left NULL.
INSERT INTO certforge.catalog_track (id, slug, name, kind, status) VALUES
('b1000000-0000-4000-8000-000000000007', 'aws-developer-associate-certification',
 'AWS Certified Developer - Associate (DVA-C03)', 'CERTIFICATION', 'DRAFT');

INSERT INTO certforge.catalog_certification_profile (track_id, provider, certification_name) VALUES
('b1000000-0000-4000-8000-000000000007', 'AWS',
 'AWS Certified Developer - Associate (DVA-C03)');

INSERT INTO certforge.catalog_track_version (id, track_id, label, status) VALUES
('b2000000-0000-4000-8000-000000000007', 'b1000000-0000-4000-8000-000000000007',
 'AWS Developer Associate DVA-C03', 'DRAFT');

INSERT INTO certforge.catalog_certification_exam
    (track_version_id, exam_code, exam_name, java_release, objectives_url)
VALUES
('b2000000-0000-4000-8000-000000000007', 'DVAC03',
 'AWS Certified Developer - Associate', NULL,
 'https://docs.aws.amazon.com/pdfs/aws-certification/latest/developer-associate-03/developer-associate-03.pdf');

INSERT INTO certforge.catalog_topic (id, track_id, slug, name) VALUES
('b3000000-0000-4000-8000-000000000053', 'b1000000-0000-4000-8000-000000000007', 'dva-development-aws-services', 'Development with AWS Services'),
('b3000000-0000-4000-8000-000000000054', 'b1000000-0000-4000-8000-000000000007', 'dva-security', 'Security'),
('b3000000-0000-4000-8000-000000000055', 'b1000000-0000-4000-8000-000000000007', 'dva-testing-deployment', 'Testing and Deployment'),
('b3000000-0000-4000-8000-000000000056', 'b1000000-0000-4000-8000-000000000007', 'dva-troubleshooting-optimization', 'Troubleshooting and Optimization');

INSERT INTO certforge.catalog_track_version_topic (track_version_id, topic_id, objective_ref, weight, position) VALUES
('b2000000-0000-4000-8000-000000000007', 'b3000000-0000-4000-8000-000000000053', 'Development with AWS Services', 30, 0),
('b2000000-0000-4000-8000-000000000007', 'b3000000-0000-4000-8000-000000000054', 'Security', 26, 1),
('b2000000-0000-4000-8000-000000000007', 'b3000000-0000-4000-8000-000000000055', 'Testing and Deployment', 22, 2),
('b2000000-0000-4000-8000-000000000007', 'b3000000-0000-4000-8000-000000000056', 'Troubleshooting and Optimization', 22, 3);

INSERT INTO certforge.catalog_exam_objective_snapshot
    (track_version_id, provider_version, verified_on, source_url, source_digest, status)
VALUES
('b2000000-0000-4000-8000-000000000007',
 'AWS Certified Developer - Associate (DVA-C03), Exam Guide (registration opened October 27, 2026)', '2026-11-07',
 'https://docs.aws.amazon.com/pdfs/aws-certification/latest/developer-associate-03/developer-associate-03.pdf',
 'sha256:98b8e605309cd90dd51567b3e69987663e454ba7c26fa4adba4291d9f64c23a9', 'VERIFIED');

INSERT INTO certforge.catalog_exam_objective (track_version_id, objective_key, title, source_ref) VALUES
('b2000000-0000-4000-8000-000000000007', 'DVA-1.1', 'Develop code for applications that are hosted on AWS', 'Development with AWS Services'),
('b2000000-0000-4000-8000-000000000007', 'DVA-1.2', 'Develop code for AWS Lambda', 'Development with AWS Services'),
('b2000000-0000-4000-8000-000000000007', 'DVA-1.3', 'Use data stores during application development', 'Development with AWS Services'),
('b2000000-0000-4000-8000-000000000007', 'DVA-2.1', 'Implement authentication and authorization mechanisms for applications and AWS services', 'Security'),
('b2000000-0000-4000-8000-000000000007', 'DVA-2.2', 'Implement encryption and manage sensitive data by using AWS services', 'Security'),
('b2000000-0000-4000-8000-000000000007', 'DVA-2.3', 'Identify and mitigate security risks associated with using and integrating AI services into application development', 'Security'),
('b2000000-0000-4000-8000-000000000007', 'DVA-3.1', 'Prepare application artifacts to be deployed to AWS', 'Testing and Deployment'),
('b2000000-0000-4000-8000-000000000007', 'DVA-3.2', 'Implement and automate application testing in AWS environments', 'Testing and Deployment'),
('b2000000-0000-4000-8000-000000000007', 'DVA-3.3', 'Deploy code by using AWS continuous integration and continuous delivery (CI/CD) services', 'Testing and Deployment'),
('b2000000-0000-4000-8000-000000000007', 'DVA-4.1', 'Assist in a root cause analysis', 'Troubleshooting and Optimization'),
('b2000000-0000-4000-8000-000000000007', 'DVA-4.2', 'Apply logging, monitoring, and observability best practices', 'Troubleshooting and Optimization'),
('b2000000-0000-4000-8000-000000000007', 'DVA-4.3', 'Optimize applications by using AWS services and features', 'Troubleshooting and Optimization');

INSERT INTO certforge.catalog_exam_objective_topic (track_version_id, objective_key, topic_id)
SELECT 'b2000000-0000-4000-8000-000000000007', objective_key, topic_id FROM (VALUES
    ('DVA-1.1', 'b3000000-0000-4000-8000-000000000053'::uuid), ('DVA-1.2', 'b3000000-0000-4000-8000-000000000053'::uuid), ('DVA-1.3', 'b3000000-0000-4000-8000-000000000053'::uuid),
    ('DVA-2.1', 'b3000000-0000-4000-8000-000000000054'::uuid), ('DVA-2.2', 'b3000000-0000-4000-8000-000000000054'::uuid), ('DVA-2.3', 'b3000000-0000-4000-8000-000000000054'::uuid),
    ('DVA-3.1', 'b3000000-0000-4000-8000-000000000055'::uuid), ('DVA-3.2', 'b3000000-0000-4000-8000-000000000055'::uuid), ('DVA-3.3', 'b3000000-0000-4000-8000-000000000055'::uuid),
    ('DVA-4.1', 'b3000000-0000-4000-8000-000000000056'::uuid), ('DVA-4.2', 'b3000000-0000-4000-8000-000000000056'::uuid), ('DVA-4.3', 'b3000000-0000-4000-8000-000000000056'::uuid)
) AS mapping(objective_key, topic_id);

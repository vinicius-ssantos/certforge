-- #172: the third AWS certification profile (AWS Certified Solutions Architect - Associate,
-- SAA-C03), following #172's own Cloud Practitioner (CLF-C02) pattern and #173's Terraform
-- Associate pattern before it. Catalog-only: track, version and exam all start DRAFT, so nothing
-- here is learner-visible or claims readiness until content is reviewed and the track is
-- activated.
--
-- Sourcing is identical in kind to CLF-C02: AWS publishes this exam guide as a versioned, dated
-- PDF (not a live webpage like Terraform Associate's), so the PDF is what this snapshot pins --
-- fetched directly via curl (not a summarizing tool), confirmed byte-identical across two
-- independent downloads, and hashed with sha256 on the verifiedOn date. Where SAA-C03 differs
-- from CLF-C02 is shape, not method: SAA-C03 has 4 domains (vs. CLF-C02's 4 as well, coincidentally)
-- but a different task-statement count per domain (3/2/5/4 = 14 task statements vs. CLF-C02's
-- 4/4/8/3 = 19 objectives), and a different weight split (30/26/24/20 vs. CLF-C02's 24/30/34/12).
-- Both exams give each domain a weight percentage of scored content, unlike HashiCorp's
-- unweighted list, so weight is populated here per domain/topic rather than left NULL.
INSERT INTO certforge.catalog_track (id, slug, name, kind, status) VALUES
('b1000000-0000-4000-8000-000000000008', 'aws-solutions-architect-associate-certification',
 'AWS Certified Solutions Architect - Associate (SAA-C03)', 'CERTIFICATION', 'DRAFT');

INSERT INTO certforge.catalog_certification_profile (track_id, provider, certification_name) VALUES
('b1000000-0000-4000-8000-000000000008', 'AWS',
 'AWS Certified Solutions Architect - Associate (SAA-C03)');

INSERT INTO certforge.catalog_track_version (id, track_id, label, status) VALUES
('b2000000-0000-4000-8000-000000000008', 'b1000000-0000-4000-8000-000000000008',
 'AWS Solutions Architect Associate SAA-C03', 'DRAFT');

INSERT INTO certforge.catalog_certification_exam
    (track_version_id, exam_code, exam_name, java_release, objectives_url)
VALUES
('b2000000-0000-4000-8000-000000000008', 'SAAC03',
 'AWS Certified Solutions Architect - Associate', NULL,
 'https://docs.aws.amazon.com/pdfs/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.pdf');

INSERT INTO certforge.catalog_topic (id, track_id, slug, name) VALUES
('b3000000-0000-4000-8000-000000000060', 'b1000000-0000-4000-8000-000000000008', 'saa-design-secure-architectures', 'Design Secure Architectures'),
('b3000000-0000-4000-8000-000000000061', 'b1000000-0000-4000-8000-000000000008', 'saa-design-resilient-architectures', 'Design Resilient Architectures'),
('b3000000-0000-4000-8000-000000000062', 'b1000000-0000-4000-8000-000000000008', 'saa-design-high-performing-architectures', 'Design High-Performing Architectures'),
('b3000000-0000-4000-8000-000000000063', 'b1000000-0000-4000-8000-000000000008', 'saa-design-cost-optimized-architectures', 'Design Cost-Optimized Architectures');

INSERT INTO certforge.catalog_track_version_topic (track_version_id, topic_id, objective_ref, weight, position) VALUES
('b2000000-0000-4000-8000-000000000008', 'b3000000-0000-4000-8000-000000000060', 'Design Secure Architectures', 30, 0),
('b2000000-0000-4000-8000-000000000008', 'b3000000-0000-4000-8000-000000000061', 'Design Resilient Architectures', 26, 1),
('b2000000-0000-4000-8000-000000000008', 'b3000000-0000-4000-8000-000000000062', 'Design High-Performing Architectures', 24, 2),
('b2000000-0000-4000-8000-000000000008', 'b3000000-0000-4000-8000-000000000063', 'Design Cost-Optimized Architectures', 20, 3);

INSERT INTO certforge.catalog_exam_objective_snapshot
    (track_version_id, provider_version, verified_on, source_url, source_digest, status)
VALUES
('b2000000-0000-4000-8000-000000000008',
 'AWS Certified Solutions Architect - Associate (SAA-C03), Exam Guide v1.1 (published Oct 29, 2026)', '2026-11-07',
 'https://docs.aws.amazon.com/pdfs/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.pdf',
 'sha256:8959456c08b980947e6a6936e4f9e23b7a1fd0df2274b1c846222c49e7e63152', 'VERIFIED');

INSERT INTO certforge.catalog_exam_objective (track_version_id, objective_key, title, source_ref) VALUES
('b2000000-0000-4000-8000-000000000008', 'SAA-1.1', 'Design secure access to AWS resources', 'Design Secure Architectures'),
('b2000000-0000-4000-8000-000000000008', 'SAA-1.2', 'Design secure workloads and applications', 'Design Secure Architectures'),
('b2000000-0000-4000-8000-000000000008', 'SAA-1.3', 'Determine appropriate data security controls', 'Design Secure Architectures'),
('b2000000-0000-4000-8000-000000000008', 'SAA-2.1', 'Design scalable and loosely coupled architectures', 'Design Resilient Architectures'),
('b2000000-0000-4000-8000-000000000008', 'SAA-2.2', 'Design highly available and/or fault-tolerant architectures', 'Design Resilient Architectures'),
('b2000000-0000-4000-8000-000000000008', 'SAA-3.1', 'Determine high-performing and/or scalable storage solutions', 'Design High-Performing Architectures'),
('b2000000-0000-4000-8000-000000000008', 'SAA-3.2', 'Design high-performing and elastic compute solutions', 'Design High-Performing Architectures'),
('b2000000-0000-4000-8000-000000000008', 'SAA-3.3', 'Determine high-performing database solutions', 'Design High-Performing Architectures'),
('b2000000-0000-4000-8000-000000000008', 'SAA-3.4', 'Determine high-performing and/or scalable network architectures', 'Design High-Performing Architectures'),
('b2000000-0000-4000-8000-000000000008', 'SAA-3.5', 'Determine high-performing data ingestion and transformation solutions', 'Design High-Performing Architectures'),
('b2000000-0000-4000-8000-000000000008', 'SAA-4.1', 'Design cost-optimized storage solutions', 'Design Cost-Optimized Architectures'),
('b2000000-0000-4000-8000-000000000008', 'SAA-4.2', 'Design cost-optimized compute solutions', 'Design Cost-Optimized Architectures'),
('b2000000-0000-4000-8000-000000000008', 'SAA-4.3', 'Design cost-optimized database solutions', 'Design Cost-Optimized Architectures'),
('b2000000-0000-4000-8000-000000000008', 'SAA-4.4', 'Design cost-optimized network architectures', 'Design Cost-Optimized Architectures');

INSERT INTO certforge.catalog_exam_objective_topic (track_version_id, objective_key, topic_id)
SELECT 'b2000000-0000-4000-8000-000000000008', objective_key, topic_id FROM (VALUES
    ('SAA-1.1', 'b3000000-0000-4000-8000-000000000060'::uuid), ('SAA-1.2', 'b3000000-0000-4000-8000-000000000060'::uuid), ('SAA-1.3', 'b3000000-0000-4000-8000-000000000060'::uuid),
    ('SAA-2.1', 'b3000000-0000-4000-8000-000000000061'::uuid), ('SAA-2.2', 'b3000000-0000-4000-8000-000000000061'::uuid),
    ('SAA-3.1', 'b3000000-0000-4000-8000-000000000062'::uuid), ('SAA-3.2', 'b3000000-0000-4000-8000-000000000062'::uuid), ('SAA-3.3', 'b3000000-0000-4000-8000-000000000062'::uuid), ('SAA-3.4', 'b3000000-0000-4000-8000-000000000062'::uuid), ('SAA-3.5', 'b3000000-0000-4000-8000-000000000062'::uuid),
    ('SAA-4.1', 'b3000000-0000-4000-8000-000000000063'::uuid), ('SAA-4.2', 'b3000000-0000-4000-8000-000000000063'::uuid), ('SAA-4.3', 'b3000000-0000-4000-8000-000000000063'::uuid), ('SAA-4.4', 'b3000000-0000-4000-8000-000000000063'::uuid)
) AS mapping(objective_key, topic_id);

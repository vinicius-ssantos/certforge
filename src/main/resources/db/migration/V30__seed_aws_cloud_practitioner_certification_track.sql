-- #172: the second non-CNCF certification profile (AWS Certified Cloud Practitioner, CLF-C02),
-- following #173's Terraform Associate pattern. Catalog-only: track, version and exam all start
-- DRAFT, so nothing here is learner-visible or claims readiness until content is reviewed and the
-- track is activated.
--
-- Unlike Terraform Associate (a live webpage with no pinnable artifact), AWS publishes its exam
-- guide as a versioned, dated PDF: version 1.3, published October 29, 2026. That PDF is what this
-- snapshot pins -- fetched directly via curl (not a summarizing tool), confirmed byte-identical
-- across two independent downloads, and hashed with sha256 on the verifiedOn date. AWS gives each
-- domain a weight percentage of scored content (24/30/34/12), unlike HashiCorp's unweighted list,
-- so weight is populated here per domain/topic rather than left NULL.
INSERT INTO certforge.catalog_track (id, slug, name, kind, status) VALUES
('b1000000-0000-4000-8000-000000000006', 'aws-cloud-practitioner-certification',
 'AWS Certified Cloud Practitioner (CLF-C02)', 'CERTIFICATION', 'DRAFT');

INSERT INTO certforge.catalog_certification_profile (track_id, provider, certification_name) VALUES
('b1000000-0000-4000-8000-000000000006', 'AWS',
 'AWS Certified Cloud Practitioner (CLF-C02)');

INSERT INTO certforge.catalog_track_version (id, track_id, label, status) VALUES
('b2000000-0000-4000-8000-000000000006', 'b1000000-0000-4000-8000-000000000006',
 'AWS Cloud Practitioner CLF-C02', 'DRAFT');

INSERT INTO certforge.catalog_certification_exam
    (track_version_id, exam_code, exam_name, java_release, objectives_url)
VALUES
('b2000000-0000-4000-8000-000000000006', 'CLFC02',
 'AWS Certified Cloud Practitioner', NULL,
 'https://docs.aws.amazon.com/pdfs/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.pdf');

INSERT INTO certforge.catalog_topic (id, track_id, slug, name) VALUES
('b3000000-0000-4000-8000-000000000049', 'b1000000-0000-4000-8000-000000000006', 'clf-cloud-concepts', 'Cloud Concepts'),
('b3000000-0000-4000-8000-000000000050', 'b1000000-0000-4000-8000-000000000006', 'clf-security-compliance', 'Security and Compliance'),
('b3000000-0000-4000-8000-000000000051', 'b1000000-0000-4000-8000-000000000006', 'clf-cloud-technology-services', 'Cloud Technology and Services'),
('b3000000-0000-4000-8000-000000000052', 'b1000000-0000-4000-8000-000000000006', 'clf-billing-pricing-support', 'Billing, Pricing, and Support');

INSERT INTO certforge.catalog_track_version_topic (track_version_id, topic_id, objective_ref, weight, position) VALUES
('b2000000-0000-4000-8000-000000000006', 'b3000000-0000-4000-8000-000000000049', 'Cloud Concepts', 24, 0),
('b2000000-0000-4000-8000-000000000006', 'b3000000-0000-4000-8000-000000000050', 'Security and Compliance', 30, 1),
('b2000000-0000-4000-8000-000000000006', 'b3000000-0000-4000-8000-000000000051', 'Cloud Technology and Services', 34, 2),
('b2000000-0000-4000-8000-000000000006', 'b3000000-0000-4000-8000-000000000052', 'Billing, Pricing, and Support', 12, 3);

INSERT INTO certforge.catalog_exam_objective_snapshot
    (track_version_id, provider_version, verified_on, source_url, source_digest, status)
VALUES
('b2000000-0000-4000-8000-000000000006',
 'AWS Certified Cloud Practitioner (CLF-C02), Exam Guide version 1.3 (published October 29, 2026)', '2026-11-06',
 'https://docs.aws.amazon.com/pdfs/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.pdf',
 'sha256:de4d07b2b31f6df3465076342c43d7066362d26e356a1a57edd8901616c38c69', 'VERIFIED');

INSERT INTO certforge.catalog_exam_objective (track_version_id, objective_key, title, source_ref) VALUES
('b2000000-0000-4000-8000-000000000006', 'CLF-1.1', 'Define the benefits of the AWS Cloud', 'Cloud Concepts'),
('b2000000-0000-4000-8000-000000000006', 'CLF-1.2', 'Identify design principles of the AWS Cloud', 'Cloud Concepts'),
('b2000000-0000-4000-8000-000000000006', 'CLF-1.3', 'Understand the benefits of and strategies for migration to the AWS Cloud', 'Cloud Concepts'),
('b2000000-0000-4000-8000-000000000006', 'CLF-1.4', 'Understand concepts of cloud economics', 'Cloud Concepts'),
('b2000000-0000-4000-8000-000000000006', 'CLF-2.1', 'Understand the AWS shared responsibility model', 'Security and Compliance'),
('b2000000-0000-4000-8000-000000000006', 'CLF-2.2', 'Understand AWS Cloud security, governance, and compliance concepts', 'Security and Compliance'),
('b2000000-0000-4000-8000-000000000006', 'CLF-2.3', 'Identify AWS access management capabilities', 'Security and Compliance'),
('b2000000-0000-4000-8000-000000000006', 'CLF-2.4', 'Identify components and resources for security', 'Security and Compliance'),
('b2000000-0000-4000-8000-000000000006', 'CLF-3.1', 'Define methods of deploying and operating in the AWS Cloud', 'Cloud Technology and Services'),
('b2000000-0000-4000-8000-000000000006', 'CLF-3.2', 'Define the AWS global infrastructure', 'Cloud Technology and Services'),
('b2000000-0000-4000-8000-000000000006', 'CLF-3.3', 'Identify AWS compute services', 'Cloud Technology and Services'),
('b2000000-0000-4000-8000-000000000006', 'CLF-3.4', 'Identify AWS database services', 'Cloud Technology and Services'),
('b2000000-0000-4000-8000-000000000006', 'CLF-3.5', 'Identify AWS network services', 'Cloud Technology and Services'),
('b2000000-0000-4000-8000-000000000006', 'CLF-3.6', 'Identify AWS storage services', 'Cloud Technology and Services'),
('b2000000-0000-4000-8000-000000000006', 'CLF-3.7', 'Identify AWS artificial intelligence and machine learning (AI/ML) services and analytics services', 'Cloud Technology and Services'),
('b2000000-0000-4000-8000-000000000006', 'CLF-3.8', 'Identify services from other in-scope AWS service categories', 'Cloud Technology and Services'),
('b2000000-0000-4000-8000-000000000006', 'CLF-4.1', 'Compare AWS pricing models', 'Billing, Pricing, and Support'),
('b2000000-0000-4000-8000-000000000006', 'CLF-4.2', 'Understand resources for billing, budget, and cost management', 'Billing, Pricing, and Support'),
('b2000000-0000-4000-8000-000000000006', 'CLF-4.3', 'Identify AWS technical resources and AWS Support options', 'Billing, Pricing, and Support');

INSERT INTO certforge.catalog_exam_objective_topic (track_version_id, objective_key, topic_id)
SELECT 'b2000000-0000-4000-8000-000000000006', objective_key, topic_id FROM (VALUES
    ('CLF-1.1', 'b3000000-0000-4000-8000-000000000049'::uuid), ('CLF-1.2', 'b3000000-0000-4000-8000-000000000049'::uuid), ('CLF-1.3', 'b3000000-0000-4000-8000-000000000049'::uuid), ('CLF-1.4', 'b3000000-0000-4000-8000-000000000049'::uuid),
    ('CLF-2.1', 'b3000000-0000-4000-8000-000000000050'::uuid), ('CLF-2.2', 'b3000000-0000-4000-8000-000000000050'::uuid), ('CLF-2.3', 'b3000000-0000-4000-8000-000000000050'::uuid), ('CLF-2.4', 'b3000000-0000-4000-8000-000000000050'::uuid),
    ('CLF-3.1', 'b3000000-0000-4000-8000-000000000051'::uuid), ('CLF-3.2', 'b3000000-0000-4000-8000-000000000051'::uuid), ('CLF-3.3', 'b3000000-0000-4000-8000-000000000051'::uuid), ('CLF-3.4', 'b3000000-0000-4000-8000-000000000051'::uuid), ('CLF-3.5', 'b3000000-0000-4000-8000-000000000051'::uuid), ('CLF-3.6', 'b3000000-0000-4000-8000-000000000051'::uuid), ('CLF-3.7', 'b3000000-0000-4000-8000-000000000051'::uuid), ('CLF-3.8', 'b3000000-0000-4000-8000-000000000051'::uuid),
    ('CLF-4.1', 'b3000000-0000-4000-8000-000000000052'::uuid), ('CLF-4.2', 'b3000000-0000-4000-8000-000000000052'::uuid), ('CLF-4.3', 'b3000000-0000-4000-8000-000000000052'::uuid)
) AS mapping(objective_key, topic_id);

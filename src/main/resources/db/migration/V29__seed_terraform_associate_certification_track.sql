-- #173: first non-CNCF, non-Kubernetes certification profile (Terraform Associate). Catalog-only:
-- track, version and exam all start DRAFT, so nothing here is learner-visible or claims readiness
-- until content is reviewed and the track is activated.
--
-- Unlike the four CNCF tracks (V25-V28), HashiCorp publishes its exam objectives only as a live
-- webpage, not a commit-pinnable curriculum file in a public repo. The snapshot below pins what
-- is actually pinnable: the exam version ("004"), the product version it tests against
-- ("Terraform 1.12", per the page's own 003-vs-004 comparison), the page URL, and a sha256 of the
-- page's raw bytes as fetched directly (not through any summarizing tool) on the verifiedOn date,
-- matching every objective below against that same fetch. HashiCorp gives no domain weights
-- (unlike CNCF's percentages), so weight is left NULL throughout -- recording that the weighting
-- is unknown rather than inventing an equal split.
INSERT INTO certforge.catalog_track (id, slug, name, kind, status) VALUES
('b1000000-0000-4000-8000-000000000005', 'terraform-associate-certification',
 'HashiCorp Certified: Terraform Associate (004)', 'CERTIFICATION', 'DRAFT');

INSERT INTO certforge.catalog_certification_profile (track_id, provider, certification_name) VALUES
('b1000000-0000-4000-8000-000000000005', 'HashiCorp',
 'Terraform Associate (004)');

INSERT INTO certforge.catalog_track_version (id, track_id, label, status) VALUES
('b2000000-0000-4000-8000-000000000005', 'b1000000-0000-4000-8000-000000000005',
 'Terraform Associate 004', 'DRAFT');

INSERT INTO certforge.catalog_certification_exam
    (track_version_id, exam_code, exam_name, java_release, objectives_url)
VALUES
('b2000000-0000-4000-8000-000000000005', 'TFA004',
 'HashiCorp Certified: Terraform Associate', NULL,
 'https://developer.hashicorp.com/certifications/terraform-associate');

INSERT INTO certforge.catalog_topic (id, track_id, slug, name) VALUES
('b3000000-0000-4000-8000-000000000041', 'b1000000-0000-4000-8000-000000000005', 'tfa-iac', 'Infrastructure as Code (IaC) with Terraform'),
('b3000000-0000-4000-8000-000000000042', 'b1000000-0000-4000-8000-000000000005', 'tfa-fundamentals', 'Terraform fundamentals'),
('b3000000-0000-4000-8000-000000000043', 'b1000000-0000-4000-8000-000000000005', 'tfa-workflow', 'Core Terraform workflow'),
('b3000000-0000-4000-8000-000000000044', 'b1000000-0000-4000-8000-000000000005', 'tfa-configuration', 'Terraform configuration'),
('b3000000-0000-4000-8000-000000000045', 'b1000000-0000-4000-8000-000000000005', 'tfa-modules', 'Terraform modules'),
('b3000000-0000-4000-8000-000000000046', 'b1000000-0000-4000-8000-000000000005', 'tfa-state', 'Terraform state management'),
('b3000000-0000-4000-8000-000000000047', 'b1000000-0000-4000-8000-000000000005', 'tfa-maintain', 'Maintain infrastructure with Terraform'),
('b3000000-0000-4000-8000-000000000048', 'b1000000-0000-4000-8000-000000000005', 'tfa-hcp', 'HCP Terraform');

INSERT INTO certforge.catalog_track_version_topic (track_version_id, topic_id, objective_ref, weight, position) VALUES
('b2000000-0000-4000-8000-000000000005', 'b3000000-0000-4000-8000-000000000041', 'Infrastructure as Code (IaC) with Terraform', NULL, 0),
('b2000000-0000-4000-8000-000000000005', 'b3000000-0000-4000-8000-000000000042', 'Terraform fundamentals', NULL, 1),
('b2000000-0000-4000-8000-000000000005', 'b3000000-0000-4000-8000-000000000043', 'Core Terraform workflow', NULL, 2),
('b2000000-0000-4000-8000-000000000005', 'b3000000-0000-4000-8000-000000000044', 'Terraform configuration', NULL, 3),
('b2000000-0000-4000-8000-000000000005', 'b3000000-0000-4000-8000-000000000045', 'Terraform modules', NULL, 4),
('b2000000-0000-4000-8000-000000000005', 'b3000000-0000-4000-8000-000000000046', 'Terraform state management', NULL, 5),
('b2000000-0000-4000-8000-000000000005', 'b3000000-0000-4000-8000-000000000047', 'Maintain infrastructure with Terraform', NULL, 6),
('b2000000-0000-4000-8000-000000000005', 'b3000000-0000-4000-8000-000000000048', 'HCP Terraform', NULL, 7);

INSERT INTO certforge.catalog_exam_objective_snapshot
    (track_version_id, provider_version, verified_on, source_url, source_digest, status)
VALUES
('b2000000-0000-4000-8000-000000000005',
 'HashiCorp Certified: Terraform Associate (004), tested on Terraform 1.12', '2026-11-05',
 'https://developer.hashicorp.com/certifications/terraform-associate',
 'sha256:249cfd20b60eb415af2ab872d99c174efea173a5fb7425e9255f4ce116747471', 'VERIFIED');

INSERT INTO certforge.catalog_exam_objective (track_version_id, objective_key, title, source_ref) VALUES
('b2000000-0000-4000-8000-000000000005', 'TFA-1a', 'Explain what IaC is', 'Infrastructure as Code (IaC) with Terraform'),
('b2000000-0000-4000-8000-000000000005', 'TFA-1b', 'Describe the advantages of IaC patterns', 'Infrastructure as Code (IaC) with Terraform'),
('b2000000-0000-4000-8000-000000000005', 'TFA-1c', 'Explain how Terraform manages multi-cloud, hybrid cloud, and service-agnostic workflows', 'Infrastructure as Code (IaC) with Terraform'),
('b2000000-0000-4000-8000-000000000005', 'TFA-2a', 'Install and version Terraform providers', 'Terraform fundamentals'),
('b2000000-0000-4000-8000-000000000005', 'TFA-2b', 'Describe how Terraform uses providers', 'Terraform fundamentals'),
('b2000000-0000-4000-8000-000000000005', 'TFA-2c', 'Write Terraform configuration using multiple providers', 'Terraform fundamentals'),
('b2000000-0000-4000-8000-000000000005', 'TFA-2d', 'Explain how Terraform uses and manages state', 'Terraform fundamentals'),
('b2000000-0000-4000-8000-000000000005', 'TFA-3a', 'Describe the Terraform workflow', 'Core Terraform workflow'),
('b2000000-0000-4000-8000-000000000005', 'TFA-3b', 'Initialize a Terraform working directory', 'Core Terraform workflow'),
('b2000000-0000-4000-8000-000000000005', 'TFA-3c', 'Validate a Terraform configuration', 'Core Terraform workflow'),
('b2000000-0000-4000-8000-000000000005', 'TFA-3d', 'Generate and review an execution plan for Terraform', 'Core Terraform workflow'),
('b2000000-0000-4000-8000-000000000005', 'TFA-3e', 'Apply changes to infrastructure with Terraform', 'Core Terraform workflow'),
('b2000000-0000-4000-8000-000000000005', 'TFA-3f', 'Destroy Terraform-managed infrastructure', 'Core Terraform workflow'),
('b2000000-0000-4000-8000-000000000005', 'TFA-3g', 'Apply formatting and style adjustments to a configuration', 'Core Terraform workflow'),
('b2000000-0000-4000-8000-000000000005', 'TFA-4a', 'Use and differentiate resource and data blocks', 'Terraform configuration'),
('b2000000-0000-4000-8000-000000000005', 'TFA-4b', 'Refer to resource attributes and create cross-resource references', 'Terraform configuration'),
('b2000000-0000-4000-8000-000000000005', 'TFA-4c', 'Use variables and outputs', 'Terraform configuration'),
('b2000000-0000-4000-8000-000000000005', 'TFA-4d', 'Understand and use complex types', 'Terraform configuration'),
('b2000000-0000-4000-8000-000000000005', 'TFA-4e', 'Write dynamic configuration using expressions and functions', 'Terraform configuration'),
('b2000000-0000-4000-8000-000000000005', 'TFA-4f', 'Define resource dependencies in configuration', 'Terraform configuration'),
('b2000000-0000-4000-8000-000000000005', 'TFA-4g', 'Validate configuration using custom conditions', 'Terraform configuration'),
('b2000000-0000-4000-8000-000000000005', 'TFA-4h', 'Understand best practices for managing sensitive data, including secrets management with Vault', 'Terraform configuration'),
('b2000000-0000-4000-8000-000000000005', 'TFA-5a', 'Explain how Terraform sources modules', 'Terraform modules'),
('b2000000-0000-4000-8000-000000000005', 'TFA-5b', 'Describe variable scope within modules', 'Terraform modules'),
('b2000000-0000-4000-8000-000000000005', 'TFA-5c', 'Use modules in configuration', 'Terraform modules'),
('b2000000-0000-4000-8000-000000000005', 'TFA-5d', 'Manage module versions', 'Terraform modules'),
('b2000000-0000-4000-8000-000000000005', 'TFA-6a', 'Describe the local backend', 'Terraform state management'),
('b2000000-0000-4000-8000-000000000005', 'TFA-6b', 'Describe state locking', 'Terraform state management'),
('b2000000-0000-4000-8000-000000000005', 'TFA-6c', 'Configure remote state using the backend block', 'Terraform state management'),
('b2000000-0000-4000-8000-000000000005', 'TFA-6d', 'Manage resource drift and Terraform state', 'Terraform state management'),
('b2000000-0000-4000-8000-000000000005', 'TFA-7a', 'Import existing infrastructure into your Terraform workspace', 'Maintain infrastructure with Terraform'),
('b2000000-0000-4000-8000-000000000005', 'TFA-7b', 'Use the CLI to inspect state', 'Maintain infrastructure with Terraform'),
('b2000000-0000-4000-8000-000000000005', 'TFA-7c', 'Describe when and how to use verbose logging', 'Maintain infrastructure with Terraform'),
('b2000000-0000-4000-8000-000000000005', 'TFA-8a', 'Use HCP Terraform to create infrastructure', 'HCP Terraform'),
('b2000000-0000-4000-8000-000000000005', 'TFA-8b', 'Describe HCP Terraform collaboration and governance features', 'HCP Terraform'),
('b2000000-0000-4000-8000-000000000005', 'TFA-8c', 'Describe how to organize and use HCP Terraform workspaces and projects', 'HCP Terraform'),
('b2000000-0000-4000-8000-000000000005', 'TFA-8d', 'Configure and use HCP Terraform integration', 'HCP Terraform');

INSERT INTO certforge.catalog_exam_objective_topic (track_version_id, objective_key, topic_id)
SELECT 'b2000000-0000-4000-8000-000000000005', objective_key, topic_id FROM (VALUES
    ('TFA-1a', 'b3000000-0000-4000-8000-000000000041'::uuid), ('TFA-1b', 'b3000000-0000-4000-8000-000000000041'::uuid), ('TFA-1c', 'b3000000-0000-4000-8000-000000000041'::uuid),
    ('TFA-2a', 'b3000000-0000-4000-8000-000000000042'::uuid), ('TFA-2b', 'b3000000-0000-4000-8000-000000000042'::uuid), ('TFA-2c', 'b3000000-0000-4000-8000-000000000042'::uuid), ('TFA-2d', 'b3000000-0000-4000-8000-000000000042'::uuid),
    ('TFA-3a', 'b3000000-0000-4000-8000-000000000043'::uuid), ('TFA-3b', 'b3000000-0000-4000-8000-000000000043'::uuid), ('TFA-3c', 'b3000000-0000-4000-8000-000000000043'::uuid), ('TFA-3d', 'b3000000-0000-4000-8000-000000000043'::uuid), ('TFA-3e', 'b3000000-0000-4000-8000-000000000043'::uuid), ('TFA-3f', 'b3000000-0000-4000-8000-000000000043'::uuid), ('TFA-3g', 'b3000000-0000-4000-8000-000000000043'::uuid),
    ('TFA-4a', 'b3000000-0000-4000-8000-000000000044'::uuid), ('TFA-4b', 'b3000000-0000-4000-8000-000000000044'::uuid), ('TFA-4c', 'b3000000-0000-4000-8000-000000000044'::uuid), ('TFA-4d', 'b3000000-0000-4000-8000-000000000044'::uuid), ('TFA-4e', 'b3000000-0000-4000-8000-000000000044'::uuid), ('TFA-4f', 'b3000000-0000-4000-8000-000000000044'::uuid), ('TFA-4g', 'b3000000-0000-4000-8000-000000000044'::uuid), ('TFA-4h', 'b3000000-0000-4000-8000-000000000044'::uuid),
    ('TFA-5a', 'b3000000-0000-4000-8000-000000000045'::uuid), ('TFA-5b', 'b3000000-0000-4000-8000-000000000045'::uuid), ('TFA-5c', 'b3000000-0000-4000-8000-000000000045'::uuid), ('TFA-5d', 'b3000000-0000-4000-8000-000000000045'::uuid),
    ('TFA-6a', 'b3000000-0000-4000-8000-000000000046'::uuid), ('TFA-6b', 'b3000000-0000-4000-8000-000000000046'::uuid), ('TFA-6c', 'b3000000-0000-4000-8000-000000000046'::uuid), ('TFA-6d', 'b3000000-0000-4000-8000-000000000046'::uuid),
    ('TFA-7a', 'b3000000-0000-4000-8000-000000000047'::uuid), ('TFA-7b', 'b3000000-0000-4000-8000-000000000047'::uuid), ('TFA-7c', 'b3000000-0000-4000-8000-000000000047'::uuid),
    ('TFA-8a', 'b3000000-0000-4000-8000-000000000048'::uuid), ('TFA-8b', 'b3000000-0000-4000-8000-000000000048'::uuid), ('TFA-8c', 'b3000000-0000-4000-8000-000000000048'::uuid), ('TFA-8d', 'b3000000-0000-4000-8000-000000000048'::uuid)
) AS mapping(objective_key, topic_id);

-- #171: third CNCF certification profile (CKAD), same pattern as V25's KCNA and V26's KCSA.
-- Catalog-only: track, version and exam all start DRAFT, so nothing here is learner-visible or
-- claims readiness until content is reviewed and the track is activated.
--
-- Unlike KCNA and KCSA, CKAD is a hands-on, performance-based exam graded on a live terminal
-- (docs/architecture/cncf-certification-roadmap.md). A quiz pack built from this snapshot can only
-- ever test the conceptual layer underneath it -- never the terminal skill the real exam grades --
-- and every question this pack authors must stay honest about that, same as the roadmap doc says.
--
-- Objectives are seeded from the curriculum the exam itself publishes, read directly from the
-- primary source: cncf/curriculum's CKAD_Curriculum_v1.37.pdf, pinned at commit
-- f423fa49c0cab0820533babd95b37ebe8fd89e67 (committed 2026-10-01), sha256
-- 7736d2f0291239d62e9fc618304413ee9b6e53fc4580aac70bf4328203c1c210, read 2026-11-03. All five
-- domains and their twenty-four sub-topics are recorded as objectives, including the ones this
-- round's content pack does not yet cover: ADR 0017 explicitly wants coverage gaps visible rather
-- than a snapshot trimmed down to match what has been authored so far.
INSERT INTO certforge.catalog_track (id, slug, name, kind, status) VALUES
('b1000000-0000-4000-8000-000000000003', 'cncf-ckad-certification',
 'CNCF Certified Kubernetes Application Developer (CKAD)', 'CERTIFICATION', 'DRAFT');

INSERT INTO certforge.catalog_certification_profile (track_id, provider, certification_name) VALUES
('b1000000-0000-4000-8000-000000000003', 'CNCF',
 'Certified Kubernetes Application Developer (CKAD)');

INSERT INTO certforge.catalog_track_version (id, track_id, label, status) VALUES
('b2000000-0000-4000-8000-000000000003', 'b1000000-0000-4000-8000-000000000003',
 'CKAD 2026.1', 'DRAFT');

INSERT INTO certforge.catalog_certification_exam
    (track_version_id, exam_code, exam_name, java_release, objectives_url)
VALUES
('b2000000-0000-4000-8000-000000000003', 'CKAD',
 'Certified Kubernetes Application Developer', NULL,
 'https://github.com/cncf/curriculum/blob/f423fa49c0cab0820533babd95b37ebe8fd89e67/CKAD_Curriculum_v1.37.pdf');

-- One topic per exam domain. Sub-topics are modelled as objectives (many-to-many to topic),
-- not as separate topics, matching ADR 0017 decision 4 and the KCNA/KCSA precedent.
INSERT INTO certforge.catalog_topic (id, track_id, slug, name) VALUES
('b3000000-0000-4000-8000-000000000021', 'b1000000-0000-4000-8000-000000000003',
 'ckad-application-design-build', 'Application Design and Build'),
('b3000000-0000-4000-8000-000000000022', 'b1000000-0000-4000-8000-000000000003',
 'ckad-application-deployment', 'Application Deployment'),
('b3000000-0000-4000-8000-000000000023', 'b1000000-0000-4000-8000-000000000003',
 'ckad-environment-configuration-security', 'Application Environment, Configuration and Security'),
('b3000000-0000-4000-8000-000000000024', 'b1000000-0000-4000-8000-000000000003',
 'ckad-services-networking', 'Services and Networking'),
('b3000000-0000-4000-8000-000000000025', 'b1000000-0000-4000-8000-000000000003',
 'ckad-observability-maintenance', 'Application Observability and Maintenance');

-- objective_ref is kept as the domain label for compatibility (ADR 0017 decision 4); weight is the
-- domain's official percentage of the exam, carried at the level ADR 0016 decision 7 assigns it.
INSERT INTO certforge.catalog_track_version_topic (track_version_id, topic_id, objective_ref, weight, position) VALUES
('b2000000-0000-4000-8000-000000000003', 'b3000000-0000-4000-8000-000000000021', 'Application Design and Build', 20, 0),
('b2000000-0000-4000-8000-000000000003', 'b3000000-0000-4000-8000-000000000022', 'Application Deployment', 20, 1),
('b2000000-0000-4000-8000-000000000003', 'b3000000-0000-4000-8000-000000000023', 'Application Environment, Configuration and Security', 25, 2),
('b2000000-0000-4000-8000-000000000003', 'b3000000-0000-4000-8000-000000000024', 'Services and Networking', 20, 3),
('b2000000-0000-4000-8000-000000000003', 'b3000000-0000-4000-8000-000000000025', 'Application Observability and Maintenance', 15, 4);

INSERT INTO certforge.catalog_exam_objective_snapshot
    (track_version_id, provider_version, verified_on, source_url, source_digest, status)
VALUES
('b2000000-0000-4000-8000-000000000003',
 'cncf/curriculum@f423fa4 (CKAD_Curriculum_v1.37.pdf, commit 2026-10-01)', '2026-11-03',
 'https://github.com/cncf/curriculum/blob/f423fa49c0cab0820533babd95b37ebe8fd89e67/CKAD_Curriculum_v1.37.pdf',
 'sha256:7736d2f0291239d62e9fc618304413ee9b6e53fc4580aac70bf4328203c1c210', 'VERIFIED');

INSERT INTO certforge.catalog_exam_objective (track_version_id, objective_key, title, source_ref) VALUES
('b2000000-0000-4000-8000-000000000003', 'CKAD-1.1', 'Define, build and modify container images', 'Application Design and Build (20%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-1.2', 'Choose and use the right workload resource (Deployment, DaemonSet, CronJob, etc.)', 'Application Design and Build (20%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-1.3', 'Understand multi-container Pod design patterns (sidecar, init and others)', 'Application Design and Build (20%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-1.4', 'Utilize persistent and ephemeral volumes', 'Application Design and Build (20%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-2.1', 'Use Kubernetes primitives to implement common deployment strategies (blue/green, canary)', 'Application Deployment (20%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-2.2', 'Understand Deployments and how to perform rolling updates', 'Application Deployment (20%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-2.3', 'Use the Helm package manager to deploy existing packages', 'Application Deployment (20%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-2.4', 'Kustomize', 'Application Deployment (20%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-3.1', 'Discover and use resources that extend Kubernetes (CRD, Operators)', 'Application Environment, Configuration and Security (25%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-3.2', 'Understand authentication, authorization and admission control', 'Application Environment, Configuration and Security (25%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-3.3', 'Understand requests, limits, quotas', 'Application Environment, Configuration and Security (25%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-3.4', 'Define resource requirements', 'Application Environment, Configuration and Security (25%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-3.5', 'Understand ConfigMaps', 'Application Environment, Configuration and Security (25%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-3.6', 'Create and consume Secrets', 'Application Environment, Configuration and Security (25%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-3.7', 'Understand ServiceAccounts', 'Application Environment, Configuration and Security (25%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-3.8', 'Understand Application Security (SecurityContexts, Capabilities, etc.)', 'Application Environment, Configuration and Security (25%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-4.1', 'Demonstrate basic understanding of NetworkPolicies', 'Services and Networking (20%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-4.2', 'Provide and troubleshoot access to applications via services', 'Services and Networking (20%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-4.3', 'Use Ingress rules to expose applications', 'Services and Networking (20%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-5.1', 'Understand API deprecations', 'Application Observability and Maintenance (15%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-5.2', 'Implement probes and health checks', 'Application Observability and Maintenance (15%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-5.3', 'Use built-in CLI tools to monitor Kubernetes applications', 'Application Observability and Maintenance (15%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-5.4', 'Utilize container logs', 'Application Observability and Maintenance (15%)'),
('b2000000-0000-4000-8000-000000000003', 'CKAD-5.5', 'Debugging in Kubernetes', 'Application Observability and Maintenance (15%)');

INSERT INTO certforge.catalog_exam_objective_topic (track_version_id, objective_key, topic_id)
SELECT 'b2000000-0000-4000-8000-000000000003', objective_key, topic_id FROM (VALUES
    ('CKAD-1.1', 'b3000000-0000-4000-8000-000000000021'::uuid),
    ('CKAD-1.2', 'b3000000-0000-4000-8000-000000000021'::uuid),
    ('CKAD-1.3', 'b3000000-0000-4000-8000-000000000021'::uuid),
    ('CKAD-1.4', 'b3000000-0000-4000-8000-000000000021'::uuid),
    ('CKAD-2.1', 'b3000000-0000-4000-8000-000000000022'::uuid),
    ('CKAD-2.2', 'b3000000-0000-4000-8000-000000000022'::uuid),
    ('CKAD-2.3', 'b3000000-0000-4000-8000-000000000022'::uuid),
    ('CKAD-2.4', 'b3000000-0000-4000-8000-000000000022'::uuid),
    ('CKAD-3.1', 'b3000000-0000-4000-8000-000000000023'::uuid),
    ('CKAD-3.2', 'b3000000-0000-4000-8000-000000000023'::uuid),
    ('CKAD-3.3', 'b3000000-0000-4000-8000-000000000023'::uuid),
    ('CKAD-3.4', 'b3000000-0000-4000-8000-000000000023'::uuid),
    ('CKAD-3.5', 'b3000000-0000-4000-8000-000000000023'::uuid),
    ('CKAD-3.6', 'b3000000-0000-4000-8000-000000000023'::uuid),
    ('CKAD-3.7', 'b3000000-0000-4000-8000-000000000023'::uuid),
    ('CKAD-3.8', 'b3000000-0000-4000-8000-000000000023'::uuid),
    ('CKAD-4.1', 'b3000000-0000-4000-8000-000000000024'::uuid),
    ('CKAD-4.2', 'b3000000-0000-4000-8000-000000000024'::uuid),
    ('CKAD-4.3', 'b3000000-0000-4000-8000-000000000024'::uuid),
    ('CKAD-5.1', 'b3000000-0000-4000-8000-000000000025'::uuid),
    ('CKAD-5.2', 'b3000000-0000-4000-8000-000000000025'::uuid),
    ('CKAD-5.3', 'b3000000-0000-4000-8000-000000000025'::uuid),
    ('CKAD-5.4', 'b3000000-0000-4000-8000-000000000025'::uuid),
    ('CKAD-5.5', 'b3000000-0000-4000-8000-000000000025'::uuid)
) AS mapping(objective_key, topic_id);

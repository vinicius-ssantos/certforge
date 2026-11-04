-- #171: second CNCF certification profile (KCSA), same pattern as V25's KCNA. Catalog-only: track,
-- version and exam all start DRAFT, so nothing here is learner-visible or claims readiness until
-- content is reviewed and the track is activated.
--
-- Objectives are seeded from the curriculum the exam itself publishes, read directly from the
-- primary source: cncf/curriculum's "KCSA Curriculum.pdf" (filename has a literal space), pinned
-- at commit 007442fa374ea3bd6e9217450388041803ad06ce (committed 2024-06-24, the oldest and most
-- stable of the five CNCF curricula this project has read), sha256
-- 2855eb7db729ab9ad0136b87d002560f82297e66e811026159df946227d5114, read 2026-11-03. All six
-- domains and their forty-two sub-topics are recorded as objectives, including the ones this
-- round's content pack does not yet cover: ADR 0017 explicitly wants coverage gaps visible rather
-- than a snapshot trimmed down to match what has been authored so far.
INSERT INTO certforge.catalog_track (id, slug, name, kind, status) VALUES
('b1000000-0000-4000-8000-000000000002', 'cncf-kcsa-certification',
 'CNCF Kubernetes and Cloud Native Security Associate (KCSA)', 'CERTIFICATION', 'DRAFT');

INSERT INTO certforge.catalog_certification_profile (track_id, provider, certification_name) VALUES
('b1000000-0000-4000-8000-000000000002', 'CNCF',
 'Kubernetes and Cloud Native Security Associate (KCSA)');

INSERT INTO certforge.catalog_track_version (id, track_id, label, status) VALUES
('b2000000-0000-4000-8000-000000000002', 'b1000000-0000-4000-8000-000000000002',
 'KCSA 2026.1', 'DRAFT');

INSERT INTO certforge.catalog_certification_exam
    (track_version_id, exam_code, exam_name, java_release, objectives_url)
VALUES
('b2000000-0000-4000-8000-000000000002', 'KCSA',
 'Kubernetes and Cloud Native Security Associate', NULL,
 'https://github.com/cncf/curriculum/blob/007442fa374ea3bd6e9217450388041803ad06ce/KCSA%20Curriculum.pdf');

-- One topic per exam domain. Sub-topics are modelled as objectives (many-to-many to topic),
-- not as separate topics, matching ADR 0017 decision 4 and V25's KCNA precedent.
INSERT INTO certforge.catalog_topic (id, track_id, slug, name) VALUES
('b3000000-0000-4000-8000-000000000011', 'b1000000-0000-4000-8000-000000000002',
 'kcsa-overview-cloud-native-security', 'Overview of Cloud Native Security'),
('b3000000-0000-4000-8000-000000000012', 'b1000000-0000-4000-8000-000000000002',
 'kcsa-cluster-component-security', 'Kubernetes Cluster Component Security'),
('b3000000-0000-4000-8000-000000000013', 'b1000000-0000-4000-8000-000000000002',
 'kcsa-security-fundamentals', 'Kubernetes Security Fundamentals'),
('b3000000-0000-4000-8000-000000000014', 'b1000000-0000-4000-8000-000000000002',
 'kcsa-threat-model', 'Kubernetes Threat Model'),
('b3000000-0000-4000-8000-000000000015', 'b1000000-0000-4000-8000-000000000002',
 'kcsa-platform-security', 'Platform Security'),
('b3000000-0000-4000-8000-000000000016', 'b1000000-0000-4000-8000-000000000002',
 'kcsa-compliance-frameworks', 'Compliance and Security Frameworks');

-- objective_ref is kept as the domain label for compatibility (ADR 0017 decision 4); weight is the
-- domain's official percentage of the exam, carried at the level ADR 0016 decision 7 assigns it.
INSERT INTO certforge.catalog_track_version_topic (track_version_id, topic_id, objective_ref, weight, position) VALUES
('b2000000-0000-4000-8000-000000000002', 'b3000000-0000-4000-8000-000000000011', 'Overview of Cloud Native Security', 14, 0),
('b2000000-0000-4000-8000-000000000002', 'b3000000-0000-4000-8000-000000000012', 'Kubernetes Cluster Component Security', 22, 1),
('b2000000-0000-4000-8000-000000000002', 'b3000000-0000-4000-8000-000000000013', 'Kubernetes Security Fundamentals', 22, 2),
('b2000000-0000-4000-8000-000000000002', 'b3000000-0000-4000-8000-000000000014', 'Kubernetes Threat Model', 16, 3),
('b2000000-0000-4000-8000-000000000002', 'b3000000-0000-4000-8000-000000000015', 'Platform Security', 16, 4),
('b2000000-0000-4000-8000-000000000002', 'b3000000-0000-4000-8000-000000000016', 'Compliance and Security Frameworks', 10, 5);

INSERT INTO certforge.catalog_exam_objective_snapshot
    (track_version_id, provider_version, verified_on, source_url, source_digest, status)
VALUES
('b2000000-0000-4000-8000-000000000002',
 'cncf/curriculum@007442f (KCSA Curriculum.pdf, commit 2024-06-24)', '2026-11-03',
 'https://github.com/cncf/curriculum/blob/007442fa374ea3bd6e9217450388041803ad06ce/KCSA%20Curriculum.pdf',
 'sha256:2855eb7db729ab9ad0136b87d002560f82297e66e811026159df946227d5114a', 'VERIFIED');

INSERT INTO certforge.catalog_exam_objective (track_version_id, objective_key, title, source_ref) VALUES
('b2000000-0000-4000-8000-000000000002', 'KCSA-1.1', 'The 4Cs of Cloud Native Security', 'Overview of Cloud Native Security (14%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-1.2', 'Cloud Provider and Infrastructure Security', 'Overview of Cloud Native Security (14%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-1.3', 'Controls and Frameworks', 'Overview of Cloud Native Security (14%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-1.4', 'Isolation Techniques', 'Overview of Cloud Native Security (14%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-1.5', 'Artifact Repository and Image Security', 'Overview of Cloud Native Security (14%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-1.6', 'Workload and Application Code Security', 'Overview of Cloud Native Security (14%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-2.1', 'API Server', 'Kubernetes Cluster Component Security (22%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-2.2', 'Controller Manager', 'Kubernetes Cluster Component Security (22%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-2.3', 'Scheduler', 'Kubernetes Cluster Component Security (22%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-2.4', 'Kubelet', 'Kubernetes Cluster Component Security (22%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-2.5', 'Container Runtime', 'Kubernetes Cluster Component Security (22%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-2.6', 'KubeProxy', 'Kubernetes Cluster Component Security (22%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-2.7', 'Pod', 'Kubernetes Cluster Component Security (22%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-2.8', 'Etcd', 'Kubernetes Cluster Component Security (22%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-2.9', 'Container Networking', 'Kubernetes Cluster Component Security (22%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-2.10', 'Client Security', 'Kubernetes Cluster Component Security (22%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-2.11', 'Storage', 'Kubernetes Cluster Component Security (22%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-3.1', 'Pod Security Standards', 'Kubernetes Security Fundamentals (22%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-3.2', 'Pod Security Admissions', 'Kubernetes Security Fundamentals (22%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-3.3', 'Authentication', 'Kubernetes Security Fundamentals (22%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-3.4', 'Secrets', 'Kubernetes Security Fundamentals (22%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-3.5', 'Isolation and Segmentation', 'Kubernetes Security Fundamentals (22%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-3.6', 'Audit Logging', 'Kubernetes Security Fundamentals (22%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-3.7', 'Network Policy', 'Kubernetes Security Fundamentals (22%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-4.1', 'Kubernetes Trust Boundaries and Data Flow', 'Kubernetes Threat Model (16%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-4.2', 'Persistence', 'Kubernetes Threat Model (16%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-4.3', 'Denial of Service', 'Kubernetes Threat Model (16%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-4.4', 'Malicious Code Execution and Compromised Applications in Containers', 'Kubernetes Threat Model (16%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-4.5', 'Attacker on the Network', 'Kubernetes Threat Model (16%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-4.6', 'Access to Sensitive Data', 'Kubernetes Threat Model (16%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-4.7', 'Privilege Escalation', 'Kubernetes Threat Model (16%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-5.1', 'Supply Chain Security', 'Platform Security (16%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-5.2', 'Image Repository', 'Platform Security (16%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-5.3', 'Observability', 'Platform Security (16%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-5.4', 'Service Mesh', 'Platform Security (16%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-5.5', 'PKI', 'Platform Security (16%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-5.6', 'Connectivity', 'Platform Security (16%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-5.7', 'Admission Control', 'Platform Security (16%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-6.1', 'Compliance Frameworks', 'Compliance and Security Frameworks (10%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-6.2', 'Threat Modeling Frameworks', 'Compliance and Security Frameworks (10%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-6.3', 'Supply Chain Compliance', 'Compliance and Security Frameworks (10%)'),
('b2000000-0000-4000-8000-000000000002', 'KCSA-6.4', 'Automation and Tooling', 'Compliance and Security Frameworks (10%)');

INSERT INTO certforge.catalog_exam_objective_topic (track_version_id, objective_key, topic_id)
SELECT 'b2000000-0000-4000-8000-000000000002', objective_key, topic_id FROM (VALUES
    ('KCSA-1.1', 'b3000000-0000-4000-8000-000000000011'::uuid),
    ('KCSA-1.2', 'b3000000-0000-4000-8000-000000000011'::uuid),
    ('KCSA-1.3', 'b3000000-0000-4000-8000-000000000011'::uuid),
    ('KCSA-1.4', 'b3000000-0000-4000-8000-000000000011'::uuid),
    ('KCSA-1.5', 'b3000000-0000-4000-8000-000000000011'::uuid),
    ('KCSA-1.6', 'b3000000-0000-4000-8000-000000000011'::uuid),
    ('KCSA-2.1', 'b3000000-0000-4000-8000-000000000012'::uuid),
    ('KCSA-2.2', 'b3000000-0000-4000-8000-000000000012'::uuid),
    ('KCSA-2.3', 'b3000000-0000-4000-8000-000000000012'::uuid),
    ('KCSA-2.4', 'b3000000-0000-4000-8000-000000000012'::uuid),
    ('KCSA-2.5', 'b3000000-0000-4000-8000-000000000012'::uuid),
    ('KCSA-2.6', 'b3000000-0000-4000-8000-000000000012'::uuid),
    ('KCSA-2.7', 'b3000000-0000-4000-8000-000000000012'::uuid),
    ('KCSA-2.8', 'b3000000-0000-4000-8000-000000000012'::uuid),
    ('KCSA-2.9', 'b3000000-0000-4000-8000-000000000012'::uuid),
    ('KCSA-2.10', 'b3000000-0000-4000-8000-000000000012'::uuid),
    ('KCSA-2.11', 'b3000000-0000-4000-8000-000000000012'::uuid),
    ('KCSA-3.1', 'b3000000-0000-4000-8000-000000000013'::uuid),
    ('KCSA-3.2', 'b3000000-0000-4000-8000-000000000013'::uuid),
    ('KCSA-3.3', 'b3000000-0000-4000-8000-000000000013'::uuid),
    ('KCSA-3.4', 'b3000000-0000-4000-8000-000000000013'::uuid),
    ('KCSA-3.5', 'b3000000-0000-4000-8000-000000000013'::uuid),
    ('KCSA-3.6', 'b3000000-0000-4000-8000-000000000013'::uuid),
    ('KCSA-3.7', 'b3000000-0000-4000-8000-000000000013'::uuid),
    ('KCSA-4.1', 'b3000000-0000-4000-8000-000000000014'::uuid),
    ('KCSA-4.2', 'b3000000-0000-4000-8000-000000000014'::uuid),
    ('KCSA-4.3', 'b3000000-0000-4000-8000-000000000014'::uuid),
    ('KCSA-4.4', 'b3000000-0000-4000-8000-000000000014'::uuid),
    ('KCSA-4.5', 'b3000000-0000-4000-8000-000000000014'::uuid),
    ('KCSA-4.6', 'b3000000-0000-4000-8000-000000000014'::uuid),
    ('KCSA-4.7', 'b3000000-0000-4000-8000-000000000014'::uuid),
    ('KCSA-5.1', 'b3000000-0000-4000-8000-000000000015'::uuid),
    ('KCSA-5.2', 'b3000000-0000-4000-8000-000000000015'::uuid),
    ('KCSA-5.3', 'b3000000-0000-4000-8000-000000000015'::uuid),
    ('KCSA-5.4', 'b3000000-0000-4000-8000-000000000015'::uuid),
    ('KCSA-5.5', 'b3000000-0000-4000-8000-000000000015'::uuid),
    ('KCSA-5.6', 'b3000000-0000-4000-8000-000000000015'::uuid),
    ('KCSA-5.7', 'b3000000-0000-4000-8000-000000000015'::uuid),
    ('KCSA-6.1', 'b3000000-0000-4000-8000-000000000016'::uuid),
    ('KCSA-6.2', 'b3000000-0000-4000-8000-000000000016'::uuid),
    ('KCSA-6.3', 'b3000000-0000-4000-8000-000000000016'::uuid),
    ('KCSA-6.4', 'b3000000-0000-4000-8000-000000000016'::uuid)
) AS mapping(objective_key, topic_id);

-- #171: first CNCF certification profile (KCNA) on top of the provider-neutral exam-snapshot
-- schema V17 added. Catalog-only: track, version and exam all start DRAFT, so nothing here is
-- learner-visible or claims readiness until content is reviewed and the track is activated.
--
-- Objectives are seeded from the curriculum the exam itself publishes, read directly from the
-- primary source rather than a secondary summary: cncf/curriculum's KCNA_Curriculum.pdf, pinned
-- at commit c2df915fb5a07e4c7872a902f42e32192edf995b (committed 2026-03-22), sha256
-- 2141ce75db8c67a72588775345d3b8448e4a6d3f3b46c37f86f4b388c153b8ff, read 2026-11-03. All four
-- domains and their thirteen sub-topics are recorded as objectives, including the ones this
-- round's content pack does not yet cover: ADR 0017 explicitly wants coverage gaps visible rather
-- than a snapshot trimmed down to match what has been authored so far.
INSERT INTO certforge.catalog_track (id, slug, name, kind, status) VALUES
('b1000000-0000-4000-8000-000000000001', 'cncf-kcna-certification',
 'CNCF Kubernetes and Cloud Native Associate (KCNA)', 'CERTIFICATION', 'DRAFT');

INSERT INTO certforge.catalog_certification_profile (track_id, provider, certification_name) VALUES
('b1000000-0000-4000-8000-000000000001', 'CNCF',
 'Kubernetes and Cloud Native Associate (KCNA)');

INSERT INTO certforge.catalog_track_version (id, track_id, label, status) VALUES
('b2000000-0000-4000-8000-000000000001', 'b1000000-0000-4000-8000-000000000001',
 'KCNA 2026.1', 'DRAFT');

INSERT INTO certforge.catalog_certification_exam
    (track_version_id, exam_code, exam_name, java_release, objectives_url)
VALUES
('b2000000-0000-4000-8000-000000000001', 'KCNA',
 'Kubernetes and Cloud Native Associate', NULL,
 'https://github.com/cncf/curriculum/blob/c2df915fb5a07e4c7872a902f42e32192edf995b/KCNA_Curriculum.pdf');

-- One topic per exam domain. Sub-topics are modelled as objectives (many-to-many to topic),
-- not as separate topics, matching ADR 0017 decision 4.
INSERT INTO certforge.catalog_topic (id, track_id, slug, name) VALUES
('b3000000-0000-4000-8000-000000000001', 'b1000000-0000-4000-8000-000000000001',
 'kcna-kubernetes-fundamentals', 'Kubernetes Fundamentals'),
('b3000000-0000-4000-8000-000000000002', 'b1000000-0000-4000-8000-000000000001',
 'kcna-container-orchestration', 'Container Orchestration'),
('b3000000-0000-4000-8000-000000000003', 'b1000000-0000-4000-8000-000000000001',
 'kcna-cloud-native-app-delivery', 'Cloud Native Application Delivery'),
('b3000000-0000-4000-8000-000000000004', 'b1000000-0000-4000-8000-000000000001',
 'kcna-cloud-native-architecture', 'Cloud Native Architecture');

-- objective_ref is kept as the domain label for compatibility (ADR 0017 decision 4); weight is the
-- domain's official percentage of the exam, carried at the level ADR 0016 decision 7 assigns it.
INSERT INTO certforge.catalog_track_version_topic (track_version_id, topic_id, objective_ref, weight, position) VALUES
('b2000000-0000-4000-8000-000000000001', 'b3000000-0000-4000-8000-000000000001', 'Kubernetes Fundamentals', 44, 0),
('b2000000-0000-4000-8000-000000000001', 'b3000000-0000-4000-8000-000000000002', 'Container Orchestration', 28, 1),
('b2000000-0000-4000-8000-000000000001', 'b3000000-0000-4000-8000-000000000003', 'Cloud Native Application Delivery', 16, 2),
('b2000000-0000-4000-8000-000000000001', 'b3000000-0000-4000-8000-000000000004', 'Cloud Native Architecture', 12, 3);

INSERT INTO certforge.catalog_exam_objective_snapshot
    (track_version_id, provider_version, verified_on, source_url, source_digest, status)
VALUES
('b2000000-0000-4000-8000-000000000001',
 'cncf/curriculum@c2df915 (KCNA_Curriculum.pdf, commit 2026-03-22)', '2026-11-03',
 'https://github.com/cncf/curriculum/blob/c2df915fb5a07e4c7872a902f42e32192edf995b/KCNA_Curriculum.pdf',
 'sha256:2141ce75db8c67a72588775345d3b8448e4a6d3f3b46c37f86f4b388c153b8ff', 'VERIFIED');

INSERT INTO certforge.catalog_exam_objective (track_version_id, objective_key, title, source_ref) VALUES
('b2000000-0000-4000-8000-000000000001', 'KCNA-1.1', 'Kubernetes Core Concepts', 'Kubernetes Fundamentals (44%)'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-1.2', 'Administration', 'Kubernetes Fundamentals (44%)'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-1.3', 'Scheduling', 'Kubernetes Fundamentals (44%)'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-1.4', 'Containerization', 'Kubernetes Fundamentals (44%)'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-2.1', 'Networking', 'Container Orchestration (28%)'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-2.2', 'Security', 'Container Orchestration (28%)'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-2.3', 'Troubleshooting', 'Container Orchestration (28%)'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-2.4', 'Storage', 'Container Orchestration (28%)'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-3.1', 'Application Delivery', 'Cloud Native Application Delivery (16%)'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-3.2', 'Debugging', 'Cloud Native Application Delivery (16%)'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-4.1', 'Observability', 'Cloud Native Architecture (12%)'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-4.2', 'Cloud Native Ecosystem and Principles', 'Cloud Native Architecture (12%)'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-4.3', 'Cloud Native Community and Collaboration', 'Cloud Native Architecture (12%)');

INSERT INTO certforge.catalog_exam_objective_topic (track_version_id, objective_key, topic_id) VALUES
('b2000000-0000-4000-8000-000000000001', 'KCNA-1.1', 'b3000000-0000-4000-8000-000000000001'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-1.2', 'b3000000-0000-4000-8000-000000000001'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-1.3', 'b3000000-0000-4000-8000-000000000001'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-1.4', 'b3000000-0000-4000-8000-000000000001'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-2.1', 'b3000000-0000-4000-8000-000000000002'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-2.2', 'b3000000-0000-4000-8000-000000000002'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-2.3', 'b3000000-0000-4000-8000-000000000002'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-2.4', 'b3000000-0000-4000-8000-000000000002'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-3.1', 'b3000000-0000-4000-8000-000000000003'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-3.2', 'b3000000-0000-4000-8000-000000000003'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-4.1', 'b3000000-0000-4000-8000-000000000004'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-4.2', 'b3000000-0000-4000-8000-000000000004'),
('b2000000-0000-4000-8000-000000000001', 'KCNA-4.3', 'b3000000-0000-4000-8000-000000000004');

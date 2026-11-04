-- #171: fourth CNCF certification profile (CKA), same pattern as V25-V27. Catalog-only: track,
-- version and exam all start DRAFT, so nothing here is learner-visible or claims readiness until
-- content is reviewed and the track is activated.
--
-- CKA is a hands-on, performance-based exam graded on a live terminal
-- (docs/architecture/cncf-certification-roadmap.md). Its Troubleshooting domain (30%, the largest
-- single domain across all five CNCF certs this project tracks) is split into two phases there:
-- Phase 1 is static diagnosis over already-captured kubectl/log output (ordinary multiple choice,
-- no execution, buildable now); Phase 2 is the real sandboxed labs #175 scopes, not started. This
-- pack's Troubleshooting questions are Phase 1 only and must never imply they test the actual
-- exam-day terminal skill, same discipline as every other domain here.
--
-- Objectives are seeded from the curriculum the exam itself publishes, read directly from the
-- primary source: cncf/curriculum's CKA_Curriculum_v1.37.pdf, pinned at commit
-- b3c8508b9f6cd0bcfa76c2e4b7cc9b6a2f109bec (committed 2026-10-15), sha256
-- 634b793704485c2ac424a90902e0f8b28f7348a49814393434f808e3e78ec18c, read 2026-11-04. All five
-- domains and their twenty-seven sub-topics are recorded as objectives, including the ones this
-- round's content pack does not yet cover: ADR 0017 explicitly wants coverage gaps visible rather
-- than a snapshot trimmed down to match what has been authored so far.
INSERT INTO certforge.catalog_track (id, slug, name, kind, status) VALUES
('b1000000-0000-4000-8000-000000000004', 'cncf-cka-certification',
 'CNCF Certified Kubernetes Administrator (CKA)', 'CERTIFICATION', 'DRAFT');

INSERT INTO certforge.catalog_certification_profile (track_id, provider, certification_name) VALUES
('b1000000-0000-4000-8000-000000000004', 'CNCF',
 'Certified Kubernetes Administrator (CKA)');

INSERT INTO certforge.catalog_track_version (id, track_id, label, status) VALUES
('b2000000-0000-4000-8000-000000000004', 'b1000000-0000-4000-8000-000000000004',
 'CKA 2026.1', 'DRAFT');

INSERT INTO certforge.catalog_certification_exam
    (track_version_id, exam_code, exam_name, java_release, objectives_url)
VALUES
('b2000000-0000-4000-8000-000000000004', 'CKA',
 'Certified Kubernetes Administrator', NULL,
 'https://github.com/cncf/curriculum/blob/b3c8508b9f6cd0bcfa76c2e4b7cc9b6a2f109bec/CKA_Curriculum_v1.37.pdf');

-- One topic per exam domain. Sub-topics are modelled as objectives (many-to-many to topic),
-- not as separate topics, matching ADR 0017 decision 4 and the KCNA/KCSA/CKAD precedent.
INSERT INTO certforge.catalog_topic (id, track_id, slug, name) VALUES
('b3000000-0000-4000-8000-000000000031', 'b1000000-0000-4000-8000-000000000004',
 'cka-storage', 'Storage'),
('b3000000-0000-4000-8000-000000000032', 'b1000000-0000-4000-8000-000000000004',
 'cka-workloads-scheduling', 'Workloads and Scheduling'),
('b3000000-0000-4000-8000-000000000033', 'b1000000-0000-4000-8000-000000000004',
 'cka-servicing-networking', 'Servicing and Networking'),
('b3000000-0000-4000-8000-000000000034', 'b1000000-0000-4000-8000-000000000004',
 'cka-cluster-architecture', 'Cluster Architecture, Installation and Configuration'),
('b3000000-0000-4000-8000-000000000035', 'b1000000-0000-4000-8000-000000000004',
 'cka-troubleshooting', 'Troubleshooting');

-- objective_ref is kept as the domain label for compatibility (ADR 0017 decision 4); weight is the
-- domain's official percentage of the exam, carried at the level ADR 0016 decision 7 assigns it.
INSERT INTO certforge.catalog_track_version_topic (track_version_id, topic_id, objective_ref, weight, position) VALUES
('b2000000-0000-4000-8000-000000000004', 'b3000000-0000-4000-8000-000000000031', 'Storage', 10, 0),
('b2000000-0000-4000-8000-000000000004', 'b3000000-0000-4000-8000-000000000032', 'Workloads and Scheduling', 15, 1),
('b2000000-0000-4000-8000-000000000004', 'b3000000-0000-4000-8000-000000000033', 'Servicing and Networking', 20, 2),
('b2000000-0000-4000-8000-000000000004', 'b3000000-0000-4000-8000-000000000034', 'Cluster Architecture, Installation and Configuration', 25, 3),
('b2000000-0000-4000-8000-000000000004', 'b3000000-0000-4000-8000-000000000035', 'Troubleshooting', 30, 4);

INSERT INTO certforge.catalog_exam_objective_snapshot
    (track_version_id, provider_version, verified_on, source_url, source_digest, status)
VALUES
('b2000000-0000-4000-8000-000000000004',
 'cncf/curriculum@b3c8508 (CKA_Curriculum_v1.37.pdf, commit 2026-10-15)', '2026-11-04',
 'https://github.com/cncf/curriculum/blob/b3c8508b9f6cd0bcfa76c2e4b7cc9b6a2f109bec/CKA_Curriculum_v1.37.pdf',
 'sha256:634b793704485c2ac424a90902e0f8b28f7348a49814393434f808e3e78ec18c', 'VERIFIED');

INSERT INTO certforge.catalog_exam_objective (track_version_id, objective_key, title, source_ref) VALUES
('b2000000-0000-4000-8000-000000000004', 'CKA-1.1', 'Implement storage classes and dynamic volume provisioning', 'Storage (10%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-1.2', 'Configure volume types, access modes and reclaim policies', 'Storage (10%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-1.3', 'Manage persistent volumes and persistent volume claims', 'Storage (10%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-2.1', 'Understand application deployments and how to perform rolling update and rollbacks', 'Workloads and Scheduling (15%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-2.2', 'Use ConfigMaps and Secrets to configure applications', 'Workloads and Scheduling (15%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-2.3', 'Configure workload autoscaling', 'Workloads and Scheduling (15%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-2.4', 'Understand the primitives used to create robust, self-healing, application deployments', 'Workloads and Scheduling (15%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-2.5', 'Configure Pod admission and scheduling (limits, node affinity, etc.)', 'Workloads and Scheduling (15%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-3.1', 'Understand connectivity between Pods', 'Servicing and Networking (20%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-3.2', 'Define and enforce Network Policies', 'Servicing and Networking (20%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-3.3', 'Use ClusterIP, NodePort, LoadBalancer service types and endpoints', 'Servicing and Networking (20%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-3.4', 'Use the Gateway API to manage Ingress traffic', 'Servicing and Networking (20%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-3.5', 'Know how to use Ingress controllers and Ingress resources', 'Servicing and Networking (20%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-3.6', 'Understand and use CoreDNS', 'Servicing and Networking (20%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-4.1', 'Manage role based access control (RBAC)', 'Cluster Architecture, Installation and Configuration (25%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-4.2', 'Prepare underlying infrastructure for installing a Kubernetes cluster', 'Cluster Architecture, Installation and Configuration (25%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-4.3', 'Create and manage Kubernetes clusters using kubeadm', 'Cluster Architecture, Installation and Configuration (25%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-4.4', 'Manage the lifecycle of Kubernetes clusters', 'Cluster Architecture, Installation and Configuration (25%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-4.5', 'Implement and configure a highly-available control plane', 'Cluster Architecture, Installation and Configuration (25%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-4.6', 'Use Helm and Kustomize to install cluster components', 'Cluster Architecture, Installation and Configuration (25%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-4.7', 'Understand extension interfaces (CNI, CSI, CRI, etc.)', 'Cluster Architecture, Installation and Configuration (25%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-4.8', 'Understand CRDs, install and configure operators', 'Cluster Architecture, Installation and Configuration (25%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-5.1', 'Troubleshoot clusters and nodes', 'Troubleshooting (30%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-5.2', 'Troubleshoot cluster components', 'Troubleshooting (30%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-5.3', 'Monitor cluster and application resource usage', 'Troubleshooting (30%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-5.4', 'Manage and evaluate container output streams', 'Troubleshooting (30%)'),
('b2000000-0000-4000-8000-000000000004', 'CKA-5.5', 'Troubleshoot services and networking', 'Troubleshooting (30%)');

INSERT INTO certforge.catalog_exam_objective_topic (track_version_id, objective_key, topic_id)
SELECT 'b2000000-0000-4000-8000-000000000004', objective_key, topic_id FROM (VALUES
    ('CKA-1.1', 'b3000000-0000-4000-8000-000000000031'::uuid),
    ('CKA-1.2', 'b3000000-0000-4000-8000-000000000031'::uuid),
    ('CKA-1.3', 'b3000000-0000-4000-8000-000000000031'::uuid),
    ('CKA-2.1', 'b3000000-0000-4000-8000-000000000032'::uuid),
    ('CKA-2.2', 'b3000000-0000-4000-8000-000000000032'::uuid),
    ('CKA-2.3', 'b3000000-0000-4000-8000-000000000032'::uuid),
    ('CKA-2.4', 'b3000000-0000-4000-8000-000000000032'::uuid),
    ('CKA-2.5', 'b3000000-0000-4000-8000-000000000032'::uuid),
    ('CKA-3.1', 'b3000000-0000-4000-8000-000000000033'::uuid),
    ('CKA-3.2', 'b3000000-0000-4000-8000-000000000033'::uuid),
    ('CKA-3.3', 'b3000000-0000-4000-8000-000000000033'::uuid),
    ('CKA-3.4', 'b3000000-0000-4000-8000-000000000033'::uuid),
    ('CKA-3.5', 'b3000000-0000-4000-8000-000000000033'::uuid),
    ('CKA-3.6', 'b3000000-0000-4000-8000-000000000033'::uuid),
    ('CKA-4.1', 'b3000000-0000-4000-8000-000000000034'::uuid),
    ('CKA-4.2', 'b3000000-0000-4000-8000-000000000034'::uuid),
    ('CKA-4.3', 'b3000000-0000-4000-8000-000000000034'::uuid),
    ('CKA-4.4', 'b3000000-0000-4000-8000-000000000034'::uuid),
    ('CKA-4.5', 'b3000000-0000-4000-8000-000000000034'::uuid),
    ('CKA-4.6', 'b3000000-0000-4000-8000-000000000034'::uuid),
    ('CKA-4.7', 'b3000000-0000-4000-8000-000000000034'::uuid),
    ('CKA-4.8', 'b3000000-0000-4000-8000-000000000034'::uuid),
    ('CKA-5.1', 'b3000000-0000-4000-8000-000000000035'::uuid),
    ('CKA-5.2', 'b3000000-0000-4000-8000-000000000035'::uuid),
    ('CKA-5.3', 'b3000000-0000-4000-8000-000000000035'::uuid),
    ('CKA-5.4', 'b3000000-0000-4000-8000-000000000035'::uuid),
    ('CKA-5.5', 'b3000000-0000-4000-8000-000000000035'::uuid)
) AS mapping(objective_key, topic_id);

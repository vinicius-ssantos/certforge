-- #171: distinguish a multiple-choice exam from a hands-on, performance-based one, as data rather
-- than as a comment only a reader of the migration file could see.
--
-- V27 and V28 already documented in prose that CKAD and CKA are performance-based -- a quiz pack
-- can only ever test the conceptual layer underneath such an exam, never the live-terminal skill
-- it actually grades -- but an already-applied migration is immutable, so that fact becomes
-- queryable here instead of by editing V27/V28.
--
-- The default covers every existing row correctly without a backfill: Java (1Z0-830), KCNA and
-- KCSA are themselves multiple-choice, proctored exams (docs/architecture/cncf-certification-
-- roadmap.md), and so are every AWS and Terraform exam seeded so far. CKS has no row yet (still
-- blocked on #175 Phase 2) so there is nothing to backfill for it.
ALTER TABLE certforge.catalog_certification_exam
    ADD COLUMN exam_format VARCHAR(20) NOT NULL DEFAULT 'MULTIPLE_CHOICE'
        CHECK (exam_format IN ('MULTIPLE_CHOICE', 'PERFORMANCE_BASED'));

UPDATE certforge.catalog_certification_exam
SET exam_format = 'PERFORMANCE_BASED'
WHERE track_version_id IN (
    'b2000000-0000-4000-8000-000000000003', -- CKAD (V27)
    'b2000000-0000-4000-8000-000000000004'  -- CKA (V28)
);

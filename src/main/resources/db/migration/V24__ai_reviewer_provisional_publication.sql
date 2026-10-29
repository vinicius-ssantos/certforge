-- ADR 0022: an AI-reviewer account may provisionally approve and publish an Asserted-tier revision.
-- Its decision is recorded as AI_APPROVED, never as APPROVED, so nothing downstream can read it as an
-- independent human review; AI_REVIEW_CONFIRMED is the human confirmation that makes it permanent.
ALTER TABLE certforge.qb_content_review
    DROP CONSTRAINT qb_content_review_decision_check;

ALTER TABLE certforge.qb_content_review
    ADD CONSTRAINT qb_content_review_decision_check
        CHECK (decision IN ('APPROVED', 'CHANGES_REQUESTED', 'AI_APPROVED', 'AI_REVIEW_CONFIRMED'));

-- The new role an account acting as the AI reviewer holds (Role.AI_REVIEWER), granting
-- Permission.CONTENT_AI_REVIEW alone.
ALTER TABLE certforge.identity_account_role
    DROP CONSTRAINT identity_account_role_role_check;

ALTER TABLE certforge.identity_account_role
    ADD CONSTRAINT identity_account_role_role_check
        CHECK (role IN ('LEARNER', 'EDITOR', 'REVIEWER', 'ADMINISTRATOR', 'AI_REVIEWER'));

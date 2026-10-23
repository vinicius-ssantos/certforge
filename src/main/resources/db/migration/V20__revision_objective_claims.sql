-- #165: which exam objectives a question says it prepares for.
--
-- V17 gave an exam version a verified objective snapshot and the objectives read from it; the
-- endpoint that writes one arrived with #251. A question was still bound to a topic and nothing
-- else, so `objectiveKeys` — which a content pack carries and the manifest schema demands of every
-- certification question — was dropped by content/editorial-pack.mjs on the way in, and
-- stageEditorialPack refused certification packs outright rather than lose it silently.
--
-- The claim belongs to a REVISION, not to a question. A revision is immutable and is what a
-- reviewer approves, so the objectives a question claims are part of what was read; changing them
-- means a new revision, exactly as changing the prompt does.
--
-- There is deliberately no foreign key to catalog_exam_objective, and this is the part worth
-- reading twice. A draft is written before its topic is mapped into an active exam version — often
-- before the exam's objectives have been read at all — so a key cannot be resolved to a version at
-- the moment it is authored. A foreign key here would therefore refuse ordinary drafting. Instead:
--
--   * publishing refuses a key the active exam version's verified objectives do not contain, which
--     is the moment the claim becomes a claim to a learner;
--   * recording a new reading of the provider's page refuses to drop an objective a published
--     revision still claims, so the two cannot drift apart afterwards.
--
-- Both rules live in code, named, and are tested. What the table says on its own is only that a
-- revision claimed these keys.
--
-- What no part of this says is that the question came from an exam. It is a claim about this
-- project's own material — that this question prepares for that objective — and ADR 0017 is
-- explicit that a certification profile is authored study material, never a copy of the exam.
CREATE TABLE certforge.qb_revision_objective_key (
    revision_id   UUID         NOT NULL REFERENCES certforge.qb_question_revision (id),
    objective_key VARCHAR(120) NOT NULL,
    PRIMARY KEY (revision_id, objective_key)
);

CREATE INDEX qb_revision_objective_key_by_key
    ON certforge.qb_revision_objective_key (objective_key);

COMMENT ON TABLE certforge.qb_revision_objective_key IS
    'Exam objectives one revision claims to prepare for; a claim about this material, never that it is an official question.';

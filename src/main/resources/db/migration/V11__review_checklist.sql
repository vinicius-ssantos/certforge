-- What a reviewer attested to when deciding, from the fixed content-policy checklist.
-- Stored as the codes of the items the reviewer ticked (see ReviewChecklist). It is evidence of
-- what was checked, not a gate: whether an approval may omit an item is an editorial policy.
-- Existing reviews predate the checklist and keep an empty list.
ALTER TABLE certforge.qb_content_review
    ADD COLUMN checklist TEXT NOT NULL DEFAULT '';

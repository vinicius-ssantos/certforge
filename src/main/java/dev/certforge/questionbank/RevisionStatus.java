package dev.certforge.questionbank;

/** Editorial lifecycle: DRAFT -> TECHNICAL_REVIEW -> APPROVED -> PUBLISHED -> DEPRECATED. */
public enum RevisionStatus {
  DRAFT,
  TECHNICAL_REVIEW,
  APPROVED,
  PUBLISHED,
  DEPRECATED
}

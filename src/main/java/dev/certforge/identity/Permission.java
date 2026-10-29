package dev.certforge.identity;

/**
 * Explicit capabilities checked server-side. Other modules protect operations with {@code
 * hasAuthority('<NAME>')}; roles only group permissions and are never checked directly.
 */
public enum Permission {
  STUDY,
  CATALOG_MANAGE,
  CONTENT_AUTHOR,
  CONTENT_REVIEW,
  /**
   * May record a review decision on a revision they wrote themselves. Separate from {@link
   * #CONTENT_REVIEW} because it is a different claim: reviewing is checking the work, and this says
   * whose judgement is final when there is nobody else to check it. Granted only to the
   * administrator, so an author added later still needs someone else to approve their work.
   */
  CONTENT_SELF_REVIEW,
  CONTENT_PUBLISH,
  /**
   * May approve and publish a revision that has no mechanical verification evidence (the Asserted
   * tier, ADR 0011), in one step, provisionally (ADR 0022). Separate from {@link #CONTENT_REVIEW}
   * because the claim is narrower and weaker: this account's approval is not final, expires unless
   * a {@code CONTENT_REVIEW} account confirms it within a configured window, and never applies to a
   * revision that carries verification evidence.
   */
  CONTENT_AI_REVIEW,
  ACCOUNT_MANAGE,
  AUDIT_READ,
  OPERATIONS_VIEW
}

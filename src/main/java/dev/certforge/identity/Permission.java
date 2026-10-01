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
  CONTENT_PUBLISH,
  ACCOUNT_MANAGE,
  AUDIT_READ,
  OPERATIONS_VIEW
}

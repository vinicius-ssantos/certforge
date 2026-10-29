package dev.certforge.identity;

import java.util.EnumSet;
import java.util.Set;

/** Coarse account roles. Each role grants an explicit, fixed set of {@link Permission}s. */
public enum Role {
  LEARNER(Permission.STUDY),
  EDITOR(Permission.CONTENT_AUTHOR),
  REVIEWER(Permission.CONTENT_REVIEW),
  /**
   * An account acting as the AI reviewer ADR 0022 names: it may approve and publish an
   * Asserted-tier revision provisionally, and nothing else. Never grant {@link
   * Permission#CONTENT_REVIEW} to the same account that holds this role -- that would make its
   * approvals final, which is exactly what ADR 0022 does not allow.
   */
  AI_REVIEWER(Permission.CONTENT_AI_REVIEW),
  ADMINISTRATOR(
      Permission.CATALOG_MANAGE,
      Permission.CONTENT_AUTHOR,
      Permission.CONTENT_REVIEW,
      Permission.CONTENT_SELF_REVIEW,
      Permission.CONTENT_PUBLISH,
      Permission.ACCOUNT_MANAGE,
      Permission.AUDIT_READ,
      Permission.OPERATIONS_VIEW);

  private final Set<Permission> granted;

  Role(Permission first, Permission... rest) {
    this.granted = EnumSet.of(first, rest);
  }

  /** Permissions granted by this role. */
  public Set<Permission> permissions() {
    return EnumSet.copyOf(granted);
  }
}

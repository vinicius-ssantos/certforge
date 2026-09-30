package dev.certforge.identity;

import java.util.EnumSet;
import java.util.Set;

/** Coarse account roles. Each role grants an explicit, fixed set of {@link Permission}s. */
public enum Role {
  LEARNER(Permission.STUDY),
  EDITOR(Permission.CONTENT_AUTHOR),
  REVIEWER(Permission.CONTENT_REVIEW),
  ADMINISTRATOR(
      Permission.CATALOG_MANAGE,
      Permission.CONTENT_AUTHOR,
      Permission.CONTENT_REVIEW,
      Permission.CONTENT_PUBLISH,
      Permission.ACCOUNT_MANAGE);

  private final Set<Permission> granted;

  Role(Permission first, Permission... rest) {
    this.granted = EnumSet.of(first, rest);
  }

  /** Permissions granted by this role. */
  public Set<Permission> permissions() {
    return EnumSet.copyOf(granted);
  }
}

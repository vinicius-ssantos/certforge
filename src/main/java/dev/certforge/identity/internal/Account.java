package dev.certforge.identity.internal;

import dev.certforge.identity.Role;
import java.util.Set;
import java.util.UUID;

/** Persisted account. The password hash never leaves the identity module. */
record Account(UUID id, String email, String passwordHash, boolean enabled, Set<Role> roles) {

  @Override
  public String toString() {
    return "Account[id=" + id + ", enabled=" + enabled + ", roles=" + roles + "]";
  }
}

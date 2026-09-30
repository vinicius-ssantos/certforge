package dev.certforge.identity.internal;

import dev.certforge.identity.Permission;
import dev.certforge.identity.Role;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

/** Learner-safe projection of an account. Never includes the password hash. */
record AccountView(
    UUID id, String email, boolean enabled, List<String> roles, List<String> permissions) {

  static AccountView of(Account account) {
    List<String> roles =
        account.roles().stream().map(Role::name).sorted(Comparator.naturalOrder()).toList();
    List<String> permissions =
        account.roles().stream()
            .flatMap(role -> role.permissions().stream())
            .map(Permission::name)
            .distinct()
            .sorted(Comparator.naturalOrder())
            .toList();
    return new AccountView(account.id(), account.email(), account.enabled(), roles, permissions);
  }
}

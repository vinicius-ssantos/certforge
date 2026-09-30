package dev.certforge.identity.internal;

import dev.certforge.identity.ActorId;
import dev.certforge.identity.Role;
import java.util.EnumSet;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.session.FindByIndexNameSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
class AccountService {

  private final AccountRepository accounts;
  private final PasswordEncoder passwordEncoder;
  private final PasswordPolicy passwordPolicy;
  private final FindByIndexNameSessionRepository<?> sessions;

  AccountService(
      AccountRepository accounts,
      PasswordEncoder passwordEncoder,
      PasswordPolicy passwordPolicy,
      FindByIndexNameSessionRepository<?> sessions) {
    this.accounts = accounts;
    this.passwordEncoder = passwordEncoder;
    this.passwordPolicy = passwordPolicy;
    this.sessions = sessions;
  }

  static String normalizeEmail(String email) {
    return email.trim().toLowerCase(Locale.ROOT);
  }

  /** Registers a learner account. */
  @Transactional
  Account register(String rawEmail, String password) {
    String email = normalizeEmail(rawEmail);
    passwordPolicy
        .violation(password, email)
        .ifPresent(
            code -> {
              throw new WeakPassword(code);
            });
    return create(email, password, Set.of(Role.LEARNER));
  }

  /** Creates an account with explicit roles, used for bootstrap provisioning. */
  @Transactional
  Account create(String email, String password, Set<Role> roles) {
    UUID id = UUID.randomUUID();
    accounts.insert(id, email, passwordEncoder.encode(password), withLearner(roles));
    return accounts.findById(id).orElseThrow();
  }

  /** Replaces the account's roles (LEARNER is always kept) and revokes its sessions. */
  @Transactional
  Account assignRoles(ActorId actor, UUID targetId, Set<Role> roles) {
    Account target = accounts.findById(targetId).orElseThrow(AccountNotFound::new);
    Set<Role> effective = withLearner(roles);
    if (actor.value().equals(targetId)
        && target.roles().contains(Role.ADMINISTRATOR)
        && !effective.contains(Role.ADMINISTRATOR)) {
      throw new OwnAdminAccess();
    }
    accounts.replaceRoles(targetId, effective);
    revokeSessions(targetId);
    return accounts.findById(targetId).orElseThrow();
  }

  /** Enables or disables the account; disabling also revokes its sessions. */
  @Transactional
  Account setEnabled(ActorId actor, UUID targetId, boolean enabled) {
    if (!enabled && actor.value().equals(targetId)) {
      throw new OwnAdminAccess();
    }
    if (!accounts.setEnabled(targetId, enabled)) {
      throw new AccountNotFound();
    }
    if (!enabled) {
      revokeSessions(targetId);
    }
    return accounts.findById(targetId).orElseThrow();
  }

  Account get(UUID id) {
    return accounts.findById(id).orElseThrow(AccountNotFound::new);
  }

  boolean hasAdministrator() {
    return accounts.existsWithRole(Role.ADMINISTRATOR);
  }

  private static Set<Role> withLearner(Set<Role> roles) {
    Set<Role> effective = EnumSet.of(Role.LEARNER);
    effective.addAll(roles);
    return effective;
  }

  private void revokeSessions(UUID accountId) {
    sessions.findByPrincipalName(accountId.toString()).keySet().forEach(sessions::deleteById);
  }
}

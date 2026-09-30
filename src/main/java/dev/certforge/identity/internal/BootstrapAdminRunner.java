package dev.certforge.identity.internal;

import dev.certforge.identity.Role;
import java.util.Set;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * Creates the first administrator when none exists and both bootstrap values are configured. The
 * password comes from configuration only and is never logged.
 */
@Component
class BootstrapAdminRunner implements ApplicationRunner {

  private static final Logger log = LoggerFactory.getLogger(BootstrapAdminRunner.class);

  private final IdentityProperties properties;
  private final AccountService accounts;
  private final PasswordPolicy passwordPolicy;

  BootstrapAdminRunner(
      IdentityProperties properties, AccountService accounts, PasswordPolicy passwordPolicy) {
    this.properties = properties;
    this.accounts = accounts;
    this.passwordPolicy = passwordPolicy;
  }

  @Override
  public void run(ApplicationArguments args) {
    IdentityProperties.BootstrapAdmin admin = properties.bootstrapAdmin();
    if (!admin.configured()) {
      return;
    }
    if (accounts.hasAdministrator()) {
      log.info("Bootstrap administrator skipped: an administrator already exists");
      return;
    }
    String email = AccountService.normalizeEmail(admin.email());
    passwordPolicy
        .violation(admin.password(), email)
        .ifPresent(
            code -> {
              throw new IllegalStateException("Bootstrap administrator password rejected: " + code);
            });
    Account account = accounts.create(email, admin.password(), Set.of(Role.ADMINISTRATOR));
    log.info("Bootstrap administrator created with id {}", account.id());
  }
}

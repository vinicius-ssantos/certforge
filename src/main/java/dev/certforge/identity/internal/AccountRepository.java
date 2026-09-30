package dev.certforge.identity.internal;

import dev.certforge.identity.Role;
import java.util.EnumSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
class AccountRepository {

  private static final String SELECT_ACCOUNT =
      "select id, email, password_hash, enabled from certforge.identity_account";

  private final JdbcClient jdbc;

  AccountRepository(JdbcClient jdbc) {
    this.jdbc = jdbc;
  }

  /** Inserts the account with the given roles; fails if the email is already registered. */
  void insert(UUID id, String email, String passwordHash, Set<Role> roles) {
    try {
      jdbc.sql(
              "insert into certforge.identity_account (id, email, password_hash)"
                  + " values (:id, :email, :hash)")
          .param("id", id)
          .param("email", email)
          .param("hash", passwordHash)
          .update();
    } catch (DuplicateKeyException e) {
      throw new EmailAlreadyRegistered();
    }
    replaceRoles(id, roles);
  }

  Optional<Account> findByEmail(String email) {
    return jdbc.sql(SELECT_ACCOUNT + " where lower(email) = lower(:email)")
        .param("email", email)
        .query(AccountRepository::mapAccount)
        .optional()
        .map(this::withRoles);
  }

  Optional<Account> findById(UUID id) {
    return jdbc.sql(SELECT_ACCOUNT + " where id = :id")
        .param("id", id)
        .query(AccountRepository::mapAccount)
        .optional()
        .map(this::withRoles);
  }

  void replaceRoles(UUID id, Set<Role> roles) {
    jdbc.sql("delete from certforge.identity_account_role where account_id = :id")
        .param("id", id)
        .update();
    for (Role role : roles) {
      jdbc.sql(
              "insert into certforge.identity_account_role (account_id, role)"
                  + " values (:id, :role)")
          .param("id", id)
          .param("role", role.name())
          .update();
    }
  }

  boolean setEnabled(UUID id, boolean enabled) {
    return jdbc.sql("update certforge.identity_account set enabled = :enabled where id = :id")
            .param("enabled", enabled)
            .param("id", id)
            .update()
        > 0;
  }

  boolean existsWithRole(Role role) {
    Integer count =
        jdbc.sql("select count(*) from certforge.identity_account_role where role = :role")
            .param("role", role.name())
            .query(Integer.class)
            .single();
    return count > 0;
  }

  private static Account mapAccount(java.sql.ResultSet rs, int rowNum)
      throws java.sql.SQLException {
    return new Account(
        rs.getObject("id", UUID.class),
        rs.getString("email"),
        rs.getString("password_hash"),
        rs.getBoolean("enabled"),
        Set.of());
  }

  private Account withRoles(Account account) {
    Set<Role> roles = EnumSet.noneOf(Role.class);
    jdbc.sql("select role from certforge.identity_account_role where account_id = :id")
        .param("id", account.id())
        .query(String.class)
        .list()
        .forEach(name -> roles.add(Role.valueOf(name)));
    return new Account(
        account.id(), account.email(), account.passwordHash(), account.enabled(), roles);
  }
}

package dev.certforge.identity.internal;

import dev.certforge.identity.Permission;
import dev.certforge.identity.Role;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.Set;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Loads an account by email. The resulting principal name is the account id, so sessions are
 * indexed by a stable identifier and never by the email address.
 */
@Service
class AccountUserDetailsService implements UserDetailsService {

  private final AccountRepository accounts;

  AccountUserDetailsService(AccountRepository accounts) {
    this.accounts = accounts;
  }

  @Override
  public UserDetails loadUserByUsername(String email) {
    Account account =
        accounts
            .findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Unknown account"));
    return User.withUsername(account.id().toString())
        .password(account.passwordHash())
        .authorities(authorities(account.roles()))
        .disabled(!account.enabled())
        .build();
  }

  static Collection<GrantedAuthority> authorities(Set<Role> roles) {
    Set<GrantedAuthority> result = new LinkedHashSet<>();
    for (Role role : roles) {
      result.add(new SimpleGrantedAuthority("ROLE_" + role.name()));
      for (Permission permission : role.permissions()) {
        result.add(new SimpleGrantedAuthority(permission.name()));
      }
    }
    return result;
  }
}

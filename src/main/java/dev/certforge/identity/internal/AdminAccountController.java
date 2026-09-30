package dev.certforge.identity.internal;

import dev.certforge.identity.CurrentActor;
import dev.certforge.identity.Role;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.util.Set;
import java.util.UUID;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Administrative account operations. Every operation requires the ACCOUNT_MANAGE permission. */
@RestController
@RequestMapping("/api/admin/accounts")
@PreAuthorize("hasAuthority('ACCOUNT_MANAGE')")
class AdminAccountController {

  private final AccountService accounts;
  private final CurrentActor currentActor;

  AdminAccountController(AccountService accounts, CurrentActor currentActor) {
    this.accounts = accounts;
    this.currentActor = currentActor;
  }

  @PutMapping("/{id}/roles")
  AccountView assignRoles(@PathVariable UUID id, @Valid @RequestBody RolesRequest request) {
    return AccountView.of(accounts.assignRoles(currentActor.require(), id, request.roles()));
  }

  @PostMapping("/{id}/disable")
  AccountView disable(@PathVariable UUID id) {
    return AccountView.of(accounts.setEnabled(currentActor.require(), id, false));
  }

  @PostMapping("/{id}/enable")
  AccountView enable(@PathVariable UUID id) {
    return AccountView.of(accounts.setEnabled(currentActor.require(), id, true));
  }

  record RolesRequest(@NotNull Set<Role> roles) {}
}

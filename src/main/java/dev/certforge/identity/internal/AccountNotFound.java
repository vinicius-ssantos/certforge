package dev.certforge.identity.internal;

import dev.certforge.platform.ProblemException;
import org.springframework.http.HttpStatus;

class AccountNotFound extends ProblemException {

  private static final long serialVersionUID = 1L;

  AccountNotFound() {
    super(HttpStatus.NOT_FOUND, "account_not_found", "Account not found");
  }
}

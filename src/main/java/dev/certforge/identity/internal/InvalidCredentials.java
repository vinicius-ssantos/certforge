package dev.certforge.identity.internal;

import dev.certforge.platform.ProblemException;
import org.springframework.http.HttpStatus;

/** Generic login failure; never distinguishes unknown account, wrong password or disabled. */
class InvalidCredentials extends ProblemException {

  private static final long serialVersionUID = 1L;

  InvalidCredentials() {
    super(HttpStatus.UNAUTHORIZED, "invalid_credentials", "Invalid email or password");
  }
}

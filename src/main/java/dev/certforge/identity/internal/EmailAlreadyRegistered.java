package dev.certforge.identity.internal;

import dev.certforge.platform.ProblemException;
import org.springframework.http.HttpStatus;

class EmailAlreadyRegistered extends ProblemException {

  private static final long serialVersionUID = 1L;

  EmailAlreadyRegistered() {
    super(HttpStatus.CONFLICT, "email_already_registered", "Email already registered");
  }
}

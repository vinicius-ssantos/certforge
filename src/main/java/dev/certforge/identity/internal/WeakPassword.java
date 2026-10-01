package dev.certforge.identity.internal;

import dev.certforge.platform.ProblemException;
import org.springframework.http.HttpStatus;

/** The password violates the policy. The code names the rule; the password is never echoed. */
class WeakPassword extends ProblemException {

  private static final long serialVersionUID = 1L;

  WeakPassword(String violationCode) {
    super(HttpStatus.BAD_REQUEST, violationCode, "Password does not meet the policy");
  }
}

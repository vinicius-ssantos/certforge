package dev.certforge.identity.internal;

import dev.certforge.platform.ProblemException;
import org.springframework.http.HttpStatus;

/** An administrator attempted to remove or disable their own administrative access. */
class OwnAdminAccess extends ProblemException {

  private static final long serialVersionUID = 1L;

  OwnAdminAccess() {
    super(
        HttpStatus.CONFLICT,
        "own_admin_access",
        "Administrators cannot remove or disable their own access");
  }
}

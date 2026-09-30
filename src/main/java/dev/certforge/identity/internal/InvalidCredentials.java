package dev.certforge.identity.internal;

/** Generic login failure; never distinguishes unknown account, wrong password or disabled. */
class InvalidCredentials extends RuntimeException {

  private static final long serialVersionUID = 1L;

  InvalidCredentials() {
    super("Invalid credentials");
  }
}

package dev.certforge.identity.internal;

class EmailAlreadyRegistered extends RuntimeException {

  private static final long serialVersionUID = 1L;

  EmailAlreadyRegistered() {
    super("Email already registered");
  }
}

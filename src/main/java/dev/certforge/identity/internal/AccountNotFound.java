package dev.certforge.identity.internal;

class AccountNotFound extends RuntimeException {

  private static final long serialVersionUID = 1L;

  AccountNotFound() {
    super("Account not found");
  }
}

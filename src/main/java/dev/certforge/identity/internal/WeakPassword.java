package dev.certforge.identity.internal;

class WeakPassword extends RuntimeException {

  private static final long serialVersionUID = 1L;

  private final String violationCode;

  WeakPassword(String violationCode) {
    super(violationCode);
    this.violationCode = violationCode;
  }

  String code() {
    return violationCode;
  }
}

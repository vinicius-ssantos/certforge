package dev.certforge.identity.internal;

/** An administrator attempted to remove or disable their own administrative access. */
class OwnAdminAccess extends RuntimeException {

  private static final long serialVersionUID = 1L;

  OwnAdminAccess() {
    super("Cannot remove own administrative access");
  }
}

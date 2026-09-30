package dev.certforge.identity.internal;

import java.nio.charset.StandardCharsets;
import java.util.Optional;
import org.springframework.stereotype.Component;

/**
 * Length-based password policy. There are deliberately no character-composition rules. The upper
 * bound exists because bcrypt ignores input beyond 72 bytes.
 */
@Component
class PasswordPolicy {

  static final int MIN_LENGTH = 12;
  static final int MAX_BYTES = 72;

  /** Returns a stable violation code, or empty when the password is acceptable. */
  Optional<String> violation(String password, String email) {
    if (password == null || password.codePointCount(0, password.length()) < MIN_LENGTH) {
      return Optional.of("password_too_short");
    }
    if (password.getBytes(StandardCharsets.UTF_8).length > MAX_BYTES) {
      return Optional.of("password_too_long");
    }
    if (email != null && password.equalsIgnoreCase(email)) {
      return Optional.of("password_equals_email");
    }
    return Optional.empty();
  }
}

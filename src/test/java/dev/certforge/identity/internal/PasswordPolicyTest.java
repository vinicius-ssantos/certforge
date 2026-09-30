package dev.certforge.identity.internal;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class PasswordPolicyTest {

  private final PasswordPolicy policy = new PasswordPolicy();

  @Test
  void acceptsLongEnoughPasswordWithoutCompositionRules() {
    assertThat(policy.violation("correct horse battery", "a@b.com")).isEmpty();
  }

  @Test
  void rejectsShortPassword() {
    assertThat(policy.violation("short", "a@b.com")).contains("password_too_short");
    assertThat(policy.violation(null, "a@b.com")).contains("password_too_short");
  }

  @Test
  void rejectsPasswordsAboveBcryptInputLimit() {
    assertThat(policy.violation("x".repeat(73), "a@b.com")).contains("password_too_long");
    assertThat(policy.violation("x".repeat(72), "a@b.com")).isEmpty();
  }

  @Test
  void countsBytesNotCharactersForUpperBound() {
    // 37 two-byte characters = 74 bytes
    assertThat(policy.violation("é".repeat(37), "a@b.com")).contains("password_too_long");
  }

  @Test
  void rejectsPasswordEqualToEmail() {
    assertThat(policy.violation("Someone@Example.com", "someone@example.com"))
        .contains("password_equals_email");
  }
}

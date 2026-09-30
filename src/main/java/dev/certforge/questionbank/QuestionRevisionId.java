package dev.certforge.questionbank;

import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Objects;
import java.util.UUID;

/** Identity of one immutable revision. Attempts reference this, never the logical question. */
public record QuestionRevisionId(@JsonValue UUID value) {

  public QuestionRevisionId {
    Objects.requireNonNull(value, "value");
  }
}

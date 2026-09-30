package dev.certforge.questionbank;

import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Objects;
import java.util.UUID;

/** Stable identity of a logical question, shared by all of its revisions. */
public record QuestionId(@JsonValue UUID value) {

  public QuestionId {
    Objects.requireNonNull(value, "value");
  }
}

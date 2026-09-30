package dev.certforge.preparationcatalog;

import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Objects;
import java.util.UUID;

/** Stable identity of a certification exam version. */
public record ExamVersionId(@JsonValue UUID value) {

  public ExamVersionId {
    Objects.requireNonNull(value, "value");
  }
}

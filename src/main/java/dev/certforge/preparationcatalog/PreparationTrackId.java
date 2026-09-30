package dev.certforge.preparationcatalog;

import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Objects;
import java.util.UUID;

/** Stable identity of a preparation track. */
public record PreparationTrackId(@JsonValue UUID value) {

  public PreparationTrackId {
    Objects.requireNonNull(value, "value");
  }
}

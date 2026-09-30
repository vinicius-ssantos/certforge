package dev.certforge.preparationcatalog;

import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Objects;
import java.util.UUID;

/**
 * Stable identity of a topic. It never changes when the topic's display name is corrected, so
 * progress evidence stays interpretable.
 */
public record TopicId(@JsonValue UUID value) {

  public TopicId {
    Objects.requireNonNull(value, "value");
  }
}

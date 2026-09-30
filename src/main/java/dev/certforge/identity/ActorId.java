package dev.certforge.identity;

import java.util.Objects;
import java.util.UUID;

/** Stable reference to the actor (user) behind an operation, safe to share across modules. */
public record ActorId(UUID value) {

  public ActorId {
    Objects.requireNonNull(value, "value");
  }
}

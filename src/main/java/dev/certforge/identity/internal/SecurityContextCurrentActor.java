package dev.certforge.identity.internal;

import dev.certforge.identity.ActorId;
import dev.certforge.identity.CurrentActor;
import java.util.Optional;
import java.util.UUID;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
class SecurityContextCurrentActor implements CurrentActor {

  @Override
  public Optional<ActorId> find() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication == null
        || !authentication.isAuthenticated()
        || authentication instanceof AnonymousAuthenticationToken) {
      return Optional.empty();
    }
    try {
      return Optional.of(new ActorId(UUID.fromString(authentication.getName())));
    } catch (IllegalArgumentException e) {
      return Optional.empty();
    }
  }
}

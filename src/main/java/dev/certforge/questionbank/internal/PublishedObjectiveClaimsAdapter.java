package dev.certforge.questionbank.internal;

import dev.certforge.preparationcatalog.PublishedObjectiveClaims;
import dev.certforge.preparationcatalog.TrackVersionId;
import java.util.Set;
import org.springframework.stereotype.Component;

/**
 * Answers the catalog's one question about content: which objectives of an exam version are claimed
 * by questions already published.
 *
 * <p>The interface belongs to the catalog and this implements it, so the dependency still runs from
 * content to catalog and not back.
 */
@Component
class PublishedObjectiveClaimsAdapter implements PublishedObjectiveClaims {

  private final QuestionRepository repository;

  PublishedObjectiveClaimsAdapter(QuestionRepository repository) {
    this.repository = repository;
  }

  @Override
  public Set<String> claimedIn(TrackVersionId trackVersionId) {
    return Set.copyOf(repository.publishedObjectiveKeys(trackVersionId.value()));
  }
}

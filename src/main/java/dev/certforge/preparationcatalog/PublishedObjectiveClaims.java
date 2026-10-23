package dev.certforge.preparationcatalog;

import java.util.Set;

/**
 * Which of an exam version's objectives are claimed by questions a learner can already see.
 *
 * <p>Declared here and implemented by the question bank, rather than the catalog calling the
 * question bank directly: content depends on the catalog, and the dependency cannot run both ways.
 * The catalog needs the answer for one decision only — a new reading of a provider's objectives
 * page may not drop an objective a published question still claims, because that would leave the
 * question citing something the page no longer lists and nothing would say so.
 *
 * <p>Published, not approved or drafted: a draft claiming an objective that later vanishes is a
 * draft to correct, and publishing it would be refused anyway.
 */
public interface PublishedObjectiveClaims {

  /** The objective keys claimed by published questions of that exam version. */
  Set<String> claimedIn(TrackVersionId trackVersionId);
}

package dev.certforge.preparationcatalog.internal;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/** What the editorial desk reads from the catalog. */
interface EditorialViews {

  /**
   * A track a question may be written for, with the topics available on it.
   *
   * <p>{@code kind} and {@code status} are included because an author needs to know which taxonomy
   * they are writing for: the same subject appears on a certification track and an interview track
   * as two separate topics on purpose (ADR 0014), and a name alone does not say which is which.
   */
  record AuthorableTrack(
      UUID id,
      String slug,
      String name,
      String kind,
      String status,
      List<AuthorableTopic> topics) {}

  /**
   * A topic, with its depth so a flat list can be indented without the client rebuilding the tree.
   *
   * <p>{@code objectiveRef} is the exam objective the topic answers, and is null on an interview
   * track, which cites none. An author reads it to know what the question has to be about.
   */
  record AuthorableTopic(
      UUID id, String slug, String name, int depth, @Schema(nullable = true) String objectiveRef) {}

  /**
   * Where an exam version's objectives were read, and whether that reading can still be trusted
   * (#177: "fonte e data são visíveis ao revisor por questão/objetivo").
   *
   * <p>Exists because a reviewer judging a question's objective claim had no way to see this at
   * all: {@link CatalogAdminController} carries the same data, but requires {@code CATALOG_MANAGE},
   * which a reviewer has no reason to hold (the same reasoning {@link EditorialCatalogController}
   * already gives for topics). A revision's own {@code references} are the author's evidence that
   * an *answer* is correct; this is the separate, often-missing evidence that the *objective* it
   * claims is a real line on the provider's page, which ADR 0005 and the certification source
   * governance policy (#177, {@code docs/product/content-policy.md}) both treat as a different
   * claim that needs its own source.
   *
   * <p>{@code status} is one of {@code UNVERIFIED} (nobody has read the provider's page yet),
   * {@code VERIFIED}, {@code STALE} (the provider has published something newer) or {@code
   * NOT_A_CERTIFICATION} (an interview taxonomy version, which cites no exam). {@code sourceUrl}
   * and {@code verifiedOn} are null exactly when nobody has read a page yet to record them.
   */
  record ObjectiveSourceView(
      String status,
      @Schema(nullable = true) String sourceUrl,
      @Schema(nullable = true) LocalDate verifiedOn,
      List<ObjectiveSourceEntry> objectives) {}

  /** One objective: the exam's own key for it, its title, and where on the page it was read. */
  record ObjectiveSourceEntry(
      String key, String title, @Schema(nullable = true) String sourceRef) {}
}

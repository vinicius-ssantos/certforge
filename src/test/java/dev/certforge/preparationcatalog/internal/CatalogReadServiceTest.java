package dev.certforge.preparationcatalog.internal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import dev.certforge.preparationcatalog.ObjectiveGapView;
import dev.certforge.preparationcatalog.PublishedObjectiveClaims;
import dev.certforge.preparationcatalog.TrackVersionId;
import dev.certforge.preparationcatalog.internal.CatalogRows.ObjectiveRow;
import dev.certforge.preparationcatalog.internal.CatalogRows.ObjectiveSnapshotRow;
import dev.certforge.preparationcatalog.internal.CatalogRows.TrackVersionRow;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import org.junit.jupiter.api.Test;

/**
 * {@link CatalogReadService#objectiveReadiness(TrackVersionRow)} in isolation (#176): the
 * HTTP-level {@code PreparationCatalogIT} already covers the no-snapshot-yet case end to end, so
 * this covers the coverage/gap arithmetic directly against a mocked repository and claims port.
 */
class CatalogReadServiceTest {

  private static final TrackVersionRow VERSION =
      new TrackVersionRow(
          UUID.randomUUID(),
          UUID.randomUUID(),
          "V1",
          CatalogStatus.ACTIVE,
          "T-1",
          "Tester Exam",
          null,
          "https://example.com/objectives",
          "MULTIPLE_CHOICE");

  @Test
  void isEmptyWhenNobodyHasReadTheProvidersPageYet() {
    CatalogRepository repository = mock(CatalogRepository.class);
    when(repository.findObjectiveSnapshot(VERSION.id())).thenReturn(Optional.empty());
    CatalogReadService service =
        new CatalogReadService(repository, mock(PublishedObjectiveClaims.class));

    assertThat(service.objectiveReadiness(VERSION)).isEmpty();
  }

  @Test
  void reportsThePartOfTheVerifiedSnapshotNotClaimedByAPublishedQuestion() {
    CatalogRepository repository = mock(CatalogRepository.class);
    PublishedObjectiveClaims claims = mock(PublishedObjectiveClaims.class);
    when(repository.findObjectiveSnapshot(VERSION.id()))
        .thenReturn(
            Optional.of(
                new ObjectiveSnapshotRow(
                    VERSION.id(),
                    "2026-01",
                    LocalDate.of(2026, 10, 22),
                    "https://example.com/objectives",
                    "sha256:" + "a".repeat(64),
                    "VERIFIED")));
    when(repository.findObjectives(VERSION.id()))
        .thenReturn(
            List.of(
                new ObjectiveRow(VERSION.id(), "1.1", "Claimed objective", "Design"),
                new ObjectiveRow(VERSION.id(), "2.1", "Unclaimed objective", null)));
    when(claims.claimedIn(new TrackVersionId(VERSION.id()))).thenReturn(Set.of("1.1"));
    CatalogReadService service = new CatalogReadService(repository, claims);

    var readiness = service.objectiveReadiness(VERSION).orElseThrow();

    assertThat(readiness.providerVersion()).isEqualTo("2026-01");
    assertThat(readiness.verifiedOn()).isEqualTo(LocalDate.of(2026, 10, 22));
    assertThat(readiness.status()).isEqualTo("VERIFIED");
    assertThat(readiness.totalObjectives()).isEqualTo(2);
    assertThat(readiness.claimedObjectives()).isEqualTo(1);
    assertThat(readiness.gaps())
        .containsExactly(new ObjectiveGapView("2.1", "Unclaimed objective"));
  }

  @Test
  void hasNoGapsWhenEveryVerifiedObjectiveIsClaimed() {
    CatalogRepository repository = mock(CatalogRepository.class);
    PublishedObjectiveClaims claims = mock(PublishedObjectiveClaims.class);
    when(repository.findObjectiveSnapshot(VERSION.id()))
        .thenReturn(
            Optional.of(
                new ObjectiveSnapshotRow(
                    VERSION.id(),
                    "2026-01",
                    LocalDate.of(2026, 10, 22),
                    "https://example.com/objectives",
                    "sha256:" + "a".repeat(64),
                    "STALE")));
    when(repository.findObjectives(VERSION.id()))
        .thenReturn(List.of(new ObjectiveRow(VERSION.id(), "1.1", "Claimed objective", null)));
    when(claims.claimedIn(new TrackVersionId(VERSION.id()))).thenReturn(Set.of("1.1"));
    CatalogReadService service = new CatalogReadService(repository, claims);

    var readiness = service.objectiveReadiness(VERSION).orElseThrow();

    assertThat(readiness.status()).isEqualTo("STALE");
    assertThat(readiness.claimedObjectives()).isEqualTo(1);
    assertThat(readiness.gaps()).isEmpty();
  }
}

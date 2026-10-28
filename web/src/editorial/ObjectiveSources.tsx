import { useQuery } from "@tanstack/react-query";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import type { ObjectiveSource } from "../api/types";
import { English } from "../i18n/English";
import type { Catalog } from "../i18n/en";
import { useLocale, useText } from "../i18n/useText";
import { formatDate } from "../history/format";
import { ErrorState, Loading } from "../ui/States";

/** How each status reads, by the word the server sends. An unknown one is shown as its code. */
function statusText(status: string, t: Catalog["editorial"]["objectiveSources"]) {
  const known: Record<string, string> = {
    VERIFIED: t.statusVerified,
    UNVERIFIED: t.statusUnverified,
    STALE: t.statusStale,
    RETIRED: t.statusRetired,
  };
  return known[status] ?? status;
}

/**
 * Where the exam's objectives were read, and whether that reading is current, beside the
 * question's own claimed objective keys (#177).
 *
 * This is deliberately separate from the question's own {@code references}: a reference is the
 * author's evidence that an *answer* is correct, and this is the separate, often-missing evidence
 * that the *objective* it claims is a real line on the provider's page. A reviewer who sees only
 * the first kind of source has no way to judge the second claim at all.
 *
 * Renders nothing when the revision claims no objective -- most questions don't, and there is
 * nothing to source for a claim that was never made.
 */
export function ObjectiveSources({
  topicId,
  objectiveKeys,
}: {
  topicId: string | null | undefined;
  objectiveKeys: string[] | null | undefined;
}) {
  const t = useText().editorial.objectiveSources;
  const { locale } = useLocale();
  const api = useApi();
  // Guarded rather than trusted: the field is required by the contract, but a fixture or an
  // older cached response that predates it should read as "nothing claimed", not crash the panel
  // a reviewer is looking at for an unrelated reason.
  const claimed = objectiveKeys ?? [];

  const sources = useQuery({
    queryKey: ["objective-sources", topicId],
    enabled: Boolean(topicId) && claimed.length > 0,
    queryFn: () =>
      unwrap(
        api.GET("/api/editorial/catalog/topics/{topicId}/objective-sources", {
          params: { path: { topicId: topicId! } },
        }),
      ),
  });

  // Nothing claimed, or no topic to ask about -- a revision mid-move between topics, say.
  // Either way there is nothing to source.
  if (!topicId || claimed.length === 0) {
    return null;
  }
  if (sources.isPending) {
    return (
      <section aria-labelledby="objective-sources-heading">
        <h3 id="objective-sources-heading">{t.heading}</h3>
        <Loading label={t.loading} />
      </section>
    );
  }
  if (sources.isError) {
    return (
      <section aria-labelledby="objective-sources-heading">
        <h3 id="objective-sources-heading">{t.heading}</h3>
        <ErrorState error={sources.error} onRetry={() => void sources.refetch()} />
      </section>
    );
  }

  const data: ObjectiveSource = sources.data;
  const byKey = new Map(data.objectives.map((objective) => [objective.key, objective]));

  return (
    <section aria-labelledby="objective-sources-heading">
      <h3 id="objective-sources-heading">{t.heading}</h3>
      {data.status === "NOT_A_CERTIFICATION" ? (
        <p className="muted">{t.notACertification}</p>
      ) : (
        <>
          <p>
            {statusText(data.status, t)}
            {data.sourceUrl ? (
              <>
                {" · "}
                <a href={data.sourceUrl} target="_blank" rel="noopener noreferrer">
                  {t.sourcePage}
                </a>
              </>
            ) : null}
            {data.verifiedOn ? ` · ${t.verifiedOn(formatDate(data.verifiedOn, locale))}` : null}
          </p>
          <ul>
            {claimed.map((key) => {
              const objective = byKey.get(key);
              return (
                <li key={key}>
                  <strong>{key}</strong>
                  {objective ? (
                    <>
                      {" — "}
                      <English>{objective.title}</English>
                      {objective.sourceRef ? (
                        <span className="muted"> ({objective.sourceRef})</span>
                      ) : null}
                    </>
                  ) : (
                    // The claim predates the current reading, or was made before any reading at
                    // all: said plainly rather than silently dropped, because a claim the current
                    // page does not list is exactly what a reviewer needs to see.
                    <span className="muted"> — {t.keyNotOnCurrentPage}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </section>
  );
}

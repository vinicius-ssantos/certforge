import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import type { LabSummary } from "../api/types";
import { useText } from "../i18n/useText";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";

function LabCard({ lab }: { lab: LabSummary }) {
  const t = useText();
  const api = useApi();
  const navigate = useNavigate();
  const start = useMutation({
    mutationFn: () => unwrap(api.POST("/api/labs/{labId}/sessions", { params: { path: { labId: lab.labId } } })),
    onSuccess: (session) => {
      navigate(`/labs/sessions/${session.sessionId}`, { state: { lab, session } });
    },
  });

  return (
    <li className="card">
      <h2>{lab.title}</h2>
      <p>{lab.description}</p>
      <p className="hint">{t.labs.minutes(Math.round(lab.timeoutSeconds / 60))}</p>
      {start.isError ? <ErrorState error={start.error} onRetry={() => start.mutate()} /> : null}
      <button type="button" onClick={() => start.mutate()} disabled={start.isPending}>
        {start.isPending ? t.labs.starting : t.labs.start}
      </button>
    </li>
  );
}

export function LabsPage() {
  const t = useText();
  useDocumentTitle(t.labs.title);
  const api = useApi();
  const labs = useQuery({
    queryKey: ["labs"],
    queryFn: () => unwrap(api.GET("/api/labs")),
  });

  return (
    <>
      <h1>{t.labs.title}</h1>
      <p>{t.labs.intro}</p>
      {labs.isLoading ? <Loading /> : null}
      {labs.isError ? <ErrorState error={labs.error} onRetry={() => labs.refetch()} /> : null}
      {labs.data && labs.data.length === 0 ? (
        <EmptyState title={t.labs.emptyTitle}>
          <p>{t.labs.emptyBody}</p>
        </EmptyState>
      ) : null}
      {labs.data && labs.data.length > 0 ? (
        <ul className="cards">
          {labs.data.map((lab) => (
            <LabCard key={lab.labId} lab={lab} />
          ))}
        </ul>
      ) : null}
    </>
  );
}

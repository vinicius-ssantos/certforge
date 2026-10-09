import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useParams, useSearchParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import { useAccount } from "../auth/AuthContext";
import { useHasAny } from "../auth/permissions";
import { useTopicNames } from "../history/useTopicNames";
import type { Catalog } from "../i18n/en";
import { useText } from "../i18n/useText";
import { ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { useFocusOnMount } from "../ui/useFocusOnMount";
import type { EditorialQuestion, Revision } from "../api/types";
import { RevisionEditor } from "./RevisionEditor";
import { ReviewPanel, useCanDecide } from "./ReviewPanel";
import { RevisionView } from "./RevisionView";
import { StatusMark, StatusRail } from "./StatusParts";

/** What each outcome says, by the key the deciding page navigates with. */
function noticeFor(kind: string, t: Catalog): string | undefined {
  const notices: Record<string, string> = t.editorial.questionPage.notices;
  return notices[kind];
}

function RevisionWithDecisions({
  question,
  revision,
  isLatest,
  topicName,
  previous,
  topicNameOf,
}: {
  question: EditorialQuestion;
  revision: Revision;
  isLatest: boolean;
  topicName: string | undefined;
  previous: Revision | undefined;
  topicNameOf: (id: string) => string | undefined;
}) {
  const can = useCanDecide(revision, isLatest);
  const any = can.review || can.publish || can.retire || can.startRevision;
  return (
    <RevisionView
      revision={revision}
      topicName={topicName}
      previous={previous}
      topicNameOf={topicNameOf}
      {...(any ? { aside: <ReviewPanel question={question} revision={revision} isLatest={isLatest} topicName={topicName} /> } : {})}
    />
  );
}

function Notice({ kind }: { kind: string }) {
  const t = useText();
  const ref = useFocusOnMount<HTMLParagraphElement>();
  return (
    <p ref={ref} role="status" tabIndex={-1} className="notice">
      {noticeFor(kind, t)}
    </p>
  );
}

/**
 * One question at one revision. The author of a draft gets the editor; everyone else gets the
 * revision as a reviewer reads it. Revisions are numbered; the latest is shown unless one is asked
 * for.
 */
export function QuestionPage() {
  const t = useText();
  const page = t.editorial.questionPage;
  const { questionId = "" } = useParams();
  const [params] = useSearchParams();
  const notice = (useLocation().state as { notice?: string } | null)?.notice;
  const api = useApi();
  const account = useAccount();
  const canAuthor = useHasAny("CONTENT_AUTHOR");
  const topicNames = useTopicNames();

  const question = useQuery({
    queryKey: ["editorial", "question", questionId],
    // Someone else may have approved or published it since this was last read, and acting on an
    // out-of-date status would mislead, so the page always checks again when it opens.
    staleTime: 0,
    queryFn: () =>
      unwrap(api.GET("/api/admin/questions/{questionId}", { params: { path: { questionId } } })),
  });

  const revisions = [...(question.data?.revisions ?? [])].sort((a, b) => a.number - b.number);
  const wanted = Number(params.get("revision"));
  const revision =
    revisions.find((candidate) => candidate.number === wanted) ?? revisions[revisions.length - 1];
  const title = revision ? page.revisionTitle(revision.number) : page.fallbackTitle;
  useDocumentTitle(title);

  // The heading is always the first element and never replaced as data arrives, so focus placed on
  // it by the route change stays put.
  return (
    <>
      <p className="back">
        <Link to="/editorial">{t.editorial.backToQuestions}</Link>
      </p>
      <h1>{title}</h1>
      {question.isPending ? <Loading label={page.loading} /> : null}
      {question.isError ? (
        <ErrorState error={question.error} onRetry={() => void question.refetch()} />
      ) : null}
      {question.data && revision ? (
        <>
          {notice && noticeFor(notice, t) ? <Notice key={notice} kind={notice} /> : null}
          <div className="revision-head">
            <StatusRail status={revision.status} />
            <p className="muted">
              {page.currentStatus}
              <StatusMark status={revision.status} />
            </p>
          </div>
          {revisions.length > 1 ? (
            <nav className="tabs" aria-label={page.revisionsLabel}>
              {revisions.map((candidate) => (
                <Link
                  key={candidate.id}
                  to={`/editorial/questions/${question.data.id}?revision=${candidate.number}`}
                  aria-current={candidate.id === revision.id ? "page" : undefined}
                >
                  {page.revisionTab(candidate.number)}
                </Link>
              ))}
            </nav>
          ) : null}
          {revision.status === "DRAFT" && canAuthor && revision.authorId === account.id ? (
            <RevisionEditor key={revision.id} revision={revision} />
          ) : (
            <RevisionWithDecisions
              question={question.data}
              revision={revision}
              isLatest={revision.id === revisions[revisions.length - 1]?.id}
              topicName={revision.topicId ? topicNames.get(revision.topicId) : undefined}
              previous={revisions[revisions.findIndex((candidate) => candidate.id === revision.id) - 1]}
              topicNameOf={(id) => topicNames.get(id)}
            />
          )}
        </>
      ) : null}
    </>
  );
}

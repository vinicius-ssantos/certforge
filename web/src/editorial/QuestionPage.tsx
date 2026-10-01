import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useParams, useSearchParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import { useAccount } from "../auth/AuthContext";
import { useHasAny } from "../auth/permissions";
import { useTopicNames } from "../history/useTopicNames";
import { ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { useFocusOnMount } from "../ui/useFocusOnMount";
import type { EditorialQuestion, Revision } from "../api/types";
import { RevisionEditor } from "./RevisionEditor";
import { ReviewPanel, useCanDecide } from "./ReviewPanel";
import { RevisionView } from "./RevisionView";
import { StatusMark, StatusRail } from "./StatusParts";

const NOTICE: Record<string, string> = {
  sent: "Sent for review. A reviewer other than you will pick it up from the queue.",
  saved: "Draft saved.",
  approved: "Approved. An administrator can now publish it.",
  changes: "Sent back to the author with your comment. It is a draft again.",
  published: "Published. Learners can now get this question in their sessions.",
  retired: "Retired. It stays in history and no new session will use it.",
  started: "New revision started as a draft, copied from the previous one.",
};

function RevisionWithDecisions({
  question,
  revision,
  isLatest,
  topicName,
}: {
  question: EditorialQuestion;
  revision: Revision;
  isLatest: boolean;
  topicName: string | undefined;
}) {
  const can = useCanDecide(revision, isLatest);
  const any = can.review || can.publish || can.retire || can.startRevision;
  return (
    <RevisionView
      revision={revision}
      topicName={topicName}
      {...(any ? { aside: <ReviewPanel question={question} revision={revision} isLatest={isLatest} /> } : {})}
    />
  );
}

function Notice({ kind }: { kind: string }) {
  const ref = useFocusOnMount<HTMLParagraphElement>();
  return (
    <p ref={ref} role="status" tabIndex={-1} className="notice">
      {NOTICE[kind]}
    </p>
  );
}

/**
 * One question at one revision. The author of a draft gets the editor; everyone else gets the
 * revision as a reviewer reads it. Revisions are numbered; the latest is shown unless one is asked
 * for.
 */
export function QuestionPage() {
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
  useDocumentTitle(revision ? `Revision ${revision.number}` : "Question");

  // The heading is always the first element and never replaced as data arrives, so focus placed on
  // it by the route change stays put.
  return (
    <>
      <p>
        <Link to="/editorial">Back to questions</Link>
      </p>
      <h1>{revision ? `Revision ${revision.number}` : "Question"}</h1>
      {question.isPending ? <Loading label="Loading question" /> : null}
      {question.isError ? (
        <ErrorState error={question.error} onRetry={() => void question.refetch()} />
      ) : null}
      {question.data && revision ? (
        <>
          {notice && NOTICE[notice] ? <Notice key={notice} kind={notice} /> : null}
          <div className="revision-head">
            <StatusRail status={revision.status} />
            <p className="muted">
              Current status: <StatusMark status={revision.status} />
            </p>
          </div>
          {revisions.length > 1 ? (
            <nav className="tabs" aria-label="Revisions">
              {revisions.map((candidate) => (
                <Link
                  key={candidate.id}
                  to={`/editorial/questions/${question.data.id}?revision=${candidate.number}`}
                  aria-current={candidate.id === revision.id ? "page" : undefined}
                >
                  Revision {candidate.number}
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
            />
          )}
        </>
      ) : null}
    </>
  );
}

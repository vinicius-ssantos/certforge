import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import { useHasAny } from "../auth/permissions";
import { useTopicNames } from "../history/useTopicNames";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { StatusMark } from "./StatusParts";

const FILTERS = [
  { label: "All", status: null },
  { label: "Drafts", status: "DRAFT" },
  { label: "Waiting for review", status: "TECHNICAL_REVIEW" },
  { label: "Approved", status: "APPROVED" },
  { label: "Published", status: "PUBLISHED" },
] as const;

type Status = Exclude<(typeof FILTERS)[number]["status"], null>;

export function QueuePage() {
  useDocumentTitle("Questions");
  const api = useApi();
  const canAuthor = useHasAny("CONTENT_AUTHOR");
  const topicNames = useTopicNames();
  const [params] = useSearchParams();
  const requested = params.get("status");
  const status = FILTERS.find((filter) => filter.status === requested)?.status ?? null;

  const questions = useQuery({
    queryKey: ["editorial", "questions", status],
    queryFn: () =>
      unwrap(
        api.GET("/api/admin/questions", {
          params: { query: status ? { status: status as Status } : {} },
        }),
      ),
  });

  return (
    <>
      <div className="page-head">
        <h1>Questions</h1>
        {canAuthor ? (
          <Link to="/editorial/new" className="button">
            New question
          </Link>
        ) : null}
      </div>
      <nav className="tabs" aria-label="Filter by status">
        {FILTERS.map((filter) => (
          <Link
            key={filter.label}
            to={filter.status ? `/editorial?status=${filter.status}` : "/editorial"}
            aria-current={filter.status === status ? "page" : undefined}
          >
            {filter.label}
          </Link>
        ))}
      </nav>
      {questions.isPending ? <Loading label="Loading questions" /> : null}
      {questions.isError ? (
        <ErrorState error={questions.error} onRetry={() => void questions.refetch()} />
      ) : null}
      {questions.data && questions.data.length === 0 ? (
        <EmptyState title={status ? "No questions with this status" : "No questions yet"}>
          <p>
            {canAuthor
              ? "Write the first one with New question, or import a content pack."
              : "Questions appear here once an editor writes them."}
          </p>
        </EmptyState>
      ) : null}
      {questions.data && questions.data.length > 0 ? (
        <table className="queue">
          <caption className="visually-hidden">
            {FILTERS.find((filter) => filter.status === status)?.label} questions
          </caption>
          <thead>
            <tr>
              <th scope="col">Question</th>
              <th scope="col">Topic</th>
              <th scope="col">Status</th>
              <th scope="col">Revision</th>
            </tr>
          </thead>
          <tbody>
            {questions.data.map((question) => (
              <tr key={question.id}>
                <td className="question-cell">
                  <Link to={`/editorial/questions/${question.id}`}>
                    {question.prompt?.split("\n")[0] || "Untitled draft"}
                  </Link>
                </td>
                <td>{question.topicId ? (topicNames.get(question.topicId) ?? "Topic") : "No topic yet"}</td>
                <td>
                  <StatusMark status={question.latestStatus} />
                </td>
                <td>{question.latestRevisionNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </>
  );
}

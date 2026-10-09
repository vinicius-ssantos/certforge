import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import { useHasAny } from "../auth/permissions";
import { useTopicNames } from "../history/useTopicNames";
import type { Catalog } from "../i18n/en";
import { useText } from "../i18n/useText";
import { ScrollableTable } from "../ui/ScrollableTable";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { StatusMark } from "./StatusParts";

/** The statuses the queue can be narrowed to, in the order they are offered. */
const FILTER_STATUSES = [null, "DRAFT", "TECHNICAL_REVIEW", "APPROVED", "PUBLISHED"] as const;

type Status = Exclude<(typeof FILTER_STATUSES)[number], null>;

function filters(t: Catalog): { label: string; status: (typeof FILTER_STATUSES)[number] }[] {
  return [
    { label: t.editorial.queue.filterAll, status: null },
    { label: t.editorial.queue.filterDrafts, status: "DRAFT" },
    { label: t.editorial.queue.filterWaiting, status: "TECHNICAL_REVIEW" },
    { label: t.editorial.queue.filterApproved, status: "APPROVED" },
    { label: t.editorial.queue.filterPublished, status: "PUBLISHED" },
  ];
}

export function QueuePage() {
  const t = useText();
  useDocumentTitle(t.editorial.queue.title);
  const api = useApi();
  const canAuthor = useHasAny("CONTENT_AUTHOR");
  const canManageCatalog = useHasAny("CATALOG_MANAGE");
  const topicNames = useTopicNames();
  const [params] = useSearchParams();
  const requested = params.get("status");
  const tabs = filters(t);
  const status = FILTER_STATUSES.find((candidate) => candidate === requested) ?? null;
  const tableCaption = t.editorial.queue.tableCaption(
    tabs.find((filter) => filter.status === status)?.label ?? "",
  );

  // The endpoint already returns the whole editorial queue. One unfiltered response gives
  // accurate counts for all tabs, without a separate network request for each status.
  const questions = useQuery({
    queryKey: ["editorial", "questions"],
    staleTime: 0, // statuses change under other people's hands; see QuestionPage
    queryFn: () => unwrap(api.GET("/api/admin/questions")),
  });
  const visible = questions.data?.filter((question) => status === null || question.latestStatus === status);
  const count = (candidate: Status | null) =>
    candidate === null
      ? questions.data?.length ?? 0
      : questions.data?.filter((question) => question.latestStatus === candidate).length ?? 0;

  return (
    <>
      <div className="page-head">
        <h1>{t.editorial.queue.title}</h1>
        <div className="head-actions">
          {canManageCatalog ? (
            <Link to="/editorial/catalog" className="button secondary">
              {t.editorial.catalogTitle}
            </Link>
          ) : null}
          {canAuthor ? (
            <Link to="/editorial/new" className="button">
              {t.editorial.newQuestion}
            </Link>
          ) : null}
        </div>
      </div>
      <nav className="tabs" aria-label={t.editorial.queue.filterLabel}>
        {tabs.map((filter) => (
          <Link
            key={filter.label}
            to={filter.status ? `/editorial?status=${filter.status}` : "/editorial"}
            aria-current={filter.status === status ? "page" : undefined}
          >
            {filter.label}{" "}
            {questions.data ? <span className="tab-count">{count(filter.status)}</span> : null}
          </Link>
        ))}
      </nav>
      {questions.isPending ? <Loading label={t.editorial.queue.loading} /> : null}
      {questions.isError ? (
        <ErrorState error={questions.error} onRetry={() => void questions.refetch()} />
      ) : null}
      {visible && visible.length === 0 ? (
        <EmptyState
          title={status ? t.editorial.queue.emptyWithStatus : t.editorial.queue.emptyTitle}
        >
          <p>
            {canAuthor ? t.editorial.queue.emptyBodyAuthor : t.editorial.queue.emptyBodyReader}
          </p>
        </EmptyState>
      ) : null}
      {visible && visible.length > 0 ? (
        <ScrollableTable className="queue" label={tableCaption}>
          <caption className="visually-hidden">{tableCaption}</caption>
          <thead>
            <tr>
              <th scope="col">{t.editorial.queue.question}</th>
              <th scope="col">{t.editorial.queue.topic}</th>
              <th scope="col">{t.editorial.queue.status}</th>
              <th scope="col">{t.editorial.queue.revision}</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((question) => (
              <tr key={question.id}>
                <td className="question-cell">
                  <Link to={`/editorial/questions/${question.id}`}>
                    {question.prompt?.split("\n")[0] || t.editorial.queue.untitled}
                  </Link>
                </td>
                <td>
                  {question.topicId
                    ? (topicNames.get(question.topicId) ?? t.editorial.queue.fallbackTopic)
                    : t.editorial.queue.noTopicYet}
                </td>
                <td>
                  <StatusMark status={question.latestStatus} />
                </td>
                <td>{question.latestRevisionNumber}</td>
              </tr>
            ))}
          </tbody>
        </ScrollableTable>
      ) : null}
    </>
  );
}

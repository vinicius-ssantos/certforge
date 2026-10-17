import { keepPreviousData, useQuery } from "@tanstack/react-query";
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
  const canReview = useHasAny("CONTENT_REVIEW");
  const topicNames = useTopicNames();
  const [params, setParams] = useSearchParams();
  const requested = params.get("status");
  const search = params.get("q") ?? "";
  const page = Number.parseInt(params.get("page") ?? "0", 10) || 0;
  const tabs = filters(t);
  const status = FILTER_STATUSES.find((candidate) => candidate === requested) ?? null;
  const tableCaption = t.editorial.queue.tableCaption(
    tabs.find((filter) => filter.status === status)?.label ?? "",
  );

  /*
   * One request answers both questions the screen asks: which questions are on this page, and
   * how many sit in each state. The counts are of everything matching the search rather than of
   * the page, so a tab saying "3" means three exist, not three were returned.
   */
  const questions = useQuery({
    queryKey: ["editorial", "questions", status, search, page],
    staleTime: 0, // statuses change under other people's hands; see QuestionPage
    /*
     * Each page and each search is its own query, so without this the table and the tab counts
     * unmount on every pager click and every search, and the screen flashes to "Loading
     * questions" with nothing under it. Keeping the previous page on screen while the next one
     * arrives is the difference between paging through a list and watching it rebuild.
     */
    placeholderData: keepPreviousData,
    queryFn: () =>
      unwrap(
        api.GET("/api/admin/questions", {
          params: {
            query: {
              ...(status ? { status: status as Status } : {}),
              ...(search ? { q: search } : {}),
              page,
            },
          },
        }),
      ),
  });
  const visible = questions.data?.items;
  const counts = questions.data?.counts;
  const count = (candidate: Status | null) => {
    if (!counts) return 0;
    if (candidate === null) return counts.all;
    if (candidate === "DRAFT") return counts.draft;
    if (candidate === "TECHNICAL_REVIEW") return counts.technicalReview;
    if (candidate === "APPROVED") return counts.approved;
    if (candidate === "PUBLISHED") return counts.published;
    return counts.deprecated;
  };

  /** Changing the filter or the search starts again at the first page. */
  const go = (next: { q?: string; page?: number }) => {
    const updated = new URLSearchParams(params);
    if (next.q !== undefined) {
      if (next.q) updated.set("q", next.q);
      else updated.delete("q");
      updated.delete("page");
    }
    if (next.page !== undefined) {
      if (next.page > 0) updated.set("page", String(next.page));
      else updated.delete("page");
    }
    setParams(updated);
  };

  const total = questions.data?.total ?? 0;
  const size = questions.data?.size ?? 25;
  const lastPage = Math.max(0, Math.ceil(total / size) - 1);
  /*
   * The range describes the rows on screen, which while a page is in flight are still the
   * previous ones. The address has already moved to the page being fetched, so reading the range
   * from it would label the dimmed rows with the numbers of rows that have not arrived — "3–4 of
   * 4" over rows one and two. The buttons do read the address, because pressing Next twice in
   * quick succession should ask for the page after the one in flight, not for it again.
   */
  const shown = questions.data?.page ?? page;
  /*
   * A page past the end of the queue is not an empty queue, and telling an editor to write the
   * first question over a bank of a hundred and sixty would be a lie. It happens to a link kept
   * after the queue changed. Previous is no help — the page before is just as empty — so the way
   * back offered is the first page, keeping whatever filter and search are in the address.
   */
  const pastEnd = visible?.length === 0 && total > 0;
  /*
   * Keeping the previous answer on screen while the next one loads only helps when there are rows
   * to keep. With none, all that survives is the previous answer's verdict — "no prompt contains
   * zzz" — and it is a verdict on a different query than the one the field and the address now
   * name. So an empty placeholder waits instead of asserting something the arriving answer is
   * about to contradict.
   */
  const awaiting = questions.isPending || (questions.isPlaceholderData && visible?.length === 0);

  return (
    <>
      <div className="page-head">
        <h1>{t.editorial.queue.title}</h1>
        <div className="head-actions">
          {canReview ? (
            <Link to="/editorial/review" className="button secondary">
              {t.editorial.reviewQueue.title}
            </Link>
          ) : null}
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
      {awaiting ? <Loading label={t.editorial.queue.loading} /> : null}
      {/* Finding one question among a hundred and thirty is the thing this screen was worst
          at, and no amount of tab filtering fixes it. The query lives in the URL so a search can
          be linked to and survives a reload. */}
      <form
        className="queue-search"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          const field = new FormData(event.currentTarget).get("q");
          go({ q: typeof field === "string" ? field : "" });
        }}
      >
        <label htmlFor="queue-search">{t.editorial.queue.searchLabel}</label>
        <div className="button-row">
          <input id="queue-search" name="q" type="text" defaultValue={search} />
          <button type="submit" className="secondary">
            {t.editorial.queue.searchSubmit}
          </button>
          {search ? (
            <button type="button" className="link-button" onClick={() => go({ q: "" })}>
              {t.editorial.queue.searchClear}
            </button>
          ) : null}
        </div>
      </form>

      {questions.isError ? (
        <ErrorState error={questions.error} onRetry={() => void questions.refetch()} />
      ) : null}
      {visible && visible.length === 0 && !awaiting ? (
        /* An empty result after a search is not an empty bank: saying "no questions yet" there
           would be a lie, and telling an editor to write the first one is the wrong next step. */
        <EmptyState
          title={
            pastEnd
              ? t.editorial.queue.emptyPastEnd
              : search
                ? t.editorial.queue.emptyWithSearch(search)
                : status
                  ? t.editorial.queue.emptyWithStatus
                  : t.editorial.queue.emptyTitle
          }
        >
          <p>
            {pastEnd
              ? t.editorial.queue.emptyBodyPastEnd
              : search
                ? t.editorial.queue.emptyBodySearch
                : canAuthor
                  ? t.editorial.queue.emptyBodyAuthor
                  : t.editorial.queue.emptyBodyReader}
          </p>
          {pastEnd ? (
            <button type="button" className="secondary" onClick={() => go({ page: 0 })}>
              {t.editorial.queue.backToFirstPage}
            </button>
          ) : null}
        </EmptyState>
      ) : null}
      {visible && visible.length > 0 ? (
        <ScrollableTable
          className={questions.isPlaceholderData ? "queue stale" : "queue"}
          label={tableCaption}
        >
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
      {/* Only shown when there is more than one page: a pager over a single page is furniture.
          Past the end it would have to count rows that are not there — "2476–2500 of 160" — so
          the empty state carries the way back instead. */}
      {total > size && !pastEnd ? (
        <nav className="pager" aria-label={t.editorial.queue.pagerLabel}>
          <button
            type="button"
            className="secondary small"
            disabled={page === 0}
            onClick={() => go({ page: page - 1 })}
          >
            {t.editorial.queue.previousPage}
          </button>
          <p className="muted">
            {t.editorial.queue.showing(
              shown * size + 1,
              Math.min((shown + 1) * size, total),
              total,
            )}
          </p>
          <button
            type="button"
            className="secondary small"
            disabled={page >= lastPage}
            onClick={() => go({ page: page + 1 })}
          >
            {t.editorial.queue.nextPage}
          </button>
        </nav>
      ) : null}
    </>
  );
}

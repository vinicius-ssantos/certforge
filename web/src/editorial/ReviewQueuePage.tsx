import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import { useAccount } from "../auth/AuthContext";
import { useHasAny } from "../auth/permissions";
import { useTopicNames } from "../history/useTopicNames";
import { useText } from "../i18n/useText";
import { EmptyState, ErrorState, Loading } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { RevisionWithDecisions } from "./QuestionPage";

/** The server caps a page at 100, so a backlog larger than that arrives in more than one answer. */
const PAGE_SIZE = 100;

/**
 * Whether the reviewer asked for approving to publish as well. Remembered per browser, like the
 * language: it is a convenience of this person's working session, it reaches nobody else, and it
 * starts off, so a reader of this storage key cannot turn it on for anyone.
 */
const PUBLISH_KEY = "certforge.review.publishWhenApproved";

function rememberedPublishWhenApproved(): boolean {
  try {
    return localStorage.getItem(PUBLISH_KEY) === "true";
  } catch {
    return false;
  }
}

function rememberPublishWhenApproved(value: boolean): void {
  try {
    localStorage.setItem(PUBLISH_KEY, String(value));
  } catch {
    // A private window or blocked site data: the choice holds for this visit and is not
    // remembered, which is better than failing the click.
  }
}

/**
 * Reviewing a worklist instead of a list. The queue screen is built for finding one question among
 * a hundred and sixty; this is built for the other job, which is working through every question
 * waiting for a decision — one at a time, with everything a reviewer judges on the screen, and the
 * next one arriving as soon as the last is decided.
 *
 * It deliberately offers no way to decide more than one question at once. The only promise this
 * product makes is that a person checked each question, and a screen that makes approving cheaper
 * than reading is a machine for producing approvals nobody read. What it makes cheaper is reaching
 * the question: no return to the queue, no second click to open, no scrolling to find where you
 * were. The signature stays a deliberate press (ADR 0005).
 */
export function ReviewQueuePage() {
  const t = useText();
  const page = t.editorial.reviewQueue;
  useDocumentTitle(page.title);
  const api = useApi();
  const account = useAccount();
  const topicNames = useTopicNames();
  const canReview = useHasAny("CONTENT_REVIEW");
  const maySelfReview = useHasAny("CONTENT_SELF_REVIEW");
  const mayPublish = useHasAny("CONTENT_PUBLISH");
  const [params, setParams] = useSearchParams();
  const [walked, setWalked] = useState<number | null>(null);
  const [publishWhenApproved, setPublishWhenApproved] = useState(rememberedPublishWhenApproved);

  /*
   * The worklist is read once and then walked. Its own query key is what makes that safe: every
   * decision invalidates ["editorial", "questions"], the key the queue screen reads, and sharing
   * it would refetch this list mid-walk — the question just decided leaves TECHNICAL_REVIEW, the
   * rest shift up by one, and the next question the reviewer sees is not the next one. Holding it
   * stale on top of that stops a refetch on window focus doing the same thing.
   *
   * Every page is walked, not the first. A worklist that stops at a hundred would report the
   * backlog as a hundred and quietly drop the rest, which is the failure #192 was filed for.
   */
  const worklist = useQuery({
    queryKey: ["editorial", "review-worklist"],
    staleTime: Infinity,
    queryFn: async () => {
      const items = [];
      for (let index = 0; ; index += 1) {
        const answer = await unwrap(
          api.GET("/api/admin/questions", {
            params: { query: { status: "TECHNICAL_REVIEW", size: PAGE_SIZE, page: index } },
          }),
        );
        items.push(...answer.items);
        // Either condition alone is enough in a healthy answer; both together mean a server that
        // keeps handing back full pages cannot spin this loop for ever.
        if (answer.items.length < PAGE_SIZE || items.length >= answer.total) {
          return items;
        }
      }
    },
  });

  /*
   * Grouped by topic, in the order the topics first appear. Reviewing is reading about one subject
   * and then judging it; ten questions of one topic in a row is one context held, where the
   * queue's own order makes the reviewer change subject at every question.
   */
  const ordered = useMemo(() => {
    const items = worklist.data ?? [];
    const topics: string[] = [];
    for (const item of items) {
      const topic = item.topicId ?? "";
      if (!topics.includes(topic)) topics.push(topic);
    }
    return topics.flatMap((topic) => items.filter((item) => (item.topicId ?? "") === topic));
  }, [worklist.data]);

  /*
   * The address carries the question on screen, so a reload, a link or a browser Back returns to
   * the place in the walk rather than to the top of a list the reviewer has already been through.
   * It is resolved once, when the worklist arrives: after that the walk owns the position and
   * writes it back.
   */
  const asked = params.get("question");
  const fromAddress = ordered.findIndex((item) => item.id === asked);
  // Derived rather than copied into state by an effect: the address is where the walk starts,
  // and from the first move onwards the walk itself says where it is.
  const at = walked ?? (fromAddress >= 0 ? fromAddress : 0);

  const current = ordered[at];
  // The address follows the walk, replacing rather than pushing: there is one place in a
  // worklist, and twenty history entries for twenty questions would turn Back into a second,
  // worse pager.
  useEffect(() => {
    if (ordered.length === 0) return;
    const next = new URLSearchParams(params);
    if (current) next.set("question", current.id);
    else next.delete("question");
    if (next.toString() !== params.toString()) setParams(next, { replace: true });
  }, [current, ordered, params, setParams]);

  const question = useQuery({
    queryKey: ["editorial", "question", current?.id ?? ""],
    enabled: current !== undefined,
    staleTime: 0,
    queryFn: () =>
      unwrap(
        api.GET("/api/admin/questions/{questionId}", {
          params: { path: { questionId: current?.id ?? "" } },
        }),
      ),
  });

  const move = useCallback((by: number) => setWalked(Math.max(0, at + by)), [at]);
  const advance = useCallback(() => move(1), [move]);

  /*
   * Where a decision leaves the walk. Approving is the end of the job for a reviewer, so the
   * next question arrives. For an account that also publishes it is not: approving is the first
   * of two presses, and advancing then would carry the question off the screen before it could
   * be published, sending the reviewer back to the queue to find it again. So the walk waits on
   * the same question, the publish step appears where the checklist was, and moving on happens
   * when the question is actually finished.
   */
  const decided = useCallback(
    (action: string) => {
      if (action === "approve" && mayPublish) return;
      advance();
    },
    [advance, mayPublish],
  );

  /*
   * Focus follows the walk. The position line is a live region, so a screen reader hears "2 of 3"
   * on its own, but without this the keyboard focus stays on a button that has just been replaced
   * and the next Tab starts again from the top of the document — on a screen whose point is not
   * reaching for the mouse.
   */
  const stage = useRef<HTMLDivElement>(null);
  const firstQuestion = useRef(true);
  useEffect(() => {
    if (!current) return;
    if (firstQuestion.current) {
      firstQuestion.current = false;
      return;
    }
    stage.current?.focus();
  }, [current]);

  /*
   * The shortcuts move focus to a decision; they do not take it. Pressing one key to approve would
   * make a stray keystroke an approval, and there is no endpoint that takes one back.
   */
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const typing = target?.closest("input, textarea, select, [contenteditable='true']") !== null;
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
      const focus = (id: string) => document.getElementById(id)?.focus();
      if (event.key === "a") focus("approve-button");
      else if (event.key === "p") focus("request-changes-button");
      else if (event.key === "s") advance();
      else return;
      event.preventDefault();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [advance]);

  if (!canReview) {
    return (
      <EmptyState title={page.notAReviewer}>
        <p>{page.notAReviewerBody}</p>
        <Link to="/editorial">{page.backToQueue}</Link>
      </EmptyState>
    );
  }

  const total = ordered.length;
  const revisions = [...(question.data?.revisions ?? [])].sort((a, b) => a.number - b.number);
  const revision = revisions[revisions.length - 1];
  const yours = revision?.authorId === account?.id;

  return (
    <>
      <div className="page-head">
        <h1>{page.title}</h1>
        <div className="head-actions">
          <Link to="/editorial" className="button secondary">
            {page.backToQueue}
          </Link>
        </div>
      </div>

      {worklist.isPending ? <Loading label={page.loading} /> : null}
      {worklist.isError ? (
        <ErrorState error={worklist.error} onRetry={() => void worklist.refetch()} />
      ) : null}

      {worklist.data && total === 0 ? (
        <EmptyState title={page.emptyTitle}>
          <p>{page.emptyBody}</p>
        </EmptyState>
      ) : null}

      {worklist.data && total > 0 && at >= total ? (
        <EmptyState title={page.doneTitle}>
          <p>{page.doneBody(total)}</p>
          <button type="button" onClick={() => move(-1)}>
            {page.previous}
          </button>
          <Link to="/editorial?status=TECHNICAL_REVIEW" className="button">
            {page.backToQueue}
          </Link>
        </EmptyState>
      ) : null}

      {current ? (
        <div ref={stage} tabIndex={-1} aria-label={page.stageLabel(at + 1, total)}>
          <div className="review-progress">
            <p role="status">{page.progress(at + 1, total)}</p>
            <p className="hint">
              {page.inTopic(
                current.topicId ? (topicNames.get(current.topicId) ?? page.fallbackTopic) : page.noTopic,
                ordered.filter((item) => (item.topicId ?? "") === (current.topicId ?? "")).length,
              )}
            </p>
            <div className="stack">
              <button type="button" className="secondary" disabled={at === 0} onClick={() => move(-1)}>
                {page.previous}
              </button>
              <button type="button" className="secondary" onClick={advance}>
                {page.skip}
              </button>
              <Link to={`/editorial/questions/${current.id}`}>{page.openOnItsOwn}</Link>
            </div>
            {mayPublish ? (
              <label className="check">
                <input
                  type="checkbox"
                  checked={publishWhenApproved}
                  onChange={(event) => {
                    setPublishWhenApproved(event.target.checked);
                    rememberPublishWhenApproved(event.target.checked);
                  }}
                />
                {page.publishWhenApproved}
              </label>
            ) : null}
            {mayPublish ? <p className="hint">{page.publishWhenApprovedHint}</p> : null}
            <p className="hint">{page.shortcuts}</p>
          </div>

          {question.isPending ? <Loading label={page.loadingQuestion} /> : null}
          {question.isError ? (
            <ErrorState error={question.error} onRetry={() => void question.refetch()} />
          ) : null}
          {/*
            * Said before the press rather than after it, and which of the two it says depends on
            * the viewer. An account that may review its own work gets the consequence — the
            * decision will be recorded as a self-review — and anyone else gets the refusal they
            * would otherwise meet once per question, since the account that imports a pack
            * authors every question in it. The button stays either way: this predicts, it does
            * not decide.
            */}
          {question.data && yours ? (
            <p className="hint warn-note">
              {maySelfReview ? page.youWroteThisSelfReview : page.youWroteThis}
            </p>
          ) : null}
          {question.data && revision ? (
            <RevisionWithDecisions
              key={revision.id}
              question={question.data}
              revision={revision}
              isLatest
              topicName={revision.topicId ? topicNames.get(revision.topicId) : undefined}
              previous={revisions[revisions.length - 2]}
              topicNameOf={(id: string) => topicNames.get(id)}
              onDecided={decided}
              publishWhenApproved={publishWhenApproved}
            />
          ) : null}
        </div>
      ) : null}
    </>
  );
}

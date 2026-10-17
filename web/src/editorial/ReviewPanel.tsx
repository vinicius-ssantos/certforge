import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import type { EditorialQuestion, Revision } from "../api/types";
import { useHasAny } from "../auth/permissions";
import { Confirm } from "../ui/Confirm";
import { ErrorSummary } from "../ui/Form";
import { formatDateTime } from "../history/format";
import { useLocale, useText } from "../i18n/useText";
import { errorMessage } from "../ui/messages";
import { checklist } from "./labels";

type Action = "approve" | "request-changes" | "publish" | "deprecate" | "new-revision";

/**
 * What the viewer may do with a revision, as far as the interface can tell. The server decides
 * every one of these again, so a refusal (the author reviewing their own work, say) comes back as
 * a plain message rather than being second-guessed here.
 */
export function useCanDecide(revision: Revision, isLatest: boolean) {
  const review = useHasAny("CONTENT_REVIEW");
  const publish = useHasAny("CONTENT_PUBLISH");
  const author = useHasAny("CONTENT_AUTHOR");
  return {
    review: review && revision.status === "TECHNICAL_REVIEW",
    publish: publish && (revision.status === "TECHNICAL_REVIEW" || revision.status === "APPROVED"),
    retire: publish && revision.status === "PUBLISHED",
    startRevision: author && isLatest && (revision.status === "PUBLISHED" || revision.status === "DEPRECATED"),
  };
}

export function ReviewPanel({
  question,
  revision,
  isLatest,
  topicName,
  onDecided,
  publishWhenApproved: publishWhenApprovedProp,
}: {
  question: EditorialQuestion;
  revision: Revision;
  isLatest: boolean;
  topicName?: string;
  /**
   * Where a decision leaves the viewer, when it is not this page. The review queue walks a
   * worklist, so it moves to the next question instead of staying on the one just decided.
   */
  onDecided?: (action: Action) => void;
  /**
   * Publish straight after approving, as one press. Working through a backlog is two presses per
   * question for an account that publishes, so the worklist offers this; it is off until the
   * viewer turns it on, and while it is on the button says what it will do rather than leaving
   * the second half of it to a dialog.
   */
  publishWhenApproved?: boolean;
}) {
  const t = useText();
  const { locale } = useLocale();
  const panel = t.editorial.reviewPanel;
  const api = useApi();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const can = useCanDecide(revision, isLatest);
  // Only an account that may publish can publish, whatever the caller asks for; the server would
  // refuse anyway, and a button promising two things when it can do one is the worse failure.
  const publishWhenApproved = publishWhenApprovedProp === true && can.publish;

  const [comment, setComment] = useState("");
  const [ticked, setTicked] = useState<string[]>([]);
  const [problems, setProblems] = useState<{ fieldId?: string; message: string }[]>([]);
  const [failure, setFailure] = useState<string | null>(null);

  const decide = useMutation({
    mutationFn: async (action: Action) => {
      const path = { revisionId: revision.id };
      switch (action) {
        case "approve": {
          const approved = await unwrap(
            api.POST("/api/admin/question-revisions/{revisionId}/approve", {
              params: { path },
              body: { checklist: ticked, ...(comment.trim() ? { comment: comment.trim() } : {}) },
            }),
          );
          if (!publishWhenApproved) {
            return approved;
          }
          // Two requests, exactly as two presses would make: the record of what happened is the
          // same, and so is what happens when the second one fails. A failure there leaves a
          // revision approved and unpublished, which is a real state and has to be shown as one,
          // so the approval reaches the cache before the publish is attempted.
          queryClient.setQueryData(["editorial", "question", approved.id], approved);
          return unwrap(
            api.POST("/api/admin/question-revisions/{revisionId}/publish", { params: { path } }),
          );
        }
        case "request-changes":
          return unwrap(
            api.POST("/api/admin/question-revisions/{revisionId}/request-changes", {
              params: { path },
              body: { comment: comment.trim(), checklist: ticked },
            }),
          );
        case "publish":
          return unwrap(api.POST("/api/admin/question-revisions/{revisionId}/publish", { params: { path } }));
        case "deprecate":
          return unwrap(api.POST("/api/admin/question-revisions/{revisionId}/deprecate", { params: { path } }));
        case "new-revision":
          return unwrap(
            api.POST("/api/admin/questions/{questionId}/revisions", { params: { path: { questionId: question.id } } }),
          );
      }
    },
    onSuccess: (updated, action) => {
      setFailure(null);
      queryClient.setQueryData(["editorial", "question", updated.id], updated);
      void queryClient.invalidateQueries({ queryKey: ["editorial", "questions"] });
      // What happened, which is not always what was pressed: approving with "and publish" on ends
      // in a published revision, and saying "Approved." there would under-report an irreversible
      // step — and would leave the worklist waiting for a publish that has already happened.
      const happened: Action = action === "approve" && publishWhenApproved ? "publish" : action;
      const notice = { approve: "approved", "request-changes": "changes", publish: "published", deprecate: "retired", "new-revision": "started" }[happened];
      if (onDecided && happened !== "new-revision") {
        onDecided(happened);
      } else if (action === "new-revision") {
        const newest = Math.max(...updated.revisions.map((candidate) => candidate.number));
        navigate(`/editorial/questions/${updated.id}?revision=${newest}`, { state: { notice } });
      } else {
        navigate(`${location.pathname}${location.search}`, { replace: true, state: { notice } });
      }
    },
    onError: (error) => setFailure(errorMessage(error, t)),
  });

  function requestChanges() {
    if (!comment.trim()) {
      setProblems([{ fieldId: "review-comment", message: panel.sayWhatToChange }]);
      return;
    }
    setProblems([]);
    decide.mutate("request-changes");
  }

  const approval = [...revision.reviews].reverse().find((review) => review.decision === "APPROVED");
  // Named for what it was. A publish confirmation that says "approved by" about a decision the
  // author made on their own work would be claiming a second pair of eyes that was not there.
  const reviewerName = approval?.reviewerName ?? panel.unknownReviewer;
  const approvedBy =
    approval && approval.reviewerId === revision.authorId
      ? panel.selfReviewedBy(reviewerName)
      : reviewerName;
  const approvedAt = approval?.decidedAt
    ? formatDateTime(approval.decidedAt, locale)
    : panel.unknownApprovalDate;
  const topic = topicName ?? t.editorial.queue.fallbackTopic;

  // Stable between renders: the summary takes focus when this array changes.
  const shown = useMemo(() => (failure ? [...problems, { message: failure }] : problems), [problems, failure]);

  if (!can.review && !can.publish && !can.retire && !can.startRevision) {
    return null;
  }

  return (
    <div className="decision">
      {can.review ? (
        <form className="panel decision-panel" onSubmit={(event) => event.preventDefault()} noValidate>
          <ErrorSummary problems={shown} />
          <fieldset>
            <legend>{panel.policyLegend}</legend>
            <p className="hint">{panel.policyHint}</p>
            <p role="status" className="hint">{panel.checklistCount(ticked.length, checklist(t).length)}</p>
            {checklist(t).map((item) => (
              <label key={item.code} className="check">
                <input
                  type="checkbox"
                  name={item.code}
                  checked={ticked.includes(item.code)}
                  onChange={(event) =>
                    setTicked((current) =>
                      event.target.checked ? [...current, item.code] : current.filter((code) => code !== item.code),
                    )
                  }
                />
                {item.label}
              </label>
            ))}
          </fieldset>
          <div className="field">
            <label htmlFor="review-comment">{panel.comment}</label>
            <p id="review-comment-hint" className="hint">
              {panel.commentHint}
            </p>
            <textarea
              id="review-comment"
              aria-describedby="review-comment-hint"
              rows={4}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </div>
          <div className="stack decision-actions">
            <button id="approve-button" type="button" className="approve" disabled={decide.isPending} onClick={() => decide.mutate("approve")}>
              {publishWhenApproved ? panel.approveAndPublish : panel.approve}
            </button>
            {publishWhenApproved ? <p className="hint">{panel.approveAndPublishHint}</p> : null}
            <button id="request-changes-button" type="button" className="warn" disabled={decide.isPending} onClick={requestChanges}>
              {panel.requestChanges}
            </button>
            <p className="hint">{panel.requestChangesHint}</p>
          </div>
        </form>
      ) : (
        <ErrorSummary problems={shown} />
      )}

      {can.publish ? (
        <section className="publish publish-danger" aria-labelledby="publish-heading">
          <h2 id="publish-heading">{panel.publishHeading}</h2>
          <p>{panel.publishNote}</p>
          {revision.status === "APPROVED" ? (
            <Confirm
              title={panel.confirmPublishTitle(revision.number)}
              explain={panel.confirmPublishExplain(revision.number, topic, approvedBy, approvedAt)}
              confirmLabel={panel.confirmPublishLabel(revision.number)}
              busy={decide.isPending}
              onConfirm={() => decide.mutate("publish")}
            >
              {panel.publishRevision(revision.number)}
            </Confirm>
          ) : (
            <>
              <button type="button" disabled>
                {panel.publishRevision(revision.number)}
              </button>
              <p className="hint">{panel.approveFirst}</p>
            </>
          )}
        </section>
      ) : null}

      {can.retire ? (
        <section className="publish" aria-labelledby="retire-heading">
          <h2 id="retire-heading">{panel.retireHeading}</h2>
          <p>{panel.retireNote}</p>
          <Confirm
            title={panel.confirmRetireTitle(revision.number)}
            explain={panel.confirmRetireExplain(revision.number)}
            confirmLabel={panel.confirmRetireLabel(revision.number)}
            busy={decide.isPending}
            onConfirm={() => decide.mutate("deprecate")}
          >
            {panel.retireRevision(revision.number)}
          </Confirm>
        </section>
      ) : null}

      {can.startRevision ? (
        <section className="publish" aria-labelledby="revise-heading">
          <h2 id="revise-heading">{panel.reviseHeading}</h2>
          <p>{panel.reviseNote}</p>
          <button type="button" disabled={decide.isPending} onClick={() => decide.mutate("new-revision")}>
            {panel.startRevision}
          </button>
        </section>
      ) : null}
    </div>
  );
}

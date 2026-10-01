import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useApi } from "../api/ApiProvider";
import { unwrap } from "../api/problem";
import type { EditorialQuestion, Revision } from "../api/types";
import { useHasAny } from "../auth/permissions";
import { Confirm } from "../ui/Confirm";
import { ErrorSummary } from "../ui/Form";
import { errorMessage } from "../ui/messages";

const POLICY = [
  "The correct answer is technically right for the stated Java release",
  "The code compiles and prints what the question says",
  "Nothing in the wording is ambiguous",
  "Every reason is accurate, including for the wrong options",
  "The references are official documentation",
];

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
}: {
  question: EditorialQuestion;
  revision: Revision;
  isLatest: boolean;
}) {
  const api = useApi();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const can = useCanDecide(revision, isLatest);

  const [comment, setComment] = useState("");
  const [problems, setProblems] = useState<{ fieldId?: string; message: string }[]>([]);
  const [failure, setFailure] = useState<string | null>(null);

  const decide = useMutation({
    mutationFn: async (action: Action) => {
      const path = { revisionId: revision.id };
      switch (action) {
        case "approve":
          return unwrap(
            api.POST("/api/admin/question-revisions/{revisionId}/approve", {
              params: { path },
              body: comment.trim() ? { comment: comment.trim() } : {},
            }),
          );
        case "request-changes":
          return unwrap(
            api.POST("/api/admin/question-revisions/{revisionId}/request-changes", {
              params: { path },
              body: { comment: comment.trim() },
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
      const notice = { approve: "approved", "request-changes": "changes", publish: "published", deprecate: "retired", "new-revision": "started" }[action];
      if (action === "new-revision") {
        const newest = Math.max(...updated.revisions.map((candidate) => candidate.number));
        navigate(`/editorial/questions/${updated.id}?revision=${newest}`, { state: { notice } });
      } else {
        navigate(`${location.pathname}${location.search}`, { replace: true, state: { notice } });
      }
    },
    onError: (error) => setFailure(errorMessage(error)),
  });

  function requestChanges() {
    if (!comment.trim()) {
      setProblems([{ fieldId: "review-comment", message: "Say what needs to change before sending it back." }]);
      return;
    }
    setProblems([]);
    decide.mutate("request-changes");
  }

  // Stable between renders: the summary takes focus when this array changes.
  const shown = useMemo(() => (failure ? [...problems, { message: failure }] : problems), [problems, failure]);

  if (!can.review && !can.publish && !can.retire && !can.startRevision) {
    return null;
  }

  return (
    <div className="decision">
      {can.review ? (
        <form onSubmit={(event) => event.preventDefault()} noValidate>
          <ErrorSummary problems={shown} />
          <fieldset>
            <legend>Content policy</legend>
            <p className="hint">Tick what you checked yourself. These boxes are your own reminder and are not saved.</p>
            {POLICY.map((item, index) => (
              <label key={item} className="check">
                <input type="checkbox" name={`policy-${index}`} />
                {item}
              </label>
            ))}
          </fieldset>
          <div className="field">
            <label htmlFor="review-comment">Comment</label>
            <p id="review-comment-hint" className="hint">
              Needed when you ask for changes. The author sees it.
            </p>
            <textarea
              id="review-comment"
              aria-describedby="review-comment-hint"
              rows={4}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </div>
          <div className="stack">
            <button type="button" className="approve" disabled={decide.isPending} onClick={() => decide.mutate("approve")}>
              Approve
            </button>
            <button type="button" className="warn" disabled={decide.isPending} onClick={requestChanges}>
              Request changes
            </button>
            <p className="hint">Requesting changes returns the revision to its author as a draft.</p>
          </div>
        </form>
      ) : (
        <ErrorSummary problems={shown} />
      )}

      {can.publish ? (
        <section className="publish" aria-labelledby="publish-heading">
          <h2 id="publish-heading">Publish</h2>
          <p>
            Only approved revisions can be published. A published revision cannot be edited; a correction becomes a
            new revision.
          </p>
          {revision.status === "APPROVED" ? (
            <Confirm
              title={`Confirm publishing revision ${revision.number}`}
              explain={`Publish revision ${revision.number}? Learners will get this question in their sessions, and the revision it replaces is retired.`}
              confirmLabel={`Yes, publish revision ${revision.number}`}
              busy={decide.isPending}
              onConfirm={() => decide.mutate("publish")}
            >
              Publish revision {revision.number}
            </Confirm>
          ) : (
            <>
              <button type="button" disabled>
                Publish revision {revision.number}
              </button>
              <p className="hint">Approve it first.</p>
            </>
          )}
        </section>
      ) : null}

      {can.retire ? (
        <section className="publish" aria-labelledby="retire-heading">
          <h2 id="retire-heading">Retire</h2>
          <p>A retired revision stays in history and in learners' past answers, and no new session will use it.</p>
          <Confirm
            title={`Confirm retiring revision ${revision.number}`}
            explain={`Retire revision ${revision.number}? New sessions will no longer include this question unless a newer revision is published.`}
            confirmLabel={`Yes, retire revision ${revision.number}`}
            busy={decide.isPending}
            onConfirm={() => decide.mutate("deprecate")}
          >
            Retire revision {revision.number}
          </Confirm>
        </section>
      ) : null}

      {can.startRevision ? (
        <section className="publish" aria-labelledby="revise-heading">
          <h2 id="revise-heading">Correct this question</h2>
          <p>Starting a revision copies this one into a new draft. The published text stays as it is until the new one is published.</p>
          <button type="button" disabled={decide.isPending} onClick={() => decide.mutate("new-revision")}>
            Start a new revision
          </button>
        </section>
      ) : null}
    </div>
  );
}

import { ApiError } from "../api/problem";
import type { Catalog } from "../i18n/en";

/**
 * What a learner reads for each stable error code. The backend never sends text meant for display;
 * it sends a code, and the wording lives in the catalog so it can be reviewed and translated.
 *
 * The catalog is a required argument rather than a defaulted one on purpose: a call site that
 * forgot to pass the active locale would silently render English, and a default parameter is
 * exactly the kind of omission the type checker cannot see.
 */
export function errorMessage(error: unknown, t: Catalog): string {
  if (!(error instanceof ApiError)) {
    return t.errors.unknown;
  }
  switch (error.code) {
    case "network_error":
      return t.errors.network;
    case "unauthenticated":
      return t.errors.unauthenticated;
    case "invalid_credentials":
      return t.errors.invalidCredentials;
    case "too_many_attempts":
      return error.retryAfterSeconds
        ? t.errors.tooManyAttemptsIn(error.retryAfterSeconds)
        : t.errors.tooManyAttempts;
    case "email_already_registered":
      return t.errors.emailAlreadyRegistered;
    case "password_too_short":
      return t.errors.passwordTooShort;
    case "password_too_long":
      return t.errors.passwordTooLong;
    case "password_equals_email":
      return t.errors.passwordEqualsEmail;
    case "validation_failed":
      return t.errors.validationFailed;
    case "csrf_invalid":
      return t.errors.csrfInvalid;
    case "track_not_found":
      return t.errors.trackNotFound;
    case "topic_not_found":
      return t.errors.topicNotFound;
    case "insufficient_content":
      return t.errors.insufficientContent;
    case "active_session_exists":
      return t.errors.activeSessionExists;
    case "session_not_found":
      return t.errors.sessionNotFound;
    case "session_expired":
      return t.errors.sessionExpired;
    case "session_not_in_progress":
      return t.errors.sessionNotInProgress;
    case "already_answered":
      return t.errors.alreadyAnswered;
    case "concurrent_submission":
      return t.errors.concurrentSubmission;
    case "idempotency_key_reused":
    case "idempotency_key_invalid":
    case "idempotency_key_required":
      return t.errors.idempotency;
    case "invalid_option":
    case "duplicate_option":
    case "single_choice_requires_one_option":
      return t.errors.chooseOne;
    case "question_count_out_of_range":
      return t.errors.questionCountOutOfRange;
    case "question_not_found":
    case "revision_not_found":
      return t.errors.questionNotFound;
    case "revision_incomplete":
      return t.errors.revisionIncomplete;
    case "revision_not_editable":
    case "revision_not_draft":
      return t.errors.revisionNotEditable;
    case "not_revision_author":
      return t.errors.notRevisionAuthor;
    case "revision_not_in_review":
      return t.errors.revisionNotInReview;
    case "revision_not_approved":
      return t.errors.revisionNotApproved;
    case "reviewer_must_differ_from_author":
      return t.errors.reviewerMustDiffer;
    case "open_revision_exists":
      return t.errors.openRevisionExists;
    case "topic_not_active":
      return t.errors.topicNotActive;
    case "forbidden":
      return t.errors.forbidden;
    default:
      return error.status >= 500 ? t.errors.serverSide : t.errors.requestFailed;
  }
}

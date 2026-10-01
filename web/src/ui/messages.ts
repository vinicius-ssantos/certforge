import { ApiError } from "../api/problem";

/**
 * What a learner reads for each stable error code. The backend never sends text meant for
 * display; it sends a code, and the wording lives here so it can be reviewed and translated.
 */
export function errorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "Something went wrong. Please try again.";
  }
  switch (error.code) {
    case "network_error":
      return "The server cannot be reached. Check your connection and try again.";
    case "unauthenticated":
      return "Your session has ended. Please sign in again.";
    case "invalid_credentials":
      return "The email or password is incorrect.";
    case "too_many_attempts":
      return error.retryAfterSeconds
        ? `Too many attempts. Wait ${error.retryAfterSeconds} seconds and try again.`
        : "Too many attempts. Wait a little and try again.";
    case "email_already_registered":
      return "An account with this email already exists. Try signing in instead.";
    case "password_too_short":
      return "The password must have at least 12 characters.";
    case "password_too_long":
      return "The password is too long. Use at most 72 bytes.";
    case "password_equals_email":
      return "The password must not be the same as your email.";
    case "validation_failed":
      return "Some of the information is not valid. Check the form and try again.";
    case "csrf_invalid":
      return "The page's security token expired. Try again.";
    case "track_not_found":
      return "This track does not exist or is not available.";
    case "topic_not_found":
      return "This topic does not exist or is not available.";
    case "insufficient_content":
      return "There are not enough published questions on this topic yet. Try another topic.";
    case "active_session_exists":
      return "You already have a practice session in progress for this topic.";
    case "session_not_found":
      return "This practice session does not exist.";
    case "session_expired":
      return "This practice session expired. Answers you already gave were kept.";
    case "session_not_in_progress":
      return "This practice session is already finished.";
    case "already_answered":
      return "You already answered this question.";
    case "concurrent_submission":
      return "Your answer is still being saved. Wait a moment and try again.";
    case "idempotency_key_reused":
    case "idempotency_key_invalid":
    case "idempotency_key_required":
      return "Your answer could not be saved safely. Reload the page and try again.";
    case "invalid_option":
    case "duplicate_option":
    case "single_choice_requires_one_option":
      return "Choose one answer from the list.";
    case "question_count_out_of_range":
      return "That number of questions is not allowed.";
    case "forbidden":
      return "You do not have permission to do that.";
    default:
      return error.status >= 500
        ? "Something went wrong on our side. Please try again."
        : "The request could not be completed.";
  }
}

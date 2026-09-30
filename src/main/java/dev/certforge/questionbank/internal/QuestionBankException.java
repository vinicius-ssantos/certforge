package dev.certforge.questionbank.internal;

import dev.certforge.platform.ProblemException;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;

/** A question-bank rule violation with a stable code, an HTTP status and optional details. */
class QuestionBankException extends ProblemException {

  private static final long serialVersionUID = 1L;

  private QuestionBankException(
      HttpStatus status, String code, String message, Map<String, Object> details) {
    super(status, code, message, details, Map.of());
  }

  static QuestionBankException notFound(String code, String message) {
    return new QuestionBankException(HttpStatus.NOT_FOUND, code, message, Map.of());
  }

  static QuestionBankException conflict(String code, String message) {
    return new QuestionBankException(HttpStatus.CONFLICT, code, message, Map.of());
  }

  static QuestionBankException forbidden(String code, String message) {
    return new QuestionBankException(HttpStatus.FORBIDDEN, code, message, Map.of());
  }

  static QuestionBankException invalid(String code, String message) {
    return new QuestionBankException(HttpStatus.BAD_REQUEST, code, message, Map.of());
  }

  static QuestionBankException incomplete(List<String> violations) {
    return new QuestionBankException(
        HttpStatus.CONFLICT,
        "revision_incomplete",
        "The revision is not complete",
        Map.of("violations", violations));
  }
}

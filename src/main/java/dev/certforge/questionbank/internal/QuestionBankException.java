package dev.certforge.questionbank.internal;

import java.util.List;
import org.springframework.http.HttpStatus;

/** A question-bank rule violation with a stable code, an HTTP status and optional details. */
class QuestionBankException extends RuntimeException {

  private static final long serialVersionUID = 1L;

  private final String problemCode;
  private final HttpStatus httpStatus;
  private final transient List<String> problemViolations;

  private QuestionBankException(
      HttpStatus httpStatus, String problemCode, String message, List<String> violations) {
    super(message);
    this.httpStatus = httpStatus;
    this.problemCode = problemCode;
    this.problemViolations = violations;
  }

  static QuestionBankException notFound(String code, String message) {
    return new QuestionBankException(HttpStatus.NOT_FOUND, code, message, List.of());
  }

  static QuestionBankException conflict(String code, String message) {
    return new QuestionBankException(HttpStatus.CONFLICT, code, message, List.of());
  }

  static QuestionBankException forbidden(String code, String message) {
    return new QuestionBankException(HttpStatus.FORBIDDEN, code, message, List.of());
  }

  static QuestionBankException invalid(String code, String message) {
    return new QuestionBankException(HttpStatus.BAD_REQUEST, code, message, List.of());
  }

  static QuestionBankException incomplete(List<String> violations) {
    return new QuestionBankException(
        HttpStatus.CONFLICT, "revision_incomplete", "The revision is not complete", violations);
  }

  String code() {
    return problemCode;
  }

  HttpStatus status() {
    return httpStatus;
  }

  List<String> violations() {
    return problemViolations;
  }
}

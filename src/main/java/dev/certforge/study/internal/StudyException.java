package dev.certforge.study.internal;

import java.util.Map;
import org.springframework.http.HttpStatus;

/** A study rule violation with a stable code, an HTTP status and optional details. */
class StudyException extends RuntimeException {

  private static final long serialVersionUID = 1L;

  private final String problemCode;
  private final HttpStatus httpStatus;
  private final transient Map<String, Object> problemDetails;

  private StudyException(
      HttpStatus httpStatus, String problemCode, String message, Map<String, Object> details) {
    super(message);
    this.httpStatus = httpStatus;
    this.problemCode = problemCode;
    this.problemDetails = details;
  }

  static StudyException notFound(String code, String message) {
    return new StudyException(HttpStatus.NOT_FOUND, code, message, Map.of());
  }

  static StudyException invalid(String code, String message) {
    return new StudyException(HttpStatus.BAD_REQUEST, code, message, Map.of());
  }

  static StudyException conflict(String code, String message) {
    return new StudyException(HttpStatus.CONFLICT, code, message, Map.of());
  }

  static StudyException conflict(String code, String message, Map<String, Object> details) {
    return new StudyException(HttpStatus.CONFLICT, code, message, details);
  }

  String code() {
    return problemCode;
  }

  HttpStatus status() {
    return httpStatus;
  }

  Map<String, Object> details() {
    return problemDetails;
  }
}

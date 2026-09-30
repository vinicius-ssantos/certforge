package dev.certforge.study.internal;

import dev.certforge.platform.ProblemException;
import java.util.Map;
import org.springframework.http.HttpStatus;

/** A study rule violation with a stable code, an HTTP status and optional details. */
class StudyException extends ProblemException {

  private static final long serialVersionUID = 1L;

  private StudyException(
      HttpStatus status, String code, String message, Map<String, Object> details) {
    super(status, code, message, details, Map.of());
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
}

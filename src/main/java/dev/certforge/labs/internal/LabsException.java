package dev.certforge.labs.internal;

import dev.certforge.platform.ProblemException;
import org.springframework.http.HttpStatus;

/** A labs failure with a stable code, reported as an RFC 9457 problem response. */
class LabsException extends ProblemException {

  private static final long serialVersionUID = 1L;

  private LabsException(String code, String message) {
    super(HttpStatus.NOT_FOUND, code, message);
  }

  static LabsException notFound(String code, String message) {
    return new LabsException(code, message);
  }
}

package dev.certforge.preparationcatalog.internal;

import org.springframework.http.HttpStatus;

/** A catalog rule violation with a stable machine-readable code and an HTTP status. */
class CatalogException extends RuntimeException {

  private static final long serialVersionUID = 1L;

  private final String problemCode;
  private final HttpStatus httpStatus;

  private CatalogException(HttpStatus httpStatus, String problemCode, String message) {
    super(message);
    this.httpStatus = httpStatus;
    this.problemCode = problemCode;
  }

  static CatalogException notFound(String code, String message) {
    return new CatalogException(HttpStatus.NOT_FOUND, code, message);
  }

  static CatalogException conflict(String code, String message) {
    return new CatalogException(HttpStatus.CONFLICT, code, message);
  }

  static CatalogException invalid(String code, String message) {
    return new CatalogException(HttpStatus.BAD_REQUEST, code, message);
  }

  String code() {
    return problemCode;
  }

  HttpStatus status() {
    return httpStatus;
  }
}

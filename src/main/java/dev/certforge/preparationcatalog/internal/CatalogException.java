package dev.certforge.preparationcatalog.internal;

import dev.certforge.platform.ProblemException;
import org.springframework.http.HttpStatus;

/** A catalog rule violation with a stable machine-readable code and an HTTP status. */
class CatalogException extends ProblemException {

  private static final long serialVersionUID = 1L;

  private CatalogException(HttpStatus status, String code, String message) {
    super(status, code, message);
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
}

package dev.certforge.study.internal;

import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/** Maps study failures to stable RFC 9457 problem responses with a machine-readable code. */
@RestControllerAdvice(basePackages = "dev.certforge.study")
class StudyExceptionHandler extends ResponseEntityExceptionHandler {

  @ExceptionHandler(StudyException.class)
  ResponseEntity<Object> failure(StudyException e) {
    ProblemDetail detail = detail(e.status(), e.code(), e.getMessage());
    e.details().forEach(detail::setProperty);
    return ResponseEntity.status(e.status()).body(detail);
  }

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
      MethodArgumentNotValidException ex,
      HttpHeaders headers,
      HttpStatusCode status,
      WebRequest request) {
    List<String> fields =
        ex.getBindingResult().getFieldErrors().stream().map(FieldError::getField).sorted().toList();
    ProblemDetail detail = detail(HttpStatus.BAD_REQUEST, "validation_failed", "Invalid request");
    detail.setProperty("fields", fields);
    return ResponseEntity.badRequest().body(detail);
  }

  @Override
  protected ResponseEntity<Object> handleExceptionInternal(
      Exception ex, Object body, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
    if (body instanceof ProblemDetail problem && problem.getProperties() == null) {
      problem.setProperty("code", "invalid_request");
    }
    return super.handleExceptionInternal(ex, body, headers, status, request);
  }

  private static ProblemDetail detail(HttpStatus status, String code, String title) {
    ProblemDetail detail = ProblemDetail.forStatus(status);
    detail.setTitle(title);
    detail.setProperty("code", code);
    return detail;
  }
}

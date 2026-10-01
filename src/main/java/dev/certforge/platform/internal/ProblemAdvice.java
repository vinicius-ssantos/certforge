package dev.certforge.platform.internal;

import dev.certforge.platform.ProblemException;
import dev.certforge.platform.RequestId;
import io.micrometer.core.instrument.MeterRegistry;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

/**
 * The single place that turns failures into responses. Every body is an RFC 9457 problem with a
 * stable {@code code} and the request id. Nothing else is ever sent: no stack traces, no messages
 * from unexpected failures, no submitted values.
 */
@RestControllerAdvice
class ProblemAdvice extends ResponseEntityExceptionHandler {

  private static final Logger log = LoggerFactory.getLogger(ProblemAdvice.class);
  private static final String CODE = "code";
  private static final String REQUEST_ID = "requestId";

  private final MeterRegistry metrics;

  ProblemAdvice(MeterRegistry metrics) {
    this.metrics = metrics;
  }

  /** A failure raised deliberately by a module, with its own status and code. */
  @ExceptionHandler(ProblemException.class)
  ResponseEntity<Object> problem(ProblemException e) {
    metrics.counter("certforge.domain.failures", "code", e.code()).increment();
    ProblemDetail detail = detail(e.status(), e.code(), e.getMessage());
    e.details().forEach(detail::setProperty);
    ResponseEntity.BodyBuilder response = ResponseEntity.status(e.status());
    e.headers().forEach(response::header);
    return response.body(detail);
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

  /**
   * Framework errors (bad JSON, wrong method, unknown path, unsupported content type and so on) get
   * the same contract. The body is always built here. The framework hands over no body for most of
   * them and, for the rest, one whose text describes the server's internals, so neither is used:
   * only the status, a stable code for the kind of failure and the request id leave.
   */
  @Override
  protected ResponseEntity<Object> handleExceptionInternal(
      Exception ex, Object body, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
    ProblemDetail problem = ProblemDetail.forStatus(status);
    problem.setTitle(reason(status));
    problem.setProperty(CODE, codeFor(ex, status));
    problem.setProperty(REQUEST_ID, RequestId.current());
    return super.handleExceptionInternal(ex, problem, headers, status, request);
  }

  private static String codeFor(Exception ex, HttpStatusCode status) {
    if (ex instanceof NoResourceFoundException || ex instanceof NoHandlerFoundException) {
      return "not_found";
    }
    if (ex instanceof HttpRequestMethodNotSupportedException) {
      return "method_not_allowed";
    }
    if (ex instanceof HttpMediaTypeNotSupportedException) {
      return "unsupported_media_type";
    }
    if (ex instanceof HttpMediaTypeNotAcceptableException) {
      return "not_acceptable";
    }
    return status.value() == 404 ? "not_found" : "invalid_request";
  }

  private static String reason(HttpStatusCode status) {
    HttpStatus known = HttpStatus.resolve(status.value());
    return known == null ? "Request failed" : known.getReasonPhrase();
  }

  /**
   * Anything unexpected. The details go to the log, correlated by request id, and the client gets
   * only a generic problem. Security exceptions are passed on so the security layer answers them.
   */
  @ExceptionHandler(Exception.class)
  // PMD does not recognise the exception as the trailing Throwable argument of the SLF4J call.
  @SuppressWarnings("PMD.InvalidLogMessageFormat")
  ResponseEntity<Object> unexpected(Exception e) throws Exception {
    if (e instanceof AccessDeniedException || e instanceof AuthenticationException) {
      throw e;
    }
    log.error("Unexpected failure ({}) while handling a request", e.getClass().getSimpleName(), e);
    metrics.counter("certforge.unexpected.failures").increment();
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .body(detail(HttpStatus.INTERNAL_SERVER_ERROR, "internal_error", "Unexpected error"));
  }

  private static ProblemDetail detail(HttpStatus status, String code, String title) {
    ProblemDetail detail = ProblemDetail.forStatus(status);
    detail.setTitle(title);
    detail.setProperty(CODE, code);
    detail.setProperty(REQUEST_ID, RequestId.current());
    return detail;
  }
}

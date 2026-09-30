package dev.certforge.identity.internal;

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

/**
 * Maps identity failures to stable RFC 9457 problem responses with a machine-readable {@code code}.
 * Bodies never echo submitted values such as passwords.
 */
@RestControllerAdvice(basePackages = "dev.certforge.identity")
class IdentityExceptionHandler extends ResponseEntityExceptionHandler {

  @ExceptionHandler(EmailAlreadyRegistered.class)
  ResponseEntity<Object> emailAlreadyRegistered(EmailAlreadyRegistered e) {
    return problem(HttpStatus.CONFLICT, "email_already_registered", "Email already registered");
  }

  @ExceptionHandler(InvalidCredentials.class)
  ResponseEntity<Object> invalidCredentials(InvalidCredentials e) {
    return problem(HttpStatus.UNAUTHORIZED, "invalid_credentials", "Invalid email or password");
  }

  @ExceptionHandler(TooManyAttempts.class)
  ResponseEntity<Object> tooManyAttempts(TooManyAttempts e) {
    ProblemDetail detail =
        detail(HttpStatus.TOO_MANY_REQUESTS, "too_many_attempts", "Too many attempts");
    return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
        .header(HttpHeaders.RETRY_AFTER, String.valueOf(e.retryAfterSeconds()))
        .body(detail);
  }

  @ExceptionHandler(WeakPassword.class)
  ResponseEntity<Object> weakPassword(WeakPassword e) {
    return problem(HttpStatus.BAD_REQUEST, e.code(), "Password does not meet the policy");
  }

  @ExceptionHandler(AccountNotFound.class)
  ResponseEntity<Object> accountNotFound(AccountNotFound e) {
    return problem(HttpStatus.NOT_FOUND, "account_not_found", "Account not found");
  }

  @ExceptionHandler(OwnAdminAccess.class)
  ResponseEntity<Object> ownAdminAccess(OwnAdminAccess e) {
    return problem(
        HttpStatus.CONFLICT,
        "own_admin_access",
        "Administrators cannot remove or disable their own access");
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

  private static ResponseEntity<Object> problem(HttpStatus status, String code, String title) {
    return ResponseEntity.status(status).body(detail(status, code, title));
  }

  private static ProblemDetail detail(HttpStatus status, String code, String title) {
    ProblemDetail detail = ProblemDetail.forStatus(status);
    detail.setTitle(title);
    detail.setProperty("code", code);
    return detail;
  }
}

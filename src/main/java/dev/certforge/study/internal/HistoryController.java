package dev.certforge.study.internal;

import dev.certforge.platform.Page;
import dev.certforge.study.internal.HistoryViews.AttemptHistoryItem;
import dev.certforge.study.internal.HistoryViews.MockExamHistoryItem;
import dev.certforge.study.internal.HistoryViews.SessionHistoryItem;
import dev.certforge.study.internal.MockExamViews.MockExamHistoryItem;
import java.util.UUID;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * The learner's study history. Attempt history contains answer keys (for answers already given), so
 * responses are {@code no-store}.
 */
@RestController
@RequestMapping("/api/study/history")
@PreAuthorize("hasAuthority('STUDY')")
class HistoryController {

  private final HistoryService service;
  private final MockExamHistoryService mockExamHistory;

  HistoryController(HistoryService service, MockExamHistoryService mockExamHistory) {
    this.service = service;
    this.mockExamHistory = mockExamHistory;
  }

  @GetMapping("/sessions")
  ResponseEntity<Page<SessionHistoryItem>> sessions(
      @RequestParam(required = false) String cursor, @RequestParam(required = false) Integer size) {
    return ResponseEntity.ok()
        .cacheControl(CacheControl.noStore())
        .body(service.sessions(cursor, size));
  }

  @GetMapping("/mock-exams")
  ResponseEntity<Page<MockExamHistoryItem>> mockExams(
      @RequestParam(required = false) String cursor, @RequestParam(required = false) Integer size) {
    return ResponseEntity.ok()
        .cacheControl(CacheControl.noStore())
        .body(service.mockExams(cursor, size));
  }

  @GetMapping("/mock-exams")
  ResponseEntity<Page<MockExamHistoryItem>> mockExams(
      @RequestParam(required = false) String cursor, @RequestParam(required = false) Integer size) {
    return ResponseEntity.ok()
        .cacheControl(CacheControl.noStore())
        .body(mockExamHistory.list(cursor, size));
  }

  @GetMapping("/attempts")
  ResponseEntity<Page<AttemptHistoryItem>> attempts(
      @RequestParam(required = false) UUID topicId,
      @RequestParam(required = false) UUID sessionId,
      @RequestParam(required = false) String cursor,
      @RequestParam(required = false) Integer size) {
    return ResponseEntity.ok()
        .cacheControl(CacheControl.noStore())
        .body(service.attempts(topicId, sessionId, cursor, size));
  }
}

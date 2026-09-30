package dev.certforge.preparationcatalog;

/** An active certification exam version. */
public record ExamVersionView(
    ExamVersionId id,
    String label,
    String examCode,
    String examName,
    int javaRelease,
    String objectivesUrl) {}

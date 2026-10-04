package dev.certforge.preparationcatalog;

/** An active certification exam version. */
public record ExamVersionView(
    TrackVersionId id,
    String label,
    String examCode,
    String examName,
    int javaRelease,
    String objectivesUrl) {}

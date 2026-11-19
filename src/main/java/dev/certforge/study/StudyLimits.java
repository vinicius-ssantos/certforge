package dev.certforge.study;

/** Read-only session policy for modules that offer study actions. */
public interface StudyLimits {

  /** The maximum number of questions accepted in a study session. */
  int maxQuestionCount();
}

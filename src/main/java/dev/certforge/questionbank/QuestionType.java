package dev.certforge.questionbank;

/** Question assessment modes supported by the reviewed question bank. */
public enum QuestionType {
  SINGLE_CHOICE,
  MULTIPLE_CHOICE,
  /** Free-form interview response evaluated by reviewed concept criteria, never binary grading. */
  GUIDED_RESPONSE
}

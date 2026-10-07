package dev.certforge.questionbank;

/**
 * The level at which an interview question is expected to be answered.
 *
 * <p>Not a difficulty. {@link Difficulty} says how hard a question is to get right; this says who
 * is expected to get it right, which is a different claim and is why they are separate fields. A
 * question can be HARD and PLENO -- hard for anyone, but fairly asked of a mid-level candidate --
 * and it can be EASY and SENIOR, where the answer is simple once you have seen the failure in
 * production.
 *
 * <p>Certification questions carry none: an exam objective is true or it is not, and there is no
 * level at which it is asked (ADR 0016 decision 5).
 */
public enum Seniority {
  PLENO,
  SENIOR
}

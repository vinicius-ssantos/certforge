/**
 * The line at which a topic stops needing attention.
 *
 * It is not a new number. `MockExamBlueprintCatalog` sets 68 as the pass mark for 1Z0-830, and
 * ADR 0015 records that the blueprint's figures are CertForge's own practice choices rather than
 * an Oracle-published weighting. Reusing it keeps the product saying one thing about what "good
 * enough" means, instead of inventing a second standard on the progress table.
 *
 * Two rules go with it. Every screen that applies this says the number out loud, because a
 * learner should never be judged by a threshold they cannot see. And it describes practice so
 * far — it is not a readiness forecast, a mastery claim or a probability of passing the real
 * exam, here or anywhere.
 *
 * It is stated here as well as on the server because no endpoint the learner can read exposes the
 * blueprint. If the blueprint's pass mark moves, this moves with it.
 */
export const PRACTICE_TARGET = 0.68;

/** Whether a topic's accuracy has reached the target. Topics with no attempts have no accuracy. */
export function meetsTarget(accuracy: number | null): boolean {
  return accuracy !== null && accuracy >= PRACTICE_TARGET;
}

/** The target as a whole-number percentage, for the sentence that states it. */
export const PRACTICE_TARGET_PERCENT = Math.round(PRACTICE_TARGET * 100);

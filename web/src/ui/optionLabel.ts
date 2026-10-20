/**
 * The letter beside an option, taken from where it appears rather than from the key the author gave
 * it.
 *
 * The server sends a learner's options in an order derived from their session, because the authored
 * order gave the answer away: no four-option question in the Java pack answers D. A badge showing
 * the authored key would put that order back on the screen and read "D, A, C, B" while doing it, so
 * the letter a learner sees counts the options in front of them. The key still travels with the
 * option and is what an answer submits; it is simply not what is shown.
 *
 * The editorial desk is the exception and keeps the authored key: a reviewer works with the letters
 * the pack and the review record use.
 */
export function optionLabel(index: number): string {
  return String.fromCharCode("A".charCodeAt(0) + index);
}

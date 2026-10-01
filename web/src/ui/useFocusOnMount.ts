import { useEffect, useRef } from "react";

/**
 * Moves focus to an element when it first appears. Used for headings that introduce new content
 * the learner must notice (the next question, the result of an answer), so keyboard focus and the
 * screen reader follow the change instead of staying on a control that has disappeared.
 */
export function useFocusOnMount<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);
  return ref;
}

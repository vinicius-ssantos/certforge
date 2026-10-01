import { useEffect } from "react";

/** Each page names itself, so the tab and screen readers announce where the learner is. */
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · CertForge`;
  }, [title]);
}

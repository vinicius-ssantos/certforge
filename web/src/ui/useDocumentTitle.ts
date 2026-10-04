import { useEffect } from "react";
import { useText } from "../i18n/useText";

/** Each page names itself, so the tab and screen readers announce where the learner is. */
export function useDocumentTitle(title: string) {
  const t = useText();
  useEffect(() => {
    document.title = t.documentTitle.suffix(title);
  }, [title, t]);
}

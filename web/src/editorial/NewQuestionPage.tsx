import { Link } from "react-router";
import { useHasAny } from "../auth/permissions";
import { useText } from "../i18n/useText";
import { EmptyState } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { RevisionEditor } from "./RevisionEditor";

export function NewQuestionPage() {
  const t = useText();
  useDocumentTitle(t.editorial.newQuestion);
  const canAuthor = useHasAny("CONTENT_AUTHOR");
  return (
    <>
      <p className="back">
        <Link to="/editorial">{t.editorial.backToQuestions}</Link>
      </p>
      <h1>{t.editorial.newQuestion}</h1>
      {canAuthor ? (
        <RevisionEditor />
      ) : (
        <EmptyState title={t.editorial.cannotAuthor}>
          <p>{t.editorial.cannotAuthorBody}</p>
        </EmptyState>
      )}
    </>
  );
}

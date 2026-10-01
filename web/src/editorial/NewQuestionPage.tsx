import { Link } from "react-router";
import { useHasAny } from "../auth/permissions";
import { EmptyState } from "../ui/States";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { RevisionEditor } from "./RevisionEditor";

export function NewQuestionPage() {
  useDocumentTitle("New question");
  const canAuthor = useHasAny("CONTENT_AUTHOR");
  return (
    <>
      <p>
        <Link to="/editorial">Back to questions</Link>
      </p>
      <h1>New question</h1>
      {canAuthor ? (
        <RevisionEditor />
      ) : (
        <EmptyState title="You cannot write questions">
          <p>Ask an administrator for the editor role.</p>
        </EmptyState>
      )}
    </>
  );
}

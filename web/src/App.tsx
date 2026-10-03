import { Route, Routes } from "react-router";
import { LoginPage } from "./auth/LoginPage";
import { RegisterPage } from "./auth/RegisterPage";
import { RequireAuth } from "./auth/RequireAuth";
import { TrackPage } from "./catalog/TrackPage";
import { TracksPage } from "./catalog/TracksPage";
import { CatalogPage } from "./editorial/CatalogPage";
import { CatalogTrackPage } from "./editorial/CatalogTrackPage";
import { NewQuestionPage } from "./editorial/NewQuestionPage";
import { QuestionPage } from "./editorial/QuestionPage";
import { QueuePage } from "./editorial/QueuePage";
import { RequireCatalogManage } from "./editorial/RequireCatalogManage";
import { RequireEditorial } from "./editorial/RequireEditorial";
import { HistoryPage } from "./history/HistoryPage";
import { SessionReviewPage } from "./history/SessionReviewPage";
import { ProgressPage } from "./progress/ProgressPage";
import { ReviewPage } from "./review/ReviewPage";
import { SessionPage } from "./study/SessionPage";
import { Layout } from "./ui/Layout";
import { EmptyState } from "./ui/States";
import { useDocumentTitle } from "./ui/useDocumentTitle";

function NotFound() {
  useDocumentTitle("Page not found");
  return (
    <>
      <h1>Page not found</h1>
      <EmptyState title="There is nothing at this address">
        <p>
          Go back to the <a href="/">list of tracks</a>.
        </p>
      </EmptyState>
    </>
  );
}

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<RequireAuth />}>
          <Route index element={<TracksPage />} />
          <Route path="/tracks/:slug" element={<TrackPage />} />
          <Route path="/sessions/:sessionId" element={<SessionPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/sessions/:sessionId" element={<SessionReviewPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route element={<RequireEditorial />}>
            <Route path="/editorial" element={<QueuePage />} />
            <Route path="/editorial/new" element={<NewQuestionPage />} />
            <Route path="/editorial/questions/:questionId" element={<QuestionPage />} />
            <Route element={<RequireCatalogManage />}>
              <Route path="/editorial/catalog" element={<CatalogPage />} />
              <Route path="/editorial/catalog/:trackId" element={<CatalogTrackPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

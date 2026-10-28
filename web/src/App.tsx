import { Route, Routes } from "react-router";
import { LoginPage } from "./auth/LoginPage";
import { RegisterPage } from "./auth/RegisterPage";
import { RequireAuth } from "./auth/RequireAuth";
import { GeneralTrackPage } from "./catalog/GeneralTrackPage";
import { TrackPage } from "./catalog/TrackPage";
import { TracksPage } from "./catalog/TracksPage";
import { CatalogPage } from "./editorial/CatalogPage";
import { CatalogTrackPage } from "./editorial/CatalogTrackPage";
import { NewQuestionPage } from "./editorial/NewQuestionPage";
import { QuestionPage } from "./editorial/QuestionPage";
import { QueuePage } from "./editorial/QueuePage";
import { ReviewQueuePage } from "./editorial/ReviewQueuePage";
import { RequireCatalogManage } from "./editorial/RequireCatalogManage";
import { RequireEditorial } from "./editorial/RequireEditorial";
import { HistoryPage } from "./history/HistoryPage";
import {
  BlueprintPage,
  BlueprintsPage,
  NewBlueprintPage,
} from "./interview/BlueprintPage";
import { EvidencePage } from "./interview/EvidencePage";
import { InterviewSessionPage } from "./interview/InterviewSessionPage";
import { InterviewsPage } from "./interview/InterviewsPage";
import { useText } from "./i18n/useText";
import { SessionReviewPage } from "./history/SessionReviewPage";
import { ProgressPage } from "./progress/ProgressPage";
import { MockExamPage } from "./mock/MockExamPage";
import { MockExamResultPage } from "./mock/MockExamResultPage";
import { ReviewPage } from "./review/ReviewPage";
import { SessionPage } from "./study/SessionPage";
import { Layout } from "./ui/Layout";
import { EmptyState } from "./ui/States";
import { useDocumentTitle } from "./ui/useDocumentTitle";

function NotFound() {
  const t = useText();
  useDocumentTitle(t.notFound.title);
  return (
    <>
      <h1>{t.notFound.title}</h1>
      <EmptyState title={t.notFound.emptyTitle}>
        <p>
          {t.notFound.bodyStart}
          <a href="/">{t.notFound.tracksLink}</a>.
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
          <Route path="/general-tracks/:slug" element={<GeneralTrackPage />} />
          <Route path="/sessions/:sessionId" element={<SessionPage />} />
          {/* Interview preparation. The blueprint routes come before the session route so a
              literal path is never read as a session id. */}
          <Route path="/interviews" element={<InterviewsPage />} />
          <Route path="/interviews/evidence" element={<EvidencePage />} />
          <Route path="/interviews/blueprints" element={<BlueprintsPage />} />
          <Route path="/interviews/blueprints/new" element={<NewBlueprintPage />} />
          <Route path="/interviews/blueprints/:blueprintId" element={<BlueprintPage />} />
          <Route path="/interviews/:sessionId" element={<InterviewSessionPage />} />
          <Route path="/mock-exams/:sessionId" element={<MockExamPage />} />
          <Route path="/mock-exams/:sessionId/result" element={<MockExamResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/sessions/:sessionId" element={<SessionReviewPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route element={<RequireEditorial />}>
            <Route path="/editorial" element={<QueuePage />} />
            <Route path="/editorial/new" element={<NewQuestionPage />} />
            <Route path="/editorial/review" element={<ReviewQueuePage />} />
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

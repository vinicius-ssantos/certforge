import { lazy } from "react";
import { Route, Routes } from "react-router";
import { LoginPage } from "./auth/LoginPage";
import { RegisterPage } from "./auth/RegisterPage";
import { GeneralTrackPage } from "./catalog/GeneralTrackPage";
import { RequireAuth } from "./auth/RequireAuth";

import { TrackPage } from "./catalog/TrackPage";
import { TracksPage } from "./catalog/TracksPage";
import { RequireCatalogManage } from "./editorial/RequireCatalogManage";
import { RequireEditorial } from "./editorial/RequireEditorial";
import { HistoryPage } from "./history/HistoryPage";
import { useText } from "./i18n/useText";
import { ProgressPage } from "./progress/ProgressPage";
import { ReviewPage } from "./review/ReviewPage";
import { Layout } from "./ui/Layout";
import { EmptyState } from "./ui/States";
import { useDocumentTitle } from "./ui/useDocumentTitle";

const CatalogPage = lazy(() => import("./editorial/CatalogPage").then((module) => ({ default: module.CatalogPage })));
const CatalogTrackPage = lazy(() => import("./editorial/CatalogTrackPage").then((module) => ({ default: module.CatalogTrackPage })));
const NewQuestionPage = lazy(() => import("./editorial/NewQuestionPage").then((module) => ({ default: module.NewQuestionPage })));
const QuestionPage = lazy(() => import("./editorial/QuestionPage").then((module) => ({ default: module.QuestionPage })));
const QueuePage = lazy(() => import("./editorial/QueuePage").then((module) => ({ default: module.QueuePage })));
const ReviewQueuePage = lazy(() => import("./editorial/ReviewQueuePage").then((module) => ({ default: module.ReviewQueuePage })));
const BlueprintPage = lazy(() => import("./interview/BlueprintPage").then((module) => ({ default: module.BlueprintPage })));
const BlueprintsPage = lazy(() => import("./interview/BlueprintPage").then((module) => ({ default: module.BlueprintsPage })));
const NewBlueprintPage = lazy(() => import("./interview/BlueprintPage").then((module) => ({ default: module.NewBlueprintPage })));
const EvidencePage = lazy(() => import("./interview/EvidencePage").then((module) => ({ default: module.EvidencePage })));
const InterviewSessionPage = lazy(() => import("./interview/InterviewSessionPage").then((module) => ({ default: module.InterviewSessionPage })));
const InterviewsPage = lazy(() => import("./interview/InterviewsPage").then((module) => ({ default: module.InterviewsPage })));
const SessionReviewPage = lazy(() => import("./history/SessionReviewPage").then((module) => ({ default: module.SessionReviewPage })));
const LabsPage = lazy(() => import("./labs/LabsPage").then((module) => ({ default: module.LabsPage })));
const LabSessionPage = lazy(() => import("./labs/LabSessionPage").then((module) => ({ default: module.LabSessionPage })));
const MockExamPage = lazy(() => import("./mock/MockExamPage").then((module) => ({ default: module.MockExamPage })));
const MockExamResultPage = lazy(() => import("./mock/MockExamResultPage").then((module) => ({ default: module.MockExamResultPage })));
const SessionPage = lazy(() => import("./study/SessionPage").then((module) => ({ default: module.SessionPage })));

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
          <Route path="/labs" element={<LabsPage />} />
          <Route path="/labs/sessions/:sessionId" element={<LabSessionPage />} />
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

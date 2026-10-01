import { Route, Routes } from "react-router";
import { LoginPage } from "./auth/LoginPage";
import { RegisterPage } from "./auth/RegisterPage";
import { RequireAuth } from "./auth/RequireAuth";
import { TrackPage } from "./catalog/TrackPage";
import { TracksPage } from "./catalog/TracksPage";
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
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

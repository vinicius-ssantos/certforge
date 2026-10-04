import { Navigate, Outlet, useLocation } from "react-router";
import { useText } from "../i18n/useText";
import { ErrorState, Loading } from "../ui/States";
import { useAuth } from "./AuthContext";

/** Everything below this route needs a signed-in learner; anyone else is sent to sign in. */
export function RequireAuth() {
  const t = useText();
  const { state, retry } = useAuth();
  const location = useLocation();

  if (state.status === "loading") {
    return <Loading label={t.auth.checkingSession} />;
  }
  if (state.status === "error") {
    return <ErrorState error={state.error} onRetry={retry} />;
  }
  if (state.status === "anonymous") {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }
  return <Outlet />;
}

import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { useText } from "../i18n/useText";
import { ErrorSummary, TextField } from "../ui/Form";
import { errorMessage } from "../ui/messages";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { useAuth } from "./AuthContext";

export function LoginPage() {
  const t = useText();
  useDocumentTitle(t.auth.signIn);
  const { state, login } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [failure, setFailure] = useState<string | null>(null);

  if (state.status === "authenticated") {
    return <Navigate to={from} replace />;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = t.auth.enterEmail;
    if (!password) errors.password = t.auth.enterPassword;
    setFieldErrors(errors);
    setFailure(null);
    if (Object.keys(errors).length > 0) {
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (error) {
      setFailure(errorMessage(error, t));
    } finally {
      setSubmitting(false);
    }
  }

  const problems = [
    ...(fieldErrors.email ? [{ fieldId: "login-email", message: fieldErrors.email }] : []),
    ...(fieldErrors.password ? [{ fieldId: "login-password", message: fieldErrors.password }] : []),
    ...(failure ? [{ message: failure }] : []),
  ];

  return (
    <div className="narrow">
      <h1>{t.auth.signIn}</h1>
      <ErrorSummary problems={problems} />
      <form onSubmit={(event) => void submit(event)} noValidate>
        <TextField
          id="login-email"
          label={t.auth.email}
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          error={fieldErrors.email}
        />
        <TextField
          id="login-password"
          label={t.auth.password}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? t.auth.signingIn : t.auth.signIn}
        </button>
      </form>
      <p>
        {t.auth.newHere} <Link to="/register">{t.auth.createOne}</Link>
      </p>
    </div>
  );
}

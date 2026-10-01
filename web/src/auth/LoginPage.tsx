import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation } from "react-router";
import { ErrorSummary, TextField } from "../ui/Form";
import { errorMessage } from "../ui/messages";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { useAuth } from "./AuthContext";

export function LoginPage() {
  useDocumentTitle("Sign in");
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
    if (!email.trim()) errors.email = "Enter your email address.";
    if (!password) errors.password = "Enter your password.";
    setFieldErrors(errors);
    setFailure(null);
    if (Object.keys(errors).length > 0) {
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
    } catch (error) {
      setFailure(errorMessage(error));
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
      <h1>Sign in</h1>
      <ErrorSummary problems={problems} />
      <form onSubmit={(event) => void submit(event)} noValidate>
        <TextField
          id="login-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          error={fieldErrors.email}
        />
        <TextField
          id="login-password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}

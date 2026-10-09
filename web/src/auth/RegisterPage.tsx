import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router";
import { useText } from "../i18n/useText";
import { ErrorSummary, TextField } from "../ui/Form";
import { errorMessage } from "../ui/messages";
import { useDocumentTitle } from "../ui/useDocumentTitle";
import { useAuth } from "./AuthContext";

/** Mirrors the backend rule so the learner finds out before sending; the server still decides. */
const MIN_PASSWORD_LENGTH = 12;

export function RegisterPage() {
  const t = useText();
  useDocumentTitle(t.auth.createAnAccount);
  const { state, register } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [failure, setFailure] = useState<string | null>(null);

  if (state.status === "authenticated") {
    return <Navigate to="/" replace />;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = t.auth.enterEmail;
    if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = t.auth.passwordTooShort(MIN_PASSWORD_LENGTH);
    }
    setFieldErrors(errors);
    setFailure(null);
    if (Object.keys(errors).length > 0) {
      return;
    }
    setSubmitting(true);
    try {
      await register(email.trim(), password);
    } catch (error) {
      setFailure(errorMessage(error, t));
    } finally {
      setSubmitting(false);
    }
  }

  /*
   * The rule, counted down as it is met. It rides in the field's hint, which is wired to the input
   * through `aria-describedby`: a screen reader reads it with the field rather than interrupting
   * on every keystroke, which a live region here would do. The error on submit stays the
   * authoritative announcement.
   *
   * The bar is an illustration of the count, not a strength rating — we do not grade anyone's
   * password, we report the one rule we have — so it is hidden from assistive technology and the
   * words carry the meaning.
   */
  const remaining = MIN_PASSWORD_LENGTH - password.length;
  const countdown =
    password.length === 0 ? null : (
      <>
        {remaining > 0 ? t.auth.passwordRemaining(remaining) : t.auth.passwordLongEnough}
        <span className="meter" aria-hidden="true">
          {Array.from({ length: MIN_PASSWORD_LENGTH }, (_, index) => (
            <i key={index} className={index < password.length ? "on" : undefined} />
          ))}
        </span>
      </>
    );

  const problems = [
    ...(fieldErrors.email ? [{ fieldId: "register-email", message: fieldErrors.email }] : []),
    ...(fieldErrors.password ? [{ fieldId: "register-password", message: fieldErrors.password }] : []),
    ...(failure ? [{ message: failure }] : []),
  ];

  return (
    <div className="narrow">
      <h1>{t.auth.createAnAccount}</h1>
      <ErrorSummary problems={problems} />
      <form onSubmit={(event) => void submit(event)} noValidate>
        <TextField
          id="register-email"
          label={t.auth.email}
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          error={fieldErrors.email}
        />
        <TextField
          id="register-password"
          label={t.auth.password}
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
          hint={t.auth.passwordHint(MIN_PASSWORD_LENGTH)}
          below={countdown}
        />
        <button type="submit" disabled={submitting}>
          {submitting ? t.auth.creatingAccount : t.auth.createAccount}
        </button>
      </form>
      <p>
        {t.auth.alreadyHaveAccount} <Link to="/login">{t.auth.signIn}</Link>
      </p>
    </div>
  );
}

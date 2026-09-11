import { useState } from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

import ErrorBanner from "../ErrorBanner";
import { auth as authApi } from "../../components/Api";

/*
 * POST /auth/forgot-password — body { email }. The backend always
 * responds success-shaped regardless of whether the email exists (a
 * timing-safe non-enumeration design), so this page shows one message
 * for any successful submission and never reveals account existence.
 */
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (busy) return;

    setBusy(true);
    setError(null);

    try {
      await authApi.forgotPassword(email);
      setSubmitted(true);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fm-auth-page">
      <Link to="/" className="fm-brand fm-auth-brand" style={{ textDecoration: "none" }}>
        <div className="fm-brand-mark">
          <Compass size={18} />
        </div>
        <div className="fm-brand-name fm-display">fidmap</div>
      </Link>

      <div className="fm-auth-card">
        <h1 className="fm-display fm-auth-title">Reset your password</h1>

        {submitted ? (
          <>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>
              If an account exists for <strong>{email}</strong>, we'll send a
              password reset link to that address shortly.
            </p>

            <p className="fm-auth-footer-line" style={{ marginTop: 16 }}>
              <Link to="/sign-in">Back to sign in</Link>
            </p>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginBottom: 16 }}>
              Enter the email address for your account and we'll send you a
              link to reset your password.
            </p>

            <ErrorBanner error={error} />

            <div className="fm-field">
              <label htmlFor="fp-email">Email</label>
              <input
                id="fp-email"
                type="email"
                placeholder="youremail@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                required
              />
            </div>

            <button
              type="submit"
              className="fm-btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={busy}
            >
              {busy ? "Sending…" : "Send reset link"}
            </button>

            <p className="fm-auth-footer-line">
              <Link to="/sign-in">Back to sign in</Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Compass, Eye, EyeOff } from "lucide-react";

import ErrorBanner from "../ErrorBanner";
import { auth as authApi, ApiError } from "../../components/Api";

const MIN_LENGTH = 8;

/*
 * /reset-password?token=... — POST /auth/reset-password, body
 * { token, newPassword } (confirmed against ResetPasswordRequest — the
 * backend has no confirmPassword field, so confirmation is a
 * client-side-only check before submitting). The token is read once from
 * the URL and never written to localStorage.
 */
const PasswordField = ({ id, label, value, onChange, autoComplete }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="fm-field">
      <label htmlFor={id}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          style={{ paddingRight: 34 }}
          required
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          style={{
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--ink-soft)",
            display: "flex",
            padding: 2,
          }}
        >
          {visible ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
};

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (busy) return;

    if (newPassword.length < MIN_LENGTH) {
      setError(new ApiError(`Password must be at least ${MIN_LENGTH} characters.`));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(new ApiError("New password and confirmation don't match."));
      return;
    }

    setBusy(true);
    setError(null);

    try {
      await authApi.resetPassword(token, newPassword);
      setSuccess(true);
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
        <h1 className="fm-display fm-auth-title">Choose a new password</h1>

        {!token ? (
          <>
            <ErrorBanner
              error={new ApiError("This reset link is missing or invalid.")}
            />
            <p className="fm-auth-footer-line" style={{ marginTop: 16 }}>
              <Link to="/forgot-password">Request a new reset link</Link>
            </p>
          </>
        ) : success ? (
          <>
            <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>
              Your password has been reset successfully. You can now sign in
              with your new password.
            </p>
            <button
              type="button"
              className="fm-btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: 16 }}
              onClick={() => navigate("/sign-in", { replace: true })}
            >
              Go to sign in
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <ErrorBanner error={error} />

            <PasswordField
              id="rp-new"
              label="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />

            <PasswordField
              id="rp-confirm"
              label="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />

            <p style={{ fontSize: 12, color: "var(--ink-soft)", marginBottom: 16 }}>
              Must be at least {MIN_LENGTH} characters.
            </p>

            <button
              type="submit"
              className="fm-btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={busy}
            >
              {busy ? "Resetting…" : "Reset password"}
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

export default ResetPassword;

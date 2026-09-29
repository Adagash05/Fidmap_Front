import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import ErrorBanner from "../ErrorBanner";
import { useAuth } from "../../hooks/useAuth";
import Seo from "../../components/Seo";

/*
 * Reuses the existing staff login (useAuth().login -> POST /auth/log-in)
 * rather than a separate partner auth system — verified against the real
 * backend: a partner is a plain `User` with role Role.PARTNER, the exact
 * same JWT as everyone else (see PartnerProtectedRoute.jsx for the
 * SecurityConfig/PartnerDashboardController evidence). This page exists
 * only to give partners their own on-brand entry point; the mechanics are
 * identical to Login.jsx.
 *
 * Always navigates to /partner/dashboard on success — PartnerProtectedRoute
 * is the authoritative check and will bounce a non-partner staff user to
 * their own /dashboard instead.
 */
const PartnerSignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (busy) return;

    setBusy(true);
    setError(null);

    try {
      await login(email, password);
      navigate("/partner/dashboard", { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fm-auth-page">
      <Seo
        title="Partner sign in"
        description="Sign in to your FIDMAP partner account."
        path="/partner/sign-in"
        noIndex
      />

      <Link
        to="/"
        className="fm-brand fm-auth-brand"
        style={{ textDecoration: "none" }}
      >
        <div className="fm-brand-mark">
          <img src="/logo.svg" alt="FIDMAP" />
        </div>
        <div className="fm-brand-name fm-display">fidmap</div>
      </Link>

      <form className="fm-auth-card" onSubmit={handleSubmit}>
        <h1 className="fm-display fm-auth-title">Partner sign in</h1>
        <p className="fm-auth-subtitle">
          For FIDMAP referral partners — same account you activated from
          your invitation.
        </p>

        <ErrorBanner error={error} />

        <div className="fm-field">
          <label htmlFor="partner-email">Email</label>
          <input
            id="partner-email"
            type="email"
            name="email"
            placeholder="youremail@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            required
          />
        </div>

        <div className="fm-field">
          <label htmlFor="partner-password">Password</label>
          <input
            id="partner-password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="fm-btn-primary"
          style={{ width: "100%", justifyContent: "center" }}
          disabled={busy}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <p className="fm-auth-footer-line">
          Invited as a partner?{" "}
          <Link to="/partner/accept-invitation">Accept your invitation</Link>
        </p>
      </form>
    </div>
  );
};

export default PartnerSignIn;

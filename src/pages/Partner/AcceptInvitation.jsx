import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

import ErrorBanner from "../ErrorBanner";
import Seo from "../../components/Seo";
import { partnerAuth as partnerAuthApi } from "../../components/Api";

// POST /api/partner/auth/accept-invitation — verified against the real
// backend (uploaded 2026-09-27): SecurityConfig already whitelists this
// exact path as public, and PartnerAuthService.acceptInvitation(token,
// password) fully implements the logic (creates a User with
// role=PARTNER, links it to the ReferralPartner, marks the invitation
// accepted) — but no @RestController maps any path to that method yet,
// so this will 404 until that one @PostMapping is added. The invitation
// token travels only as a URL query param and is read once here; it's
// never stored or forwarded anywhere else.
const AcceptInvitation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  const mismatch =
    confirmPassword.length > 0 && password !== confirmPassword;
  const valid = token && password.length >= 8 && password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (busy || !valid) return;

    setBusy(true);
    setError(null);

    try {
      await partnerAuthApi.acceptInvitation(token, password);
      setDone(true);
      setTimeout(() => navigate("/partner/sign-in", { replace: true }), 1200);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fm-auth-page">
      <Seo
        title="Accept partner invitation"
        description="Set a password to activate your FIDMAP partner account."
        path="/partner/accept-invitation"
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

      <div className="fm-auth-card">
        <h1 className="fm-display fm-auth-title">Activate your account</h1>
        <p className="fm-auth-subtitle">
          Set a password to finish setting up your FIDMAP partner account.
        </p>

        {!token && (
          <ErrorBanner
            error={{
              message:
                "This link is missing its invitation token. Ask FIDMAP to resend your invitation.",
            }}
          />
        )}

        <ErrorBanner error={error} />

        {done ? (
          <p style={{ fontSize: 13.5, color: "var(--fm-success)" }}>
            Account activated — taking you to sign in…
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="fm-field">
              <label htmlFor="invite-password">Password</label>
              <input
                id="invite-password"
                type="password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={!token}
                required
              />
            </div>

            <div className="fm-field">
              <label htmlFor="invite-confirm">Confirm password</label>
              <input
                id="invite-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={!token}
                required
              />
              {mismatch && (
                <p
                  style={{ fontSize: 12, color: "var(--fm-danger)", marginTop: 6 }}
                >
                  Passwords don't match.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="fm-btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={busy || !valid}
            >
              {busy ? "Activating…" : "Activate account"}
            </button>
          </form>
        )}

        <p className="fm-auth-footer-line">
          Already activated? <Link to="/partner/sign-in">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default AcceptInvitation;

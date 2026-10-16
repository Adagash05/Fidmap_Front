import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Seo from "../components/Seo";
import ErrorBanner from "./ErrorBanner";
import { invitations as invitationsApi } from "../components/Api";
import { useAsync } from "../hooks/useAsync";

/* /accept-invite?token=... — a teammate sets their name and password. */
const AcceptTeamInvite = () => {
  const [params] = useSearchParams();
  const token = params.get("token");

  const { data: preview, loading, error } = useAsync(
    () => (token ? invitationsApi.preview(token) : Promise.reject(new Error("missing"))),
    [token],
  );

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [done, setDone] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setSubmitError(null);
    try {
      await invitationsApi.accept({ token, fullName: fullName.trim(), password });
      setDone(true);
    } catch (e) {
      setSubmitError(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fm-auth-page">
      <Seo title="FIDMAP" description="FIDMAP" path={typeof window !== "undefined" ? window.location.pathname : "/"} noIndex />
      <div className="fm-auth-card">
        <h1 className="fm-auth-title">Join your team</h1>

        {loading && <div className="fm-loading">Checking invitation…</div>}
        {!token && <p className="fm-auth-subtitle">This invitation link is not valid.</p>}
        {token && error && <p className="fm-auth-subtitle">{error.message || "This invitation link is not valid."}</p>}

        {done && (
          <>
            <p className="fm-auth-subtitle">Your account is ready.</p>
            <Link to="/sign-in" className="fm-btn-primary">Sign in</Link>
          </>
        )}

        {preview && !done && (
          <form onSubmit={submit}>
            <p className="fm-auth-subtitle">
              You&apos;ve been invited to <strong>{preview.workspaceName}</strong> as {preview.role.toLowerCase()} ({preview.email}).
            </p>
            <ErrorBanner error={submitError} />
            <div className="fm-field">
              <label htmlFor="ai-name">Your name</label>
              <input id="ai-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={120} />
            </div>
            <div className="fm-field">
              <label htmlFor="ai-pass">Password (8+ characters)</label>
              <input id="ai-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} maxLength={128} autoComplete="new-password" />
            </div>
            <button type="submit" className="fm-btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>
              {busy ? "Creating…" : "Create my account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AcceptTeamInvite;

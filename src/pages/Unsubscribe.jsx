import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import Seo from "../components/Seo";
import ErrorBanner from "./ErrorBanner";
import { notifications as notificationsApi } from "../components/Api";

/* /unsubscribe?token=... — one-click, no sign-in. Confirms before acting so email scanners that pre-fetch links cannot unsubscribe anyone. */
const Unsubscribe = () => {
  const [params] = useSearchParams();
  const token = params.get("token");

  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const confirm = async () => {
    setBusy(true);
    setError(null);
    try {
      await notificationsApi.unsubscribe(token);
      setDone(true);
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fm-auth-page">
      <Seo title="FIDMAP" description="FIDMAP" path={typeof window !== "undefined" ? window.location.pathname : "/"} noIndex />
      <div className="fm-auth-card">
        <h1 className="fm-auth-title">Email updates</h1>

        {!token && <p className="fm-auth-subtitle">This unsubscribe link is not valid.</p>}

        {token && !done && (
          <>
            <p className="fm-auth-subtitle">Stop receiving updates about this request?</p>
            <ErrorBanner error={error} />
            <button type="button" className="fm-btn-primary" onClick={confirm} disabled={busy}>
              {busy ? "Working…" : "Unsubscribe"}
            </button>
          </>
        )}

        {done && <p className="fm-auth-subtitle">You have been unsubscribed. You will not get further emails about this request.</p>}
      </div>
    </div>
  );
};

export default Unsubscribe;

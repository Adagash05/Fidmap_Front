import { useState } from "react";
import { X } from "lucide-react";

import ErrorBanner from "../pages/ErrorBanner";
import { useAuth } from "../hooks/useAuth";

/*
 * Quick staff sign-in from anywhere in the app (opened from Header).
 * Uses the same AuthContext.login() as the dedicated /login page.
 */
const LoginModal = ({ onClose, onLoggedIn }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    if (busy) return;

    setBusy(true);
    setError(null);

    try {
      await login(email, password);
      onLoggedIn?.();
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fm-overlay" onClick={onClose}>
      <div className="fm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fm-modal-head">
          <div className="fm-display" style={{ fontWeight: 700, fontSize: 16 }}>
            Staff sign in
          </div>

          <button className="fm-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <ErrorBanner error={error} />

        <div className="fm-field">
          <label htmlFor="lg-email">Email</label>
          <input
            id="lg-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="fm-field">
          <label htmlFor="lg-pw">Password</label>
          <input
            id="lg-pw"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="fm-btn-primary"
          style={{ width: "100%", justifyContent: "center" }}
          disabled={busy}
          onClick={submit}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </div>
    </div>
  );
};

export default LoginModal;

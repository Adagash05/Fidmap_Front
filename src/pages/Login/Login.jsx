import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Compass } from "lucide-react";

import ErrorBanner from "../ErrorBanner";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const redirectTo = location.state?.from?.pathname || "/dashboard";

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
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fm-auth-page">
      <Link
        to="/"
        className="fm-brand fm-auth-brand"
        style={{ textDecoration: "none" }}
      >
        <div className="fm-brand-mark">
          <Compass size={18} />
        </div>
        <div className="fm-brand-name fm-display">fidmap</div>
      </Link>

      <form className="fm-auth-card" onSubmit={handleSubmit}>
        <h1 className="fm-display fm-auth-title">Staff sign in</h1>

        <ErrorBanner error={error} />

        <div className="fm-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
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
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div style={{ textAlign: "right", marginTop: 6 }}>
            <Link to="/forgot-password" style={{ fontSize: 12.5 }}>
              Forgot password?
            </Link>
          </div>
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
          Need a workspace? <Link to="/register">Create one</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

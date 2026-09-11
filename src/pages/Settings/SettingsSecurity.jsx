import { useState } from "react";
import { Eye, EyeOff, Check, X as XIcon } from "lucide-react";

import ErrorBanner from "../ErrorBanner";
import { users as usersApi, ApiError } from "../../components/Api";

/*
 * Security tab: change password. Split out of the old crowded "General"
 * tab into its own section, with password requirements shown up front,
 * show/hide toggles, and client-side checks (length/match) before ever
 * hitting the backend — the backend (PUT /feedback/user/change-password)
 * remains the actual source of truth for validity (wrong current
 * password, policy rules, etc.), surfaced via the same ErrorBanner
 * pattern used everywhere else in the app.
 */
const MIN_LENGTH = 8;

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

const Requirement = ({ met, children }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      fontSize: 12,
      color: met ? "var(--moss)" : "var(--ink-soft)",
    }}
  >
    {met ? <Check size={12} /> : <XIcon size={12} />}
    {children}
  </div>
);

const SettingsSecurity = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const lengthOk = newPassword.length >= MIN_LENGTH;
  const matchOk = newPassword.length > 0 && newPassword === confirmPassword;
  const differsFromCurrent =
    newPassword.length === 0 || newPassword !== currentPassword;

  const canSubmit =
    currentPassword && newPassword && confirmPassword && lengthOk && matchOk;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (busy || !canSubmit) return;

    if (!differsFromCurrent) {
      setError(new ApiError("New password must be different from your current password."));
      return;
    }

    setBusy(true);
    setError(null);
    setSuccess(false);

    try {
      await usersApi.changePassword({ currentPassword, newPassword, confirmPassword });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="fm-stat-card" style={{ marginBottom: 12, maxWidth: 420 }}>
      <div style={{ width: "100%" }}>
        <div className="fm-stat-label" style={{ marginBottom: 2 }}>
          Change password
        </div>
        <p style={{ fontSize: 12.5, color: "var(--ink-soft)", margin: "0 0 14px" }}>
          Choose a strong password you don't use anywhere else.
        </p>

        <ErrorBanner error={error} />

        {success && (
          <div style={{ fontSize: 12.5, color: "var(--moss)", marginBottom: 12 }}>
            Password changed successfully.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <PasswordField
            id="pw-current"
            label="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            autoComplete="current-password"
          />

          <PasswordField
            id="pw-new"
            label="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            autoComplete="new-password"
          />

          <PasswordField
            id="pw-confirm"
            label="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 4, margin: "4px 0 16px" }}>
            <Requirement met={lengthOk}>At least {MIN_LENGTH} characters</Requirement>
            <Requirement met={matchOk}>Passwords match</Requirement>
          </div>

          <button type="submit" className="fm-btn-primary" disabled={busy || !canSubmit}>
            {busy ? "Changing…" : "Change password"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default SettingsSecurity;

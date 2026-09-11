import { useState } from "react";
import { X } from "lucide-react";

import ErrorBanner from "../pages/ErrorBanner";

/*
 * Add a workspace user. Name, email, and password — the backend now
 * actually hashes and persists the password (fixed since the last
 * audit), so the new account can sign in immediately. No role picker:
 * the create endpoint still hardcodes every new user to MEMBER
 * server-side regardless of what's sent, so offering a choice here would
 * be a control that does nothing — see BACKEND_FIXES.md. Role can be
 * changed afterward via Edit, which does respect it.
 *
 * `maxTeamMembers`/`currentMemberCount` are informational + a client-side
 * guard against the workspace's plan entitlement (Plan.maxTeamMembers) —
 * the backend's own PlanLimitExceededException remains the actual
 * enforcement if this is ever stale.
 */
const CreateUserModal = ({
  onClose,
  onSubmit,
  maxTeamMembers,
  currentMemberCount,
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const atLimit =
    typeof maxTeamMembers === "number" &&
    typeof currentMemberCount === "number" &&
    currentMemberCount >= maxTeamMembers;

  const valid =
    fullName.trim() && email.trim() && password.length >= 8 && !atLimit;

  const submit = async (e) => {
    e.preventDefault();

    if (busy || !valid) return;

    setBusy(true);
    setError(null);

    try {
      await onSubmit({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
      });
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  };

  return (
    <div className="fm-overlay" onClick={onClose}>
      <div className="fm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fm-modal-head">
          <div className="fm-display" style={{ fontWeight: 700, fontSize: 16 }}>
            Add team member
          </div>

          <button className="fm-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {typeof maxTeamMembers === "number" && (
          <p
            style={{
              fontSize: 12,
              color: "var(--ink-soft)",
              marginTop: -6,
              marginBottom: 14,
            }}
          >
            Your current plan allows a maximum of {maxTeamMembers} team members.
          </p>
        )}

        <ErrorBanner error={error} />

        {atLimit ? (
          <p style={{ fontSize: 13, color: "var(--brick)", marginBottom: 16 }}>
            You've reached your plan's team member limit. Upgrade to add more.
          </p>
        ) : (
          <form onSubmit={submit}>
            <div className="fm-field">
              <label htmlFor="user-name">Full name</label>
              <input
                id="user-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jordan Lee"
                autoFocus
                autoComplete="off"
                required
              />
            </div>

            <div className="fm-field">
              <label htmlFor="user-email">Email</label>
              <input
                id="user-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@company.com"
                autoComplete="off"
                required
              />
            </div>

            <div className="fm-field">
              <label htmlFor="user-password">Temporary password</label>
              <input
                id="user-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                minLength={8}
                autoComplete="new-password"
                required
              />
            </div>

            <p
              style={{
                fontSize: 12,
                color: "var(--ink-soft)",
                marginTop: -4,
                marginBottom: 16,
              }}
            >
              New members are added with Member access. Share this password with
              them directly — there's no invite email yet.
            </p>

            <button
              type="submit"
              className="fm-btn-primary"
              style={{ width: "100%", justifyContent: "center" }}
              disabled={busy || !valid}
            >
              {busy ? "Adding…" : "Add member"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateUserModal;

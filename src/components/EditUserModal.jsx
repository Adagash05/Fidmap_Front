import { useState } from "react";
import { X } from "lucide-react";

import ErrorBanner from "../pages/ErrorBanner";

/*
 * Edit a workspace user's name, email, and role. OWNER is deliberately
 * not offered as a role choice here — editUserInWorkspace doesn't
 * restrict which roles can be assigned, so a generic edit form could
 * accidentally hand off workspace ownership; that's a significant enough
 * action to deserve its own explicit flow, not a dropdown in a general
 * edit form.
 */
const EditUserModal = ({ user, onClose, onSubmit }) => {
  const [fullName, setFullName] = useState(user.fullName || "");
  const [email, setEmail] = useState(user.email || "");
  const [role, setRole] = useState(
    user.role === "OWNER" ? "ADMIN" : user.role || "MEMBER",
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();

    if (busy || !fullName.trim() || !email.trim()) return;

    setBusy(true);
    setError(null);

    try {
      await onSubmit({ fullName: fullName.trim(), email: email.trim(), role });
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
            Edit team member
          </div>

          <button className="fm-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <ErrorBanner error={error} />

        <form onSubmit={submit}>
          <div className="fm-field">
            <label htmlFor="edit-user-name">Full name</label>
            <input
              id="edit-user-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="fm-field">
            <label htmlFor="edit-user-email">Email</label>
            <input
              id="edit-user-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {user.role !== "OWNER" && (
            <div className="fm-field">
              <label htmlFor="edit-user-role">Role</label>
              <select
                id="edit-user-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="ADMIN">Admin</option>
                <option value="MEMBER">Member</option>
              </select>
            </div>
          )}

          {user.role === "OWNER" && (
            <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: -4, marginBottom: 16 }}>
              This person owns the workspace — role can't be changed here.
            </p>
          )}

          <button
            type="submit"
            className="fm-btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={busy || !fullName.trim() || !email.trim()}
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;

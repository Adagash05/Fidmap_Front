import { Link } from "react-router-dom";
import { ArrowRight, Copy, ExternalLink, LogOut, Pencil } from "lucide-react";
import { useState } from "react";

import ErrorBanner from "../ErrorBanner";
import { users as usersApi, WORKSPACE_ID } from "../../components/Api";
import { useAuth } from "../../hooks/useAuth";

/*
 * Profile tab: who's signed in + which workspace they're in. Password
 * management lives in the separate Security tab (SettingsSecurity.jsx) —
 * previously both were crammed into one "General" tab.
 *
 * Editing name/email: only OWNER can actually save a change here.
 * UserService.editUserInWorkspace() checks the CALLER's own role must be
 * OWNER — regardless of which userId is being edited, including their
 * own — so ADMIN/MEMBER have no working self-edit endpoint on the
 * backend at all. Rather than wire a form that always fails for them,
 * their info is shown read-only with an explanation. See
 * BACKEND_FIXES.md for the recommended backend fix (a real self-service
 * "edit my own profile" endpoint, not gated by role).
 */
const SettingsProfile = ({ currentUser, workspace, boardCount, onSignOut }) => {
  const { refreshUser } = useAuth();

  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(currentUser?.fullName || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const canEditSelf = currentUser?.role === "OWNER";

  // Settings displays the signed-in user's first name, not their full
  // name — derived from the existing currentUser.fullName (AuthContext's
  // GET /feedback/user/me), never from the email address. "Unknown" is
  // only the fallback for when no usable first name can be derived
  // (fullName missing/blank), not a default shown before checking.
  const firstName = currentUser?.fullName?.trim().split(/\s+/)[0] || null;

  const startEdit = () => {
    setFullName(currentUser?.fullName || "");
    setEmail(currentUser?.email || "");
    setError(null);
    setSuccess(false);
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (busy) return;

    setBusy(true);
    setError(null);

    try {
      await usersApi.update(currentUser.id, {
        fullName,
        email,
        role: currentUser.role,
      });

      await refreshUser();
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err);
    } finally {
      setBusy(false);
    }
  };

  const rootDomain = import.meta.env.VITE_ROOT_DOMAIN;

  const portalUrl = !workspace?.slug
    ? null
    : rootDomain
      ? `https://${workspace.slug}.${rootDomain}`
      : `${window.location.origin}/p/${workspace.slug}`;

  const copyPortalUrl = () => {
    if (!portalUrl) return;
    navigator.clipboard.writeText(portalUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <>
      <section className="fm-stat-card" style={{ marginBottom: 12 }}>
        <div style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
            }}
          >
            <div className="fm-stat-label" style={{ marginBottom: 6 }}>
              {editing ? "Edit profile" : "Signed in as"}
            </div>

            {!editing && canEditSelf && (
              <button
                type="button"
                className="fm-btn-ghost"
                style={{ padding: "4px 8px" }}
                onClick={startEdit}
              >
                <Pencil size={12} />
                Edit
              </button>
            )}
          </div>

          {success && (
            <div style={{ fontSize: 12.5, color: "var(--moss)", marginBottom: 8 }}>
              Profile updated.
            </div>
          )}

          {editing ? (
            <form onSubmit={handleSave}>
              <ErrorBanner error={error} />

              <div className="fm-field">
                <label htmlFor="profile-name">Full name</label>
                <input
                  id="profile-name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="fm-field">
                <label htmlFor="profile-email">Email</label>
                <input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  className="fm-btn-ghost"
                  onClick={() => setEditing(false)}
                  disabled={busy}
                >
                  Cancel
                </button>

                <button type="submit" className="fm-btn-primary" disabled={busy}>
                  {busy ? "Saving…" : "Save changes"}
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="fm-stat-value" style={{ fontSize: 16 }}>
                {firstName || "Unknown"}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>
                {currentUser?.email || "—"}
              </div>
              {currentUser?.role && (
                <span
                  className="fm-visibility-tag"
                  style={{ marginTop: 8, display: "inline-flex" }}
                >
                  {currentUser.role}
                </span>
              )}

              {!canEditSelf && (
                <div
                  style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 8 }}
                >
                  Contact your workspace owner to update your name or email.
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="fm-stat-card" style={{ marginBottom: 12 }}>
        <div style={{ width: "100%" }}>
          <div className="fm-stat-label" style={{ marginBottom: 6 }}>
            Workspace
          </div>
          <div className="fm-stat-value" style={{ fontSize: 16 }}>
            {workspace?.name || `Workspace #${WORKSPACE_ID}`}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>
            {boardCount} board{boardCount === 1 ? "" : "s"}
          </div>
        </div>
      </section>

      <section className="fm-stat-card" style={{ marginBottom: 12 }}>
        <div style={{ width: "100%" }}>
          <div className="fm-stat-label" style={{ marginBottom: 6 }}>
            Slug
          </div>
          <div className="fm-stat-value fm-mono" style={{ fontSize: 15 }}>
            {workspace?.slug || "—"}
          </div>

          {portalUrl && (
            <>
              <div
                style={{
                  fontSize: 12.5,
                  color: "var(--ink-soft)",
                  marginTop: 8,
                  marginBottom: 4,
                }}
              >
                Public portal
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <code style={{ fontSize: 12.5 }}>{portalUrl}</code>

                <button
                  type="button"
                  className="fm-btn-ghost"
                  style={{ padding: "4px 8px" }}
                  onClick={copyPortalUrl}
                >
                  <Copy size={12} />
                  {copied ? "Copied" : "Copy"}
                </button>

                <a
                  href={portalUrl}
                  className="fm-btn-ghost"
                  style={{ padding: "4px 8px" }}
                  target="_blank"
                  rel="noreferrer"
                >
                  <ExternalLink size={12} />
                  Open
                </a>
              </div>
            </>
          )}
        </div>
      </section>

      <Link
        to="/boards"
        className="fm-btn-ghost"
        style={{ marginBottom: 20, display: "inline-flex" }}
      >
        Manage boards <ArrowRight size={14} />
      </Link>

      <div>
        <button type="button" className="fm-btn-ghost" onClick={onSignOut}>
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </>
  );
};

export default SettingsProfile;

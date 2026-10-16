import { useState } from "react";

import ErrorBanner from "../ErrorBanner";
import { invitations as invitationsApi } from "../../components/Api";
import { useAsync } from "../../hooks/useAsync";

/*
 * Invite teammates by email. The invitee receives a single-use link (valid
 * 7 days) and sets their own name and password — no password is ever shared.
 */
const TeamInvitations = ({ workspaceId, isOwner }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const { data, loading, error: loadError, reload } = useAsync(
    () => (workspaceId ? invitationsApi.list(workspaceId) : Promise.resolve([])),
    [workspaceId],
  );

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const created = await invitationsApi.create(workspaceId, { email: email.trim(), role });
      setNotice(
        created.emailSent
          ? `Invitation sent to ${created.email}.`
          : `Invitation created, but the email could not be sent. Use “Resend” to try again.`,
      );
      setEmail("");
      reload();
    } catch (e) {
      setError(e);
    } finally {
      setBusy(false);
    }
  };

  const act = async (fn, message) => {
    setError(null);
    setNotice(null);
    try {
      const result = await fn();
      if (message) setNotice(typeof message === "function" ? message(result) : message);
      reload();
    } catch (e) {
      setError(e);
    }
  };

  const list = data || [];

  return (
    <section style={{ marginTop: 28 }}>
      <h3 className="fm-display" style={{ fontSize: 15 }}>Invite by email</h3>

      <ErrorBanner error={error || loadError} onRetry={reload} />
      {notice && <div className="fm-x-notice">{notice}</div>}

      <form onSubmit={submit} className="fm-field-row" style={{ alignItems: "flex-end" }}>
        <div className="fm-field" style={{ flex: 3 }}>
          <label htmlFor="inv-email">Email</label>
          <input id="inv-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="fm-field">
          <label htmlFor="inv-role">Role</label>
          <select id="inv-role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="MEMBER">Member</option>
            {isOwner && <option value="ADMIN">Admin</option>}
          </select>
        </div>
        <button type="submit" className="fm-btn-primary" disabled={busy} style={{ marginBottom: 14 }}>
          {busy ? "Sending…" : "Send invite"}
        </button>
      </form>

      {loading && !data && <div className="fm-loading">Loading invitations…</div>}

      {list.length > 0 && (
        <div className="fm-table-wrap">
          <table className="fm-table">
            <thead>
              <tr><th>Email</th><th>Role</th><th>Status</th><th>Expires</th><th /></tr>
            </thead>
            <tbody>
              {list.map((i) => (
                <tr key={i.id}>
                  <td>{i.email}</td>
                  <td>{i.role.toLowerCase()}</td>
                  <td>{i.status === "PENDING" && i.expired ? "expired" : i.status.toLowerCase()}</td>
                  <td>{new Date(i.expiresAt).toLocaleDateString()}</td>
                  <td>
                    {i.status === "PENDING" && (
                      <>
                        <button type="button" className="fm-btn-ghost" onClick={() => act(() => invitationsApi.resend(i.id), (r) => (r.emailSent ? "Invitation re-sent." : "Could not send the email; try again later."))}>
                          Resend
                        </button>
                        <button type="button" className="fm-btn-ghost" onClick={() => act(() => invitationsApi.revoke(i.id), "Invitation revoked.")}>
                          Revoke
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default TeamInvitations;

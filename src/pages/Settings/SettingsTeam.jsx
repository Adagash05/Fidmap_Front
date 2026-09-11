import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";

import ErrorBanner from "../ErrorBanner";
import EmptyState from "../../components/EmptyState";
import CreateUserModal from "../../components/CreateUserModal";
import EditUserModal from "../../components/EditUserModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import PlanLimitNotice from "../../components/PlanLimitNotice";
import { users as usersApi } from "../../components/Api";
import { useAuth } from "../../hooks/useAuth";
import {
  useEntitlements,
  isAtLimit,
  formatUsage,
  limitReachedMessage,
  isStartupTier,
} from "../../hooks/useEntitlements";

/*
 * Settings > Team. Create/view/edit/delete workspace users against the
 * real backend contract — see Api.js's `users` export for exact endpoint
 * notes and known backend quirks/bugs (most notably: UserController
 * currently has an ambiguous duplicate mapping on the edit endpoint,
 * which likely prevents the backend from starting at all — see
 * BACKEND_FIXES.md. This UI is implemented against the intended contract
 * and will work once that's fixed.)
 *
 * The backend restricts create/list/edit/delete to the workspace OWNER
 * and returns an error for anyone else. Settings.jsx now also gates this
 * tab's visibility on currentUser.role === "OWNER" client-side (UX only —
 * the backend remains the real boundary), so by the time this component
 * renders the signed-in user should already be an owner; any error here
 * still surfaces via ErrorBanner regardless.
 *
 * Team-member limit (maxTeamMembers) comes from the shared
 * useEntitlements() hook — the same one Boards/Roadmap/Changelog use — so
 * this doesn't keep its own copy of what each plan allows.
 */
const ROLE_LABEL = { OWNER: "Owner", ADMIN: "Admin", MEMBER: "Member" };

const SettingsTeam = ({ workspaceId }) => {
  const { currentUser } = useAuth();
  const { entitlements } = useEntitlements(workspaceId);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(0);

  const [showCreate, setShowCreate] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  useEffect(() => {
    if (!workspaceId) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);

      try {
        const list = await usersApi.list(workspaceId);
        if (!cancelled) {
          setMembers(list || []);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [workspaceId, reload]);

  const retry = () => setReload((v) => v + 1);

  const handleCreate = async (data) => {
    await usersApi.create(workspaceId, data);
    setShowCreate(false);
    retry();
  };

  const handleEdit = async (data) => {
    await usersApi.update(editingUser.id, data);
    setEditingUser(null);
    retry();
  };

  const handleDelete = async () => {
    await usersApi.remove(deletingUser.id);
    setDeletingUser(null);
    retry();
  };

  const maxTeamMembers = entitlements?.maxTeamMembers;
  const memberLimitReached = isAtLimit(members.length, maxTeamMembers);

  return (
    <section>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div className="fm-stat-label" style={{ marginBottom: 2 }}>Team</div>
          <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>
            People with staff access to this workspace.
            {entitlements && ` ${formatUsage(members.length, maxTeamMembers)} used.`}
          </div>
        </div>

        <button
          type="button"
          className="fm-btn-primary"
          onClick={() => setShowCreate(true)}
          disabled={memberLimitReached}
          title={memberLimitReached ? "Team member limit reached for your plan" : undefined}
        >
          <Plus size={14} />
          Add member
        </button>
      </div>

      {memberLimitReached && (
        <PlanLimitNotice
          message={limitReachedMessage(maxTeamMembers, "team members")}
          showUpgrade={isStartupTier(entitlements)}
        />
      )}

      <ErrorBanner error={error} onRetry={retry} />

      {loading && <div className="fm-loading">Loading team…</div>}

      {!loading && members.length === 0 && !error && (
        <EmptyState
          title="No team members yet"
          description="Add a teammate to give them staff access to this workspace."
          action={
            <button type="button" className="fm-btn-primary" onClick={() => setShowCreate(true)}>
              <Plus size={14} />
              Add member
            </button>
          }
        />
      )}

      {!loading && members.length > 0 && (
        <div style={{ border: "1px solid var(--line)", borderRadius: 10, overflow: "hidden" }}>
          {members.map((member, i) => (
            <div
              key={member.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                borderTop: i === 0 ? "none" : "1px solid var(--line)",
                background: "#fff",
              }}
            >
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                  {member.fullName}
                  {currentUser?.id === member.id && (
                    <span style={{ color: "var(--ink-soft)", fontWeight: 500 }}>(you)</span>
                  )}
                  {member.role && (
                    <span className="fm-visibility-tag private" style={{ textTransform: "none" }}>
                      {ROLE_LABEL[member.role] || member.role}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{member.email}</div>
              </div>

              <div style={{ display: "flex", gap: 6 }}>
                <button
                  type="button"
                  className="fm-btn-ghost"
                  style={{ padding: "6px 10px" }}
                  onClick={() => setEditingUser(member)}
                >
                  <Pencil size={13} />
                  Edit
                </button>

                <button
                  type="button"
                  className="fm-btn-ghost fm-btn-danger"
                  style={{ padding: "6px 10px" }}
                  onClick={() => setDeletingUser(member)}
                  disabled={currentUser?.id === member.id}
                  title={
                    currentUser?.id === member.id
                      ? "You can't remove yourself"
                      : "Remove from workspace"
                  }
                >
                  <Trash2 size={13} />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreate && (
        <CreateUserModal
          maxTeamMembers={maxTeamMembers}
          currentMemberCount={members.length}
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
        />
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSubmit={handleEdit}
        />
      )}

      {deletingUser && (
        <ConfirmDialog
          title="Remove team member"
          message={`This removes ${deletingUser.fullName} (${deletingUser.email}) from the workspace. This can't be undone.`}
          confirmLabel="Remove"
          onClose={() => setDeletingUser(null)}
          onConfirm={handleDelete}
        />
      )}
    </section>
  );
};

export default SettingsTeam;

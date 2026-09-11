import { useState, useEffect } from "react";
import { Flag, Plus } from "lucide-react";

import { changelog as changelogApi } from "../../components/Api";
import ErrorBanner from "../ErrorBanner";
import EmptyState from "../../components/EmptyState";
import ActionMenu from "../../components/ActionMenu";
import ChangelogEntryModal from "../../components/ChangelogEntryModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import PlanLimitNotice from "../../components/PlanLimitNotice";
import { useAuth } from "../../hooks/useAuth";
import { WORKSPACE_ID } from "../../components/Api";
import {
  useEntitlements,
  isAtLimit,
  formatUsage,
  limitReachedMessage,
  isStartupTier,
} from "../../hooks/useEntitlements";
import Header from "../../Header";

/* ------------------------------------- changelog view ----------------------------------------- */
/*
 * Workspace-level changelog. Public visitors see published entries only,
 * no controls. Staff also see drafts and get create/edit/publish-toggle/
 * delete. Edit hits PUT /workspaces/changelog/{id}, added to the backend
 * since the last audit — see BACKEND_FIXES.md for a cross-tenant
 * authorization gap found in that endpoint that isn't fixable from here.
 */

const TAG_COLORS = {
  PUBLISHED: "var(--moss)",
  DRAFT: "var(--slate)",
};

function ChangelogView({ workspaceId, hideHeader = false } = {}) {
  const { isStaff, currentUser } = useAuth();

  // Top-level /changelog (staff, protected) passes no workspaceId — use
  // the signed-in staff member's own workspace, not the static env default.
  const effectiveWorkspaceId = workspaceId ?? currentUser?.workspaceId;

  // Staff of workspace A must not manage OR see drafts for workspace B —
  // being staff somewhere does not grant rights everywhere. This gates
  // both draft visibility and the create/publish/delete controls below.
  const canManage =
    isStaff &&
    currentUser?.workspaceId != null &&
    String(currentUser.workspaceId) === String(effectiveWorkspaceId);

  // Only fetch entitlements when this viewer could actually manage the
  // changelog — public/anonymous portal visitors never see create
  // controls, so there's no reason to call the (staff-only) entitlements
  // endpoint for them. Same maxChangelogEntries source Boards/Team use.
  const { entitlements } = useEntitlements(canManage ? effectiveWorkspaceId : null);

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadChangelog, setReloadChangelog] = useState(0);

  const [showCreate, setShowCreate] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deletingEntry, setDeletingEntry] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchChangelog = async () => {
      setLoading(true);

      try {
        const list = (await changelogApi.list(effectiveWorkspaceId)) || [];

        if (!cancelled) {
          setEntries(canManage ? list : list.filter((e) => e.status !== "DRAFT"));
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e);
          setEntries([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchChangelog();

    return () => {
      cancelled = true;
    };
  }, [reloadChangelog, canManage, effectiveWorkspaceId]);

  const retry = () => setReloadChangelog((value) => value + 1);

  const maxChangelogEntries = entitlements?.maxChangelogEntries;
  const entryLimitReached = isAtLimit(entries.length, maxChangelogEntries);

  const handleCreate = async (data) => {
    await changelogApi.create(effectiveWorkspaceId || WORKSPACE_ID, {
      ...data,
      userId: currentUser?.id,
    });
    setShowCreate(false);
    retry();
  };

  const handleEdit = async (data) => {
    await changelogApi.update(editingEntry.id, data);
    setEditingEntry(null);
    retry();
  };

  const toggleStatus = async (entry) => {
    const next = entry.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";

    setEntries((prev) =>
      prev.map((e) => (e.id === entry.id ? { ...e, status: next } : e)),
    );

    try {
      await changelogApi.setStatus(entry.id, next);
    } catch (e) {
      setError(e);
      retry();
    }
  };

  const handleDelete = async () => {
    await changelogApi.remove(deletingEntry.id);
    setDeletingEntry(null);
    retry();
  };

  if (loading) {
    return (
      <>
        {!hideHeader && <Header />}
        <div className="fm-loading">Loading changelog…</div>
      </>
    );
  }

  return (
    <>
      {!hideHeader && <Header />}

      <div className="fm-page-head" style={{ maxWidth: 720 }}>
        <div>
          <h1 className="fm-display">Changelog</h1>

          {canManage && entitlements && (
            <p style={{ fontSize: 12.5, color: "var(--ink-soft)", margin: "2px 0 0" }}>
              {formatUsage(entries.length, maxChangelogEntries)} entries used.
            </p>
          )}
        </div>

        {canManage && (
          <button
            type="button"
            className="fm-btn-primary"
            onClick={() => setShowCreate(true)}
            disabled={entryLimitReached}
            title={entryLimitReached ? "Changelog entry limit reached for your plan" : undefined}
          >
            <Plus size={14} />
            New release
          </button>
        )}
      </div>

      <div className="fm-changelog" style={{ paddingTop: 8 }}>
        {canManage && entryLimitReached && (
          <PlanLimitNotice
            message={limitReachedMessage(maxChangelogEntries, "changelog entries")}
            showUpgrade={isStartupTier(entitlements)}
          />
        )}

        <ErrorBanner error={error} onRetry={retry} />

        {entries.length === 0 && !error && (
          <EmptyState
            title="No releases yet"
            description="Publish your first changelog entry when you ship something."
            action={
              canManage && (
                <button
                  type="button"
                  className="fm-btn-primary"
                  onClick={() => setShowCreate(true)}
                >
                  <Plus size={14} />
                  New changelog entry
                </button>
              )
            }
          />
        )}

        {entries.map((entry) => (
          <div className="fm-log-entry" key={entry.id}>
            <div className="fm-log-rail" />

            <div className="fm-log-date">
              {entry.publishedAt
                ? new Date(entry.publishedAt).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Unscheduled"}
            </div>

            <div className="fm-log-dot">
              <div className="fm-log-flag">
                <Flag size={8} color="#B98A3D" />
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span
                  className="fm-log-tag"
                  style={{
                    background: `${TAG_COLORS[entry.status] || "var(--slate)"}22`,
                    color: TAG_COLORS[entry.status] || "var(--slate)",
                  }}
                >
                  {entry.status === "PUBLISHED" ? "Update" : entry.status}
                </span>

                {canManage && (
                  <div style={{ marginLeft: "auto" }}>
                    <ActionMenu
                      actions={[
                        {
                          label: "Edit",
                          onClick: () => setEditingEntry(entry),
                        },
                        {
                          label:
                            entry.status === "PUBLISHED" ? "Unpublish" : "Publish",
                          onClick: () => toggleStatus(entry),
                        },
                        {
                          label: "Delete",
                          danger: true,
                          onClick: () => setDeletingEntry(entry),
                        },
                      ]}
                    />
                  </div>
                )}
              </div>

              <div className="fm-log-title fm-display">{entry.title}</div>

              <div className="fm-log-body">{entry.content}</div>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <ChangelogEntryModal onClose={() => setShowCreate(false)} onSubmit={handleCreate} />
      )}

      {editingEntry && (
        <ChangelogEntryModal
          entry={editingEntry}
          onClose={() => setEditingEntry(null)}
          onSubmit={handleEdit}
        />
      )}

      {deletingEntry && (
        <ConfirmDialog
          title="Delete changelog entry"
          message={`This permanently deletes "${deletingEntry.title}". This can't be undone.`}
          onClose={() => setDeletingEntry(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}

export default ChangelogView;

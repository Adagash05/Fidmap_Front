import { useEffect, useState } from "react";
import { Plus } from "lucide-react";

import ErrorBanner from "../ErrorBanner";
import EmptyState from "../../components/EmptyState";
import ActionMenu from "../../components/ActionMenu";
import RoadmapItemModal from "../../components/RoadmapItemModal";
import ConfirmDialog from "../../components/ConfirmDialog";
import PlanLimitNotice from "../../components/PlanLimitNotice";
import {
  roadmap as roadmapApi,
  roadmapItems as roadmapItemsApi,
} from "../../components/Api.js";
import { ROADMAP_STATUS } from "../../constants/STATUS.jsx";
import { useAuth } from "../../hooks/useAuth";
import {
  useEntitlements,
  isAtLimit,
  formatUsage,
  limitReachedMessage,
  isStartupTier,
} from "../../hooks/useEntitlements";
import Header from "../../Header.jsx";

/* -------------------------------------- roadmap view ---------------------------------------- */
/*
 * Workspace-level roadmap. Public visitors see a read-only board; staff get
 * create/edit/status-change/delete, all against the real
 * RoadmapItemController endpoints (see Api.js for exact contract notes).
 */
function RoadmapView({ workspaceId, hideHeader = false } = {}) {
  const { isStaff, currentUser } = useAuth();

  // Top-level /roadmap (staff, protected) passes no workspaceId — use the
  // signed-in staff member's own workspace rather than falling through to
  // Api.js's static env default, which would be wrong for any workspace
  // other than whichever VITE_WORKSPACE_ID happens to be set to.
  const effectiveWorkspaceId = workspaceId ?? currentUser?.workspaceId;

  // A staff member is only authorized to manage THIS workspace's roadmap
  // if it's actually their own — being staff somewhere does not grant
  // management rights everywhere. Without this, a staff member browsing
  // another workspace's public portal (workspaceId prop = that other
  // workspace) would incorrectly see edit/delete controls there.
  const canManage =
    isStaff &&
    currentUser?.workspaceId != null &&
    String(currentUser.workspaceId) === String(effectiveWorkspaceId);

  // Only fetch entitlements when this viewer could actually manage the
  // roadmap — public/anonymous portal visitors never see create controls,
  // so there's no reason to call the (staff-only) entitlements endpoint
  // for them. Same maxRoadmapItems source Boards/Team already use.
  const { entitlements } = useEntitlements(canManage ? effectiveWorkspaceId : null);

  const [roadmapId, setRoadmapId] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadRoadmap, setReloadRoadmap] = useState(0);

  const [showCreate, setShowCreate] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchRoadmap = async () => {
      setLoading(true);

      try {
        const result = await roadmapApi.get(effectiveWorkspaceId);

        if (!cancelled) {
          setRoadmapId(result.id);
          setItems(result.items || []);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e);
          setItems([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchRoadmap();

    return () => {
      cancelled = true;
    };
  }, [reloadRoadmap, effectiveWorkspaceId]);

  const retry = () => setReloadRoadmap((value) => value + 1);

  const maxRoadmapItems = entitlements?.maxRoadmapItems;
  const itemLimitReached = isAtLimit(items.length, maxRoadmapItems);

  const handleCreate = async (data) => {
    await roadmapItemsApi.create(roadmapId, data);
    setShowCreate(false);
    retry();
  };

  const handleEdit = async (data) => {
    await roadmapItemsApi.update(editingItem.id, data);
    setEditingItem(null);
    retry();
  };

  const handleStatusChange = async (item, status) => {
    // Optimistic — the column move should feel instant.
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status } : i)),
    );

    try {
      await roadmapItemsApi.setStatus(item.id, status);
    } catch (e) {
      setError(e);
      retry(); // revert to real server state
    }
  };

  const handleDelete = async () => {
    await roadmapItemsApi.remove(deletingItem.id);
    setDeletingItem(null);
    retry();
  };

  if (loading) {
    return (
      <>
        {!hideHeader && <Header />}
        <div className="fm-loading">Loading roadmap…</div>
      </>
    );
  }

  return (
    <>
      {!hideHeader && <Header />}

      <div className="fm-page-head">
        <div>
          <h1 className="fm-display">Roadmap</h1>

          {canManage && entitlements && (
            <p style={{ fontSize: 12.5, color: "var(--ink-soft)", margin: "2px 0 0" }}>
              {formatUsage(items.length, maxRoadmapItems)} roadmap items used.
            </p>
          )}
        </div>

        {canManage && (
          <button
            type="button"
            className="fm-btn-primary"
            onClick={() => setShowCreate(true)}
            disabled={!roadmapId || itemLimitReached}
            title={itemLimitReached ? "Roadmap item limit reached for your plan" : undefined}
          >
            <Plus size={14} />
            New roadmap item
          </button>
        )}
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 28px" }}>
        {canManage && itemLimitReached && (
          <PlanLimitNotice
            message={limitReachedMessage(maxRoadmapItems, "roadmap items")}
            showUpgrade={isStartupTier(entitlements)}
          />
        )}

        <ErrorBanner error={error} onRetry={retry} />

        {items.length === 0 && !error && (
          <div style={{ padding: "8px 0 26px" }}>
            <EmptyState
              title="No roadmap items yet"
              description="Create your first roadmap item to start planning what you're building."
              action={
                canManage && (
                  <button
                    type="button"
                    className="fm-btn-primary"
                    onClick={() => setShowCreate(true)}
                  >
                    <Plus size={14} />
                    Create roadmap item
                  </button>
                )
              }
            />
          </div>
        )}

        {items.length > 0 && (
          <div className="fm-roadmap" style={{ padding: "0 0 26px" }}>
            {Object.entries(ROADMAP_STATUS).map(([key, status]) => {
              const columnItems = items.filter((item) => item.status === key);

              return (
                <div className="fm-column" key={key}>
                  <div className="fm-column-head">
                    <span className="fm-dot" style={{ background: status.color }} />
                    <span className="fm-column-title">{status.label}</span>
                    <span className="fm-column-count fm-mono">
                      {columnItems.length}
                    </span>
                  </div>

                  {columnItems.map((item) => (
                    <div className="fm-mini-card" key={item.id}>
                      <div className="fm-mini-card-top">
                        <div className="fm-mini-title" style={{ marginBottom: 0 }}>
                          {item.title}
                        </div>

                        {canManage && (
                          <ActionMenu
                            actions={[
                              { label: "Edit", onClick: () => setEditingItem(item) },
                              {
                                label: "Delete",
                                danger: true,
                                onClick: () => setDeletingItem(item),
                              },
                            ]}
                          />
                        )}
                      </div>

                      {item.targetDate && (
                        <div className="fm-mini-meta">Target: {item.targetDate}</div>
                      )}

                      {canManage && (
                        <select
                          className="fm-mini-status-select"
                          value={item.status}
                          onChange={(e) => handleStatusChange(item, e.target.value)}
                        >
                          {Object.entries(ROADMAP_STATUS).map(([k, s]) => (
                            <option key={k} value={k}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  ))}

                  {columnItems.length === 0 && (
                    <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                      Nothing here yet.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showCreate && (
        <RoadmapItemModal onClose={() => setShowCreate(false)} onSubmit={handleCreate} />
      )}

      {editingItem && (
        <RoadmapItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={handleEdit}
        />
      )}

      {deletingItem && (
        <ConfirmDialog
          title="Delete roadmap item"
          message={`This permanently deletes "${deletingItem.title}". This can't be undone.`}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}

export default RoadmapView;

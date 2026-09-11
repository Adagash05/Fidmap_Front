import { useState } from "react";
import { Plus } from "lucide-react";

import Header from "../Header";
import ErrorBanner from "./ErrorBanner";
import EmptyState from "../components/EmptyState";
import BoardCard from "../components/BoardCard";
import CreateBoardModal from "../components/CreateBoardModal";
import EditBoardModal from "../components/EditBoardModal";
import DeleteBoardDialog from "../components/DeleteBoardDialog";
import PlanLimitNotice from "../components/PlanLimitNotice";
import { useBoards } from "../hooks/useBoards";
import { useAuth } from "../hooks/useAuth";
import {
  useEntitlements,
  isAtLimit,
  formatUsage,
  limitReachedMessage,
  isStartupTier,
} from "../hooks/useEntitlements";

/*
 * Staff board management — /boards, behind ProtectedRoute (see App.jsx).
 * Public board discovery lives entirely in the public portal
 * (PublicPortal.jsx / /p/:workspaceSlug) — this page no longer has a
 * public branch, since ProtectedRoute guarantees it never mounts for
 * anonymous visitors. (It used to double as the public board list before
 * /boards existed as a distinct staff route.)
 */
const Boards = () => {
  const { boards, loading, error, reloadBoards, createBoard, updateBoard, removeBoard } =
    useBoards();
  const { currentUser } = useAuth();
  const { entitlements } = useEntitlements(currentUser?.workspaceId);

  const [showCreate, setShowCreate] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [deletingBoard, setDeletingBoard] = useState(null);

  const maxBoards = entitlements?.maxBoards;
  const boardLimitReached = isAtLimit(boards.length, maxBoards);
  const canUsePrivateBoards = entitlements?.privateBoards ?? true;

  const handleCreate = async (data) => {
    await createBoard(data);
    setShowCreate(false);
  };

  const handleEdit = async (boardId, data) => {
    await updateBoard(boardId, data);
    setEditingBoard(null);
  };

  const handleDelete = async (boardId) => {
    await removeBoard(boardId);
    setDeletingBoard(null);
  };

  return (
    <>
      <Header />

      <div className="fm-dash">
        <section className="fm-dash-hero">
          <div>
            <div className="fm-dash-eyebrow fm-mono">Workspace</div>

            <h1 className="fm-dash-title fm-display">Boards</h1>

            <p className="fm-dash-sub">
              Every feedback board in this workspace.
              {entitlements && ` ${formatUsage(boards.length, maxBoards)} boards used.`}
            </p>
          </div>

          <div className="fm-dash-hero-actions">
            <button
              type="button"
              className="fm-btn-primary"
              onClick={() => setShowCreate(true)}
              disabled={boardLimitReached}
              title={boardLimitReached ? "Board limit reached for your plan" : undefined}
            >
              <Plus size={14} />
              New board
            </button>
          </div>
        </section>

        {boardLimitReached && (
          <PlanLimitNotice
            message={limitReachedMessage(maxBoards, "boards")}
            showUpgrade={isStartupTier(entitlements)}
          />
        )}

        <ErrorBanner error={error} onRetry={reloadBoards} />

        {loading && <div className="fm-loading">Loading boards…</div>}

        {!loading && boards.length === 0 && !error && (
          <EmptyState
            title="No boards yet"
            description="Create your first feedback board to start collecting requests, votes, and comments."
            action={
              <button
                type="button"
                className="fm-btn-primary"
                onClick={() => setShowCreate(true)}
              >
                <Plus size={14} />
                Create your first board
              </button>
            }
          />
        )}

        {!loading && boards.length > 0 && (
          <div className="fm-board-grid">
            {boards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                onEdit={setEditingBoard}
                onDelete={setDeletingBoard}
              />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateBoardModal
          canUsePrivateBoards={canUsePrivateBoards}
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
        />
      )}

      {editingBoard && (
        <EditBoardModal
          board={editingBoard}
          canUsePrivateBoards={canUsePrivateBoards}
          onClose={() => setEditingBoard(null)}
          onSubmit={handleEdit}
        />
      )}

      {deletingBoard && (
        <DeleteBoardDialog
          board={deletingBoard}
          onClose={() => setDeletingBoard(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default Boards;

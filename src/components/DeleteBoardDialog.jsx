import { useState } from "react";
import { X, TriangleAlert } from "lucide-react";

import ErrorBanner from "../pages/ErrorBanner";

/*
 * Confirmation dialog for deleting a board. Never deletes silently — the
 * person must explicitly confirm, and the board's name is echoed back so
 * there's no ambiguity about what's being removed.
 */
const DeleteBoardDialog = ({ board, onClose, onConfirm }) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const confirm = async () => {
    if (busy) return;

    setBusy(true);
    setError(null);

    try {
      await onConfirm(board.id);
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  };

  return (
    <div className="fm-overlay" onClick={onClose}>
      <div className="fm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fm-modal-head">
          <div
            className="fm-display"
            style={{
              fontWeight: 700,
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <TriangleAlert size={16} color="var(--brick)" />
            Delete board
          </div>

          <button className="fm-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <ErrorBanner error={error} />

        <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>
          This permanently deletes <strong>{board.name}</strong> and all of its
          feedback, comments, and votes. This can't be undone.
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button
            type="button"
            className="fm-btn-ghost"
            style={{ flex: 1, justifyContent: "center" }}
            onClick={onClose}
            disabled={busy}
          >
            Cancel
          </button>

          <button
            type="button"
            className="fm-btn-primary fm-btn-danger"
            style={{ flex: 1, justifyContent: "center" }}
            onClick={confirm}
            disabled={busy}
          >
            {busy ? "Deleting…" : "Delete board"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBoardDialog;

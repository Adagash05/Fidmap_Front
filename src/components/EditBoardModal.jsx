import { useState } from "react";
import { X } from "lucide-react";

import ErrorBanner from "../pages/ErrorBanner";

/*
 * Edit-board form. Body matches UpdateBoard: name, description, isPublic.
 *
 * `canUsePrivateBoards` mirrors CreateBoardModal: if the workspace's plan
 * doesn't include private boards, the checkbox is locked at its current
 * value (so a downgrade doesn't silently flip an existing private board
 * public, but it also can't be made private here) with an explanation.
 */
const EditBoardModal = ({ board, onClose, onSubmit, canUsePrivateBoards = true }) => {
  const [name, setName] = useState(board.name || "");
  const [description, setDescription] = useState(board.description || "");
  const [isPublic, setIsPublic] = useState(Boolean(board.isPublic));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();

    if (busy || !name.trim()) return;

    setBusy(true);
    setError(null);

    try {
      await onSubmit(board.id, {
        name: name.trim(),
        description: description.trim(),
        isPublic,
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
            Edit board
          </div>

          <button className="fm-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <ErrorBanner error={error} />

        <form onSubmit={submit}>
          <div className="fm-field">
            <label htmlFor="edit-board-name">Name</label>
            <input
              id="edit-board-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              required
            />
          </div>

          <div className="fm-field">
            <label htmlFor="edit-board-desc">Description</label>
            <textarea
              id="edit-board-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <label className="fm-check" style={{ marginBottom: canUsePrivateBoards ? 16 : 4 }}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              disabled={!canUsePrivateBoards}
            />
            Public — anyone with the link can view and submit feedback
          </label>

          {!canUsePrivateBoards && (
            <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 0, marginBottom: 16 }}>
              Private boards are available on the Business plan.
              {!isPublic && " This board stays private until you upgrade or make it public."}
            </p>
          )}

          <button
            type="submit"
            className="fm-btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={busy || !name.trim()}
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBoardModal;

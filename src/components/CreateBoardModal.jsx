import { useState } from "react";
import { X } from "lucide-react";

import ErrorBanner from "../pages/ErrorBanner";

/*
 * Create-board form. Fields match the real BoardDto: name, description,
 * isPublic — nothing invented beyond what the backend accepts.
 *
 * `canUsePrivateBoards` reflects the workspace's plan entitlement
 * (Plan.privateBoards) — Startup can't have private boards, so the
 * checkbox is locked to "public" for them rather than letting them submit
 * a private board the backend will reject anyway.
 */
const CreateBoardModal = ({ onClose, onSubmit, canUsePrivateBoards = true }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();

    if (busy || !name.trim()) return;

    setBusy(true);
    setError(null);

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        isPublic: canUsePrivateBoards ? isPublic : true,
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
            Create board
          </div>

          <button className="fm-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <ErrorBanner error={error} />

        <form onSubmit={submit}>
          <div className="fm-field">
            <label htmlFor="board-name">Name</label>
            <input
              id="board-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product feedback"
              autoFocus
              required
            />
          </div>

          <div className="fm-field">
            <label htmlFor="board-desc">Description</label>
            <textarea
              id="board-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What kind of feedback belongs here?"
            />
          </div>

          <label className="fm-check" style={{ marginBottom: canUsePrivateBoards ? 16 : 4 }}>
            <input
              type="checkbox"
              checked={canUsePrivateBoards ? isPublic : true}
              onChange={(e) => setIsPublic(e.target.checked)}
              disabled={!canUsePrivateBoards}
            />
            Public — anyone with the link can view and submit feedback
          </label>

          {!canUsePrivateBoards && (
            <p style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 0, marginBottom: 16 }}>
              Private boards are available on the Business plan.
            </p>
          )}

          <button
            type="submit"
            className="fm-btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={busy || !name.trim()}
          >
            {busy ? "Creating…" : "Create board"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardModal;

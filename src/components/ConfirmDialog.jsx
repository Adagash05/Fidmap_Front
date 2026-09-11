import { useState } from "react";
import { X, TriangleAlert } from "lucide-react";

import ErrorBanner from "../pages/ErrorBanner";

/*
 * Generic confirmation dialog for any destructive action — reused by
 * roadmap-item and changelog-entry deletion (see DeleteBoardDialog for the
 * board-specific version, kept separate since it predates this component
 * and touching it isn't necessary here).
 */
const ConfirmDialog = ({
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  onClose,
  onConfirm,
}) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const confirm = async () => {
    if (busy) return;

    setBusy(true);
    setError(null);

    try {
      await onConfirm();
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
            {title}
          </div>

          <button className="fm-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <ErrorBanner error={error} />

        {message && (
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.5 }}>
            {message}
          </p>
        )}

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
            {busy ? "Working…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

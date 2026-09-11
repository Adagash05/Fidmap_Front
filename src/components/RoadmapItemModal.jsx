import { useState } from "react";
import { X } from "lucide-react";

import ErrorBanner from "../pages/ErrorBanner";
import RelatedFeedbackPicker from "./RelatedFeedbackPicker";
import { ROADMAP_STATUS } from "../constants/STATUS";

/*
 * Create or edit a roadmap item. `item` present => edit mode (PUT, no
 * feedback-linking — the backend's update endpoint doesn't accept
 * feedbackPost, only create does, see RoadmapItemController). `item`
 * absent => create mode (POST, feedback-linking available).
 */
const RoadmapItemModal = ({ item, onClose, onSubmit }) => {
  const isEdit = Boolean(item);

  const [title, setTitle] = useState(item?.title || "");
  const [description, setDescription] = useState(item?.description || "");
  const [status, setStatus] = useState(item?.status || "PLANNED");
  const [targetDate, setTargetDate] = useState(item?.targetDate || "");
  const [relatedFeedback, setRelatedFeedback] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();

    if (busy || !title.trim()) return;

    setBusy(true);
    setError(null);

    try {
      if (isEdit) {
        await onSubmit({
          title: title.trim(),
          description: description.trim(),
          status,
          targetDate: targetDate || null,
        });
      } else {
        await onSubmit({
          title: title.trim(),
          description: description.trim(),
          status,
          feedbackPostIds: relatedFeedback.map((f) => f.id),
        });
      }
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  };

  return (
    <div className="fm-overlay" onClick={onClose}>
      <div className="fm-modal fm-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="fm-modal-head">
          <div className="fm-display" style={{ fontWeight: 700, fontSize: 16 }}>
            {isEdit ? "Edit roadmap item" : "New roadmap item"}
          </div>

          <button className="fm-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <ErrorBanner error={error} />

        <form onSubmit={submit}>
          <div className="fm-field">
            <label htmlFor="ri-title">Title</label>
            <input
              id="ri-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Dark mode"
              autoFocus
              required
            />
          </div>

          <div className="fm-field">
            <label htmlFor="ri-desc">Description</label>
            <textarea
              id="ri-desc"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this, and why does it matter?"
            />
          </div>

          <div className="fm-field-row">
            <div className="fm-field">
              <label htmlFor="ri-status">Status</label>
              <select
                id="ri-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {Object.entries(ROADMAP_STATUS).map(([key, s]) => (
                  <option key={key} value={key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {isEdit && (
              <div className="fm-field">
                <label htmlFor="ri-target">Target date</label>
                <input
                  id="ri-target"
                  type="date"
                  value={targetDate || ""}
                  onChange={(e) => setTargetDate(e.target.value)}
                />
              </div>
            )}
          </div>

          {!isEdit && (
            <RelatedFeedbackPicker
              selected={relatedFeedback}
              onChange={setRelatedFeedback}
            />
          )}

          <button
            type="submit"
            className="fm-btn-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
            disabled={busy || !title.trim()}
          >
            {busy ? "Saving…" : isEdit ? "Save changes" : "Create roadmap item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoadmapItemModal;

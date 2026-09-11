import { useState } from "react";
import { X } from "lucide-react";

import ErrorBanner from "../pages/ErrorBanner";

/*
 * Create or edit a changelog entry. `entry` present => edit mode (PUT
 * /workspaces/changelog/{id}, now available since the last audit — see
 * BACKEND_FIXES.md for a cross-tenant authorization gap in that endpoint
 * that this frontend can't close on its own). `entry` absent => create
 * mode (POST, same as before). Publish/unpublish stays a separate action
 * in the entry's menu (setStatus) rather than living in this form, since
 * that's the dedicated endpoint for it.
 */
const ChangelogEntryModal = ({ entry, onClose, onSubmit }) => {
  const isEdit = Boolean(entry);

  const [title, setTitle] = useState(entry?.title || "");
  const [content, setContent] = useState(entry?.content || "");
  const [publishedAt, setPublishedAt] = useState(() =>
    entry?.publishedAt
      ? entry.publishedAt.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );
  const [publishNow, setPublishNow] = useState(
    isEdit ? entry.status === "PUBLISHED" : true,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();

    if (busy || !title.trim()) return;

    setBusy(true);
    setError(null);

    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        status: publishNow ? "PUBLISHED" : "DRAFT",
        publishedAt: publishedAt ? `${publishedAt}T00:00:00` : null,
      });
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
            {isEdit ? "Edit changelog entry" : "New changelog entry"}
          </div>

          <button className="fm-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <ErrorBanner error={error} />

        <form onSubmit={submit}>
          <div className="fm-field">
            <label htmlFor="cl-title">Title</label>
            <input
              id="cl-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Improved feedback voting"
              autoFocus
              required
            />
          </div>

          <div className="fm-field">
            <label htmlFor="cl-content">Description</label>
            <textarea
              id="cl-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What shipped, in plain language."
            />
          </div>

          <div className="fm-field">
            <label htmlFor="cl-date">Release date</label>
            <input
              id="cl-date"
              type="date"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
            />
          </div>

          <label className="fm-check" style={{ marginBottom: 16 }}>
            <input
              type="checkbox"
              checked={publishNow}
              onChange={(e) => setPublishNow(e.target.checked)}
            />
            {isEdit ? "Published (uncheck to move back to draft)" : "Publish immediately (otherwise saves as a draft)"}
          </label>

          <button
            type="submit"
            className="fm-btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={busy || !title.trim()}
          >
            {busy ? "Saving…" : isEdit ? "Save changes" : "Create entry"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangelogEntryModal;

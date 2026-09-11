import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { feedback as feedbackApi } from "../components/Api";
import { useBoards } from "../hooks/useBoards";

/*
 * Lets staff attach existing FeedbackPosts to a roadmap item. There's no
 * "search feedback across the whole workspace" endpoint, so this picks a
 * board first (from the already-loaded workspace board list), then loads
 * that board's feedback on demand — a plain, honest workaround rather than
 * a fabricated cross-board search endpoint.
 */
const RelatedFeedbackPicker = ({ selected, onChange }) => {
  const { boards } = useBoards();

  const [boardId, setBoardId] = useState("");
  const [boardFeedback, setBoardFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pickId, setPickId] = useState("");

  useEffect(() => {
    if (!boardId) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);

      try {
        const list = await feedbackApi.list(boardId);
        if (!cancelled) setBoardFeedback(list || []);
      } catch {
        if (!cancelled) setBoardFeedback([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [boardId]);

  const addSelected = () => {
    if (!pickId) return;

    const post = boardFeedback.find((f) => String(f.id) === String(pickId));
    if (!post || selected.some((s) => s.id === post.id)) return;

    onChange([...selected, { id: post.id, title: post.title }]);
    setPickId("");
  };

  const remove = (id) => {
    onChange(selected.filter((s) => s.id !== id));
  };

  return (
    <div className="fm-field">
      <label>Related feedback (optional)</label>

      <div style={{ display: "flex", gap: 8 }}>
        <select value={boardId} onChange={(e) => setBoardId(e.target.value)}>
          <option value="">Choose a board…</option>
          {boards.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <select
          value={pickId}
          onChange={(e) => setPickId(e.target.value)}
          disabled={!boardId || loading}
        >
          <option value="">
            {loading ? "Loading…" : "Choose feedback…"}
          </option>
          {(boardId ? boardFeedback : []).map((f) => (
            <option key={f.id} value={f.id}>
              {f.title}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="fm-btn-ghost"
          onClick={addSelected}
          disabled={!pickId}
        >
          Add
        </button>
      </div>

      {selected.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
          {selected.map((s) => (
            <span key={s.id} className="fm-chip">
              {s.title}
              <button type="button" onClick={() => remove(s.id)} aria-label="Remove">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatedFeedbackPicker;

import { Link } from "react-router-dom";
import { ArrowRight, Globe, Lock, Pencil, Trash2 } from "lucide-react";

/*
 * One board in the staff dashboard's board grid. Links into the board's
 * feedback, and — for staff — offers edit/delete. Roadmap and Changelog
 * are workspace-level (not per-board), so they live in the top nav, not
 * here — see App.jsx.
 */
const BoardCard = ({ board, onEdit, onDelete }) => (
  <div className="fm-board-card">
    <div className="fm-board-card-top">
      <div>
        <div className="fm-board-card-name fm-display">{board.name}</div>

        {board.description && (
          <div className="fm-board-card-desc">{board.description}</div>
        )}
      </div>

      <span
        className={`fm-visibility-tag ${board.isPublic ? "public" : "private"}`}
      >
        {board.isPublic ? <Globe size={11} /> : <Lock size={11} />}
        {board.isPublic ? "Public" : "Private"}
      </span>
    </div>

    <div className="fm-board-card-links">
      <Link to={`/board/${board.id}`}>
        Open feedback <ArrowRight size={12} />
      </Link>
    </div>

    <div className="fm-board-card-actions">
      <button type="button" className="fm-btn-ghost" onClick={() => onEdit(board)}>
        <Pencil size={13} />
        Edit
      </button>

      <button
        type="button"
        className="fm-btn-ghost fm-btn-danger"
        onClick={() => onDelete(board)}
      >
        <Trash2 size={13} />
        Delete
      </button>
    </div>
  </div>
);

export default BoardCard;

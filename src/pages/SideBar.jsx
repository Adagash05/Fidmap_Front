import { NavLink } from "react-router-dom";
import { FEEDBACK_STATUS } from "../constants/STATUS";
import { useBoards } from "../hooks/useBoards";
import { useAuth } from "../hooks/useAuth";

function Sidebar({ statusFilter, setStatusFilter }) {
  const { isStaff } = useAuth();
  const { boards, loading } = useBoards();

  const toggle = (value) => {
    setStatusFilter((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value],
    );
  };

  return (
    <aside className="fm-sidebar">
      {/* Anonymous visitors can't list a workspace's boards (the backend
          requires a staff token for that), so this section only renders for
          staff — showing "No boards yet" to a public visitor who's clearly
          looking at a real board would be misleading. */}
      {isStaff && (
        <div className="fm-sidebar-group">
          <h4>Boards</h4>

          {loading && <div className="fm-sidebar-loading">Loading boards…</div>}

          {!loading && boards.length === 0 && (
            <div className="fm-sidebar-empty">No boards yet.</div>
          )}

          {!loading &&
            boards.map((board) => (
              <NavLink
                key={board.id}
                to={`/board/${board.id}`}
                className={({ isActive }) =>
                  `fm-board-link ${isActive ? "active" : ""}`
                }
              >
                {board.name}
              </NavLink>
            ))}
        </div>
      )}

      {/* -------------------------------- status -------------------------------- */}

      <div className="fm-sidebar-group">
        <h4>Status</h4>

        {Object.entries(FEEDBACK_STATUS).map(([key, status]) => (
          <label className="fm-check" key={key}>
            <input
              type="checkbox"
              checked={statusFilter.includes(key)}
              onChange={() => toggle(key)}
            />

            <span className="fm-dot" style={{ background: status.color }} />

            {status.label}
          </label>
        ))}
      </div>
    </aside>
  );
}

export default Sidebar;

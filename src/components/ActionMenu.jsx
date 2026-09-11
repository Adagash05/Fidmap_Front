import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";

/*
 * Small "⋯" dropdown for per-item admin actions (edit/delete/publish etc).
 * `actions` is an array of { label, onClick, danger? }.
 */
const ActionMenu = ({ actions }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div className="fm-action-menu" ref={ref}>
      <button
        type="button"
        className="fm-action-menu-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-label="More actions"
      >
        <MoreHorizontal size={15} />
      </button>

      {open && (
        <div className="fm-action-menu-list">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={`fm-action-menu-item${action.danger ? " danger" : ""}`}
              onClick={() => {
                setOpen(false);
                action.onClick();
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

/*
 * Marketing navigation: "Resources" dropdown (Resources → Help). One shared
 * component used by the home page header, MarketingLayout and the legal
 * pages, so the menu cannot drift between them.
 *
 * Keyboard: Enter/Space/ArrowDown on the button opens it; Escape closes and
 * returns focus to the button; Tab leaving the menu closes it.
 */
export const RESOURCE_LINKS = [
  ["/help", "Help center", "Guides for every part of FIDMAP"],
  ["/how-it-works", "How it works", "From feedback to a decision"],
  ["/blog", "Blog", "Feedback and roadmap guides"],
  ["/alternatives", "Compare", "FIDMAP next to other tools"],
];

const ResourcesMenu = () => {
  const [open, setOpen] = useState(false);
  const wrap = useRef(null);
  const button = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onPointer = (event) => {
      if (wrap.current && !wrap.current.contains(event.target)) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    };
    const onFocusOut = (event) => {
      if (wrap.current && !wrap.current.contains(event.relatedTarget)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    const node = wrap.current;
    node?.addEventListener("focusout", onFocusOut);

    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
      node?.removeEventListener("focusout", onFocusOut);
    };
  }, [open]);

  return (
    <div className="fm-res" ref={wrap}>
      <button
        ref={button}
        type="button"
        className="fm-res-button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="fm-res-menu"
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        Resources
        <ChevronRight size={14} className="fm-res-chevron" aria-hidden="true" />
      </button>

      {open && (
        <ul id="fm-res-menu" className="fm-res-menu">
          {RESOURCE_LINKS.map(([to, label, hint]) => (
            <li key={to}>
              <Link to={to} onClick={() => setOpen(false)}>
                <strong>{label}</strong>
                <span>{hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ResourcesMenu;

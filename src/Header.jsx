import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Compass, LogIn, LogOut, Settings as SettingsIcon } from "lucide-react";

import LoginModal from "./components/LoginModal";
import { boards as boardsApi } from "./components/Api.js";
import { useAuth } from "./hooks/useAuth";

/*
 * Two distinct nav modes, since the staff app and the public portal must
 * never share controls (a public visitor must never see Dashboard,
 * Settings, or the staff /roadmap /changelog links):
 *
 *  - Portal mode (path starts with /p/): brand only, no staff tabs. A
 *    "Staff sign in" link is still offered — a workspace owner previewing
 *    their own portal shouldn't need a separate tab open — but nothing
 *    staff-only is ever shown here.
 *  - App mode (everywhere else): the usual staff/marketing nav. Dashboard
 *    tab only shows once actually signed in; Roadmap/Changelog here are
 *    the protected staff-management routes, not the public ones.
 */
const Header = () => {
  const { boardId } = useParams();
  const location = useLocation();
  const { isStaff, logout } = useAuth();

  const isPortal = location.pathname.startsWith("/p/");

  const [showLogin, setShowLogin] = useState(false);
  const [boardName, setBoardName] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadBoard = async () => {
      if (!boardId) {
        if (!cancelled) setBoardName(null);
        return;
      }

      try {
        const board = await boardsApi.get(boardId);
        if (!cancelled) setBoardName(board?.name ?? null);
      } catch {
        if (!cancelled) setBoardName(null);
      }
    };

    loadBoard();

    return () => {
      cancelled = true;
    };
  }, [boardId]);

  const tabs = isStaff
    ? [
        ["/dashboard", "Dashboard"],
        ["/boards", "Boards"],
        ["/roadmap", "Roadmap"],
        ["/changelog", "Changelog"],
      ]
    : [];

  return (
    <>
      <header className="fm-header">
        <Link to="/" className="fm-brand" style={{ textDecoration: "none" }}>
          <div className="fm-brand-mark">
            <Compass size={18} />
          </div>

          <div>
            <div className="fm-brand-name fm-display">fidmap</div>

            <div className="fm-brand-sub fm-mono">
              {boardName || "chart the feedback"}
            </div>
          </div>
        </Link>

        {!isPortal && tabs.length > 0 && (
          <nav className="fm-tabs" role="tablist" aria-label="Workspace">
            {tabs.map(([path, label]) => {
              const active = location.pathname === path;

              return (
                <Link to={path} key={path}>
                  <button
                    type="button"
                    className={`fm-tab${active ? " active" : ""}`}
                    role="tab"
                    aria-selected={active}
                  >
                    {label}
                  </button>
                </Link>
              );
            })}
          </nav>
        )}

        <div className="fm-header-actions">
          {!isPortal && isStaff && (
            <Link to="/settings" className="fm-btn-ghost">
              <SettingsIcon size={14} />
              Settings
            </Link>
          )}

          {isStaff ? (
            !isPortal && (
              <button type="button" className="fm-btn-ghost" onClick={logout}>
                <LogOut size={14} />
                Sign out
              </button>
            )
          ) : (
            <button
              type="button"
              className="fm-btn-ghost"
              onClick={() => setShowLogin(true)}
            >
              <LogIn size={14} />
              Staff sign in
            </button>
          )}
        </div>
      </header>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoggedIn={() => setShowLogin(false)}
        />
      )}
    </>
  );
};

export default Header;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../../Header";
import ErrorBanner from "../ErrorBanner";
import SettingsProfile from "./SettingsProfile";
import SettingsSecurity from "./SettingsSecurity";
import SettingsTeam from "./SettingsTeam";
import SettingsSubscription from "./SettingsSubscription";
import { workspace as workspaceApi } from "../../components/Api";
import { useAuth } from "../../hooks/useAuth";
import { useBoards } from "../../hooks/useBoards";

/*
 * Staff-only settings, organized into isolated tabs rather than one
 * crowded page: Profile, Security (password), Team (OWNER only),
 * Subscription (OWNER only). currentUser comes from AuthContext
 * (verified via GET /feedback/user/me on load), workspace from
 * GET /workspace/{id} (which now includes `slug`). There's no backend
 * endpoint to edit the slug, so it's shown read-only in Profile — see
 * docs/backend-api-requirements.md.
 */
const TABS = [
  ["profile", "Profile"],
  ["security", "Security"],
];

const Settings = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { boards } = useBoards();

  const [ws, setWs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("profile");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);

      try {
        const result = await workspaceApi.get(currentUser?.workspaceId);
        if (!cancelled) {
          setWs(result);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [currentUser?.workspaceId]);

  const handleSignOut = () => {
    logout();
    navigate("/sign-in", { replace: true });
  };

  const isOwner = currentUser?.role === "OWNER";

  // UserDto exposes `role` (fixed backend-side since an earlier audit), so
  // we can finally know client-side whether Team/Subscription apply — the
  // backend remains the actual authorization boundary (OWNER-only,
  // enforced server-side); this just avoids showing tabs that would
  // always error for non-owners.
  const tabs = [
    ...TABS,
    ...(isOwner ? [["team", "Team"]] : []),
    ...(isOwner ? [["subscription", "Subscription"]] : []),
  ];

  return (
    <>
      <Header />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 28px 80px" }}>
        <h1
          className="fm-display"
          style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}
        >
          Settings
        </h1>

        <p style={{ fontSize: 13.5, color: "var(--ink-soft)", margin: "0 0 16px" }}>
          Your account and workspace.
        </p>

        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 20,
            borderBottom: "1px solid var(--line)",
          }}
        >
          {tabs.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`fm-tab${tab === key ? " active" : ""}`}
              style={{ borderRadius: "8px 8px 0 0" }}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "profile" && (
          <>
            <ErrorBanner error={error} />

            {loading && <div className="fm-loading">Loading account…</div>}

            {!loading && (
              <SettingsProfile
                currentUser={currentUser}
                workspace={ws}
                boardCount={boards.length}
                onSignOut={handleSignOut}
              />
            )}
          </>
        )}

        {tab === "security" && <SettingsSecurity />}

        {tab === "team" && isOwner && (
          <SettingsTeam workspaceId={currentUser?.workspaceId} />
        )}

        {tab === "subscription" && isOwner && (
          <SettingsSubscription workspaceId={currentUser?.workspaceId} />
        )}
      </div>
    </>
  );
};

export default Settings;

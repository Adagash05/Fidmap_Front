import { useParams } from "react-router-dom";
import { Compass } from "lucide-react";

import Header from "../Header";
import ErrorBanner from "./ErrorBanner";
import PortalNav from "../components/PortalNav";
import ChangelogView from "./Changelog/ChangelogView";
import { useResolvedWorkspace } from "../hooks/useResolvedWorkspace";

/*
 * /p/:workspaceSlug/changelog — resolves the workspace by slug, then
 * reuses ChangelogView (read-only, published-only for anonymous visitors)
 * scoped to that specific workspace's id.
 */
const PortalChangelog = () => {
  const { workspaceSlug } = useParams();
  const { workspace: ws, loading, error } = useResolvedWorkspace(workspaceSlug);

  return (
    <>
      <Header />

      <div className="fm-dash-hero" style={{ maxWidth: 720, margin: "0 auto", padding: "20px 28px 0" }}>
        <div className="fm-dash-eyebrow fm-mono">
          <Compass size={12} />
          {loading ? "Loading…" : ws?.name || "Workspace"}
        </div>
      </div>

      <ErrorBanner error={error} />

      {!loading && ws && (
        <>
          <PortalNav workspaceSlug={workspaceSlug} active="changelog" />
          <ChangelogView workspaceId={ws.id} hideHeader />
        </>
      )}
    </>
  );
};

export default PortalChangelog;

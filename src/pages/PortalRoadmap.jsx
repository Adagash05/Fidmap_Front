import { useParams } from "react-router-dom";
import { Compass } from "lucide-react";

import Header from "../Header";
import ErrorBanner from "./ErrorBanner";
import PortalNav from "../components/PortalNav";
import RoadmapView from "./Roadmap/RoadmapView";
import { useResolvedWorkspace } from "../hooks/useResolvedWorkspace";

/*
 * /p/:workspaceSlug/roadmap — resolves the workspace by slug, then reuses
 * RoadmapView (read-only for anonymous visitors — isStaff is false, so
 * admin controls stay hidden) scoped to that specific workspace's id
 * rather than the deployment's default WORKSPACE_ID.
 */
const PortalRoadmap = () => {
  const { workspaceSlug } = useParams();
  const { workspace: ws, loading, error } = useResolvedWorkspace(workspaceSlug);

  return (
    <>
      <Header />

      <div className="fm-dash-hero" style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 28px 0" }}>
        <div className="fm-dash-eyebrow fm-mono">
          <Compass size={12} />
          {loading ? "Loading…" : ws?.name || "Workspace"}
        </div>
      </div>

      <ErrorBanner error={error} />

      {!loading && ws && (
        <>
          <PortalNav workspaceSlug={workspaceSlug} active="roadmap" />
          <RoadmapView workspaceId={ws.id} hideHeader />
        </>
      )}
    </>
  );
};

export default PortalRoadmap;

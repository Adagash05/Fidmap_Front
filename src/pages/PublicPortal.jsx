import { Link, useParams } from "react-router-dom";
import { ArrowRight, Compass } from "lucide-react";

import Header from "../Header";
import ErrorBanner from "./ErrorBanner";
import EmptyState from "../components/EmptyState";
import PortalNav from "../components/PortalNav";
import { useResolvedWorkspace } from "../hooks/useResolvedWorkspace";
import { boards as boardsApi } from "../components/Api";
import { useEffect, useState } from "react";

/*
 * The public portal's board list — resolves a workspace by its public slug
 * (GET /workspace/slug/{slug}, public) and shows its public boards
 * (GET /board/public/workspace/{id}, public). Hands off to the existing
 * /board/:boardId page for the actual feedback experience rather than
 * duplicating it. Sibling routes PortalRoadmap/PortalChangelog reuse this
 * same slug-resolution (useResolvedWorkspace) for /p/:slug/roadmap and
 * /p/:slug/changelog.
 */
const PublicPortal = () => {
  const { workspaceSlug } = useParams();
  const { workspace: ws, loading: wsLoading, error: wsError } =
    useResolvedWorkspace(workspaceSlug);

  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ws) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);

      try {
        const list = await boardsApi.getPublic(ws.id);
        if (!cancelled) {
          setBoards(list || []);
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
  }, [ws]);

  return (
    <>
      <Header />

      <div className="fm-dash">
        <section className="fm-dash-hero">
          <div>
            <div className="fm-dash-eyebrow fm-mono">
              <Compass size={12} />
              Public portal
            </div>

            <h1 className="fm-dash-title fm-display">
              {wsLoading ? "Loading…" : ws?.name || "Workspace"}
            </h1>

            <p className="fm-dash-sub">Customer feedback, roadmap, and changelog.</p>
          </div>
        </section>

        <ErrorBanner error={wsError} />

        {!wsError && !wsLoading && ws && (
          <>
            <PortalNav workspaceSlug={workspaceSlug} active="boards" />

            <ErrorBanner error={error} />

            {loading && <div className="fm-loading">Loading boards…</div>}

            {!loading && boards.length === 0 && !error && (
              <EmptyState
                title="No public boards yet"
                description="This workspace hasn't made any boards public."
              />
            )}

            {!loading && boards.length > 0 && (
              <div className="fm-board-grid">
                {boards.map((board) => (
                  <Link
                    key={board.id}
                    to={`/board/${board.id}`}
                    className="fm-board-card"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="fm-board-card-top">
                      <div>
                        <div className="fm-board-card-name fm-display">
                          {board.name}
                        </div>

                        {board.description && (
                          <div className="fm-board-card-desc">
                            {board.description}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="fm-board-card-links">
                      <span>
                        Open board <ArrowRight size={12} />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default PublicPortal;

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Inbox,
  Circle,
  Rocket,
  CheckCircle2,
  Plus,
  ArrowRight,
  Flag,
} from "lucide-react";

import Header from "../Header";
import ErrorBanner from "./ErrorBanner";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../hooks/useAuth";
import { useBoards } from "../hooks/useBoards";
import {
  feedback as feedbackApi,
  roadmap as roadmapApi,
  changelog as changelogApi,
} from "../components/Api";
import { FEEDBACK_STATUS, ROADMAP_STATUS } from "../constants/STATUS";

/*
 * Staff-only overview. /dashboard sits behind ProtectedRoute (App.jsx), so
 * this never renders for anonymous visitors — the board-management "/"
 * page stays the separate board list/CRUD surface (see Dashboard.jsx).
 *
 * There's no dedicated stats endpoint, so totals/status counts are computed
 * from the workspace's boards' feedback (one GET per board — bounded by
 * board count, not "dozens of requests"). FeedbackDto and RoadmapItemDto
 * both lack a createdAt/timestamp field, so "recent" for feedback and
 * roadmap items is approximated by id descending, not true submission
 * time — labeled as such below. Changelog does have publishedAt, so that
 * section is genuinely sorted by date.
 */
const StaffDashboard = () => {
  const { currentUser } = useAuth();
  const { boards, loading: boardsLoading } = useBoards();

  const [feedbackByBoard, setFeedbackByBoard] = useState({});
  const [feedbackLoading, setFeedbackLoading] = useState(true);
  const [feedbackError, setFeedbackError] = useState(null);

  const [roadmapItems, setRoadmapItems] = useState([]);
  const [roadmapLoading, setRoadmapLoading] = useState(true);
  const [roadmapError, setRoadmapError] = useState(null);

  const [changelogEntries, setChangelogEntries] = useState([]);
  const [changelogLoading, setChangelogLoading] = useState(true);
  const [changelogError, setChangelogError] = useState(null);

  // Feedback: one request per board, run once boards are loaded.
  useEffect(() => {
    if (boardsLoading) return;

    let cancelled = false;

    const load = async () => {
      if (boards.length === 0) {
        setFeedbackByBoard({});
        setFeedbackError(null);
        setFeedbackLoading(false);
        return;
      }

      setFeedbackLoading(true);

      const results = await Promise.allSettled(
        boards.map((b) => feedbackApi.list(b.id)),
      );

      if (cancelled) return;

      const byBoard = {};
      let anyFailed = false;

      results.forEach((res, i) => {
        if (res.status === "fulfilled") {
          byBoard[boards[i].id] = res.value || [];
        } else {
          anyFailed = true;
        }
      });

      setFeedbackByBoard(byBoard);
      setFeedbackError(anyFailed ? new Error("Some boards' feedback failed to load.") : null);
      setFeedbackLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [boards, boardsLoading]);

  // Roadmap: workspace-level, one request.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setRoadmapLoading(true);

      try {
        const result = await roadmapApi.get(currentUser?.workspaceId);
        if (!cancelled) {
          setRoadmapItems(result.items || []);
          setRoadmapError(null);
        }
      } catch (e) {
        if (!cancelled) setRoadmapError(e);
      } finally {
        if (!cancelled) setRoadmapLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [currentUser?.workspaceId]);

  // Changelog: workspace-level, one request.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setChangelogLoading(true);

      try {
        const list = await changelogApi.list(currentUser?.workspaceId);
        if (!cancelled) {
          setChangelogEntries(list || []);
          setChangelogError(null);
        }
      } catch (e) {
        if (!cancelled) setChangelogError(e);
      } finally {
        if (!cancelled) setChangelogLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [currentUser?.workspaceId]);

  const allFeedback = useMemo(() => {
    const boardNameById = Object.fromEntries(boards.map((b) => [b.id, b.name]));

    return Object.entries(feedbackByBoard).flatMap(([boardId, items]) =>
      items.map((item) => ({
        ...item,
        boardId,
        boardName: boardNameById[boardId] || "Board",
      })),
    );
  }, [feedbackByBoard, boards]);

  const stats = useMemo(() => {
    const counts = { total: allFeedback.length };

    Object.keys(FEEDBACK_STATUS).forEach((key) => {
      counts[key] = allFeedback.filter((f) => f.status === key).length;
    });

    return counts;
  }, [allFeedback]);

  // FeedbackPost.id is a UUID (not a sequential Long) and FeedbackDto has
  // no createdAt, so there's no reliable signal to sort "recent" by —
  // this takes the backend's returned order rather than faking a numeric
  // sort that would silently produce NaN comparisons. See
  // docs/backend-api-requirements.md.
  const recentFeedback = useMemo(() => allFeedback.slice(0, 5), [allFeedback]);

  const boardCounts = useMemo(
    () =>
      boards.map((b) => ({
        ...b,
        count: (feedbackByBoard[b.id] || []).length,
      })),
    [boards, feedbackByBoard],
  );

  const roadmapCounts = useMemo(() => {
    const counts = {};
    Object.keys(ROADMAP_STATUS).forEach((key) => {
      counts[key] = roadmapItems.filter((i) => i.status === key).length;
    });
    return counts;
  }, [roadmapItems]);

  const recentChangelog = useMemo(
    () =>
      [...changelogEntries]
        .sort((a, b) => new Date(b.publishedAt ?? 0) - new Date(a.publishedAt ?? 0))
        .slice(0, 3),
    [changelogEntries],
  );

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const loading = boardsLoading || feedbackLoading;

  return (
    <>
      <Header />

      <div className="fm-dash">
        <section className="fm-dash-hero">
          <div>
            <div className="fm-dash-eyebrow fm-mono">Workspace overview</div>
            <h1 className="fm-dash-title fm-display">
              {greeting}
              {currentUser?.fullName ? `, ${currentUser.fullName.split(" ")[0]}` : ""}
            </h1>
            <p className="fm-dash-sub">Here's what's happening across your workspace.</p>
          </div>
        </section>

        <ErrorBanner error={feedbackError} />

        {/* -------------------------------- stats -------------------------------- */}
        <section className="fm-stat-row">
          <div className="fm-stat-card">
            <div className="fm-stat-icon"><Inbox size={16} /></div>
            <div>
              <div className="fm-stat-value fm-mono">{loading ? "—" : stats.total}</div>
              <div className="fm-stat-label">Total feedback</div>
            </div>
          </div>

          <div className="fm-stat-card">
            <div className="fm-stat-icon"><Circle size={16} /></div>
            <div>
              <div className="fm-stat-value fm-mono">{loading ? "—" : stats.OPEN}</div>
              <div className="fm-stat-label">Open</div>
            </div>
          </div>

          <div className="fm-stat-card">
            <div className="fm-stat-icon"><Rocket size={16} /></div>
            <div>
              <div className="fm-stat-value fm-mono">
                {loading ? "—" : stats.IN_PROGRESS}
              </div>
              <div className="fm-stat-label">In progress</div>
            </div>
          </div>

          <div className="fm-stat-card">
            <div className="fm-stat-icon"><CheckCircle2 size={16} /></div>
            <div>
              <div className="fm-stat-value fm-mono">
                {loading ? "—" : stats.COMPLETED}
              </div>
              <div className="fm-stat-label">Completed</div>
            </div>
          </div>
        </section>

        <div className="fm-dash-grid">
          {/* ----------------------------- recent feedback ----------------------------- */}
          <section>
            <div className="fm-dash-col-head">
              <h3 className="fm-display">Recent feedback</h3>
            </div>

            {loading && <div className="fm-loading">Loading feedback…</div>}

            {!loading && recentFeedback.length === 0 && (
              <EmptyState
                title="No feedback yet"
                description="Create a board and share its link to start collecting customer ideas."
                action={
                  <Link to="/boards" className="fm-btn-primary">
                    <Plus size={14} /> New board
                  </Link>
                }
              />
            )}

            {!loading &&
              recentFeedback.map((item) => (
                <Link
                  key={item.id}
                  to={`/board/${item.boardId}`}
                  className="fm-dash-update"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div>
                    <div className="fm-dash-update-title">{item.title}</div>
                    <div className="fm-dash-update-date fm-mono">
                      {item.boardName}
                      {item.endUserName ? ` · ${item.endUserName}` : ""}
                      {typeof item.voteCount === "number" ? ` · ${item.voteCount} votes` : ""}
                    </div>
                  </div>

                  <span
                    className="fm-visibility-tag"
                    style={{
                      marginLeft: "auto",
                      background: `${FEEDBACK_STATUS[item.status]?.color || "var(--slate)"}22`,
                      color: FEEDBACK_STATUS[item.status]?.color || "var(--slate)",
                    }}
                  >
                    {FEEDBACK_STATUS[item.status]?.label || item.status}
                  </span>
                </Link>
              ))}
          </section>

          {/* ------------------------------ quick actions ------------------------------ */}
          <section>
            <div className="fm-dash-col-head">
              <h3 className="fm-display">Quick actions</h3>
            </div>

            <Link to="/boards" className="fm-btn-ghost" style={{ width: "100%", marginBottom: 8, justifyContent: "flex-start" }}>
              <Plus size={14} /> New board
            </Link>
            <Link to="/roadmap" className="fm-btn-ghost" style={{ width: "100%", marginBottom: 8, justifyContent: "flex-start" }}>
              <Plus size={14} /> New roadmap item
            </Link>
            <Link to="/changelog" className="fm-btn-ghost" style={{ width: "100%", marginBottom: 20, justifyContent: "flex-start" }}>
              <Plus size={14} /> New changelog entry
            </Link>

            <div className="fm-dash-col-head">
              <h3 className="fm-display">Boards</h3>
              <Link to="/boards" className="fm-dash-link">
                Manage <ArrowRight size={12} />
              </Link>
            </div>

            {boardsLoading && <div className="fm-loading">Loading boards…</div>}

            {!boardsLoading && boardCounts.length === 0 && (
              <div className="fm-dash-empty-note">No boards yet.</div>
            )}

            {!boardsLoading &&
              boardCounts.map((b) => (
                <Link
                  key={b.id}
                  to={`/board/${b.id}`}
                  className="fm-dash-update"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="fm-dash-update-title">{b.name}</div>
                  <span className="fm-mono" style={{ marginLeft: "auto", fontSize: 12, color: "var(--ink-soft)" }}>
                    {b.count} feedback
                  </span>
                </Link>
              ))}
          </section>
        </div>

        {/* -------------------------------- roadmap + changelog -------------------------------- */}
        <div className="fm-dash-grid">
          <section>
            <div className="fm-dash-col-head">
              <h3 className="fm-display">Roadmap overview</h3>
              <Link to="/roadmap" className="fm-dash-link">
                Full roadmap <ArrowRight size={12} />
              </Link>
            </div>

            <ErrorBanner error={roadmapError} />

            {roadmapLoading && <div className="fm-loading">Loading roadmap…</div>}

            {!roadmapLoading && roadmapItems.length === 0 && !roadmapError && (
              <div className="fm-dash-empty-note">No roadmap items yet.</div>
            )}

            {!roadmapLoading && roadmapItems.length > 0 && (
              <div className="fm-stat-row" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                {["PLANNED", "IN_PROGRESS", "COMPLETE"].map((key) => (
                  <div className="fm-stat-card" key={key}>
                    <div>
                      <div className="fm-stat-value fm-mono">{roadmapCounts[key]}</div>
                      <div className="fm-stat-label">{ROADMAP_STATUS[key].label}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="fm-dash-col-head">
              <h3 className="fm-display">Recent changelog</h3>
              <Link to="/changelog" className="fm-dash-link">
                Full changelog <ArrowRight size={12} />
              </Link>
            </div>

            <ErrorBanner error={changelogError} />

            {changelogLoading && <div className="fm-loading">Loading changelog…</div>}

            {!changelogLoading && recentChangelog.length === 0 && !changelogError && (
              <div className="fm-dash-empty-note">No releases yet.</div>
            )}

            {!changelogLoading &&
              recentChangelog.map((entry) => (
                <div className="fm-dash-update" key={entry.id}>
                  <Flag size={14} color="var(--brass)" />
                  <div>
                    <div className="fm-dash-update-title">{entry.title}</div>
                    <div className="fm-dash-update-date fm-mono">
                      {entry.status === "DRAFT" ? "Draft · " : ""}
                      {entry.publishedAt
                        ? new Date(entry.publishedAt).toLocaleDateString(undefined, {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Unscheduled"}
                    </div>
                  </div>
                </div>
              ))}
          </section>
        </div>
      </div>
    </>
  );
};

export default StaffDashboard;

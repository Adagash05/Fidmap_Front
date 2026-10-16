import { Link } from "react-router-dom";

import Header from "../../Header";
import ErrorBanner from "../ErrorBanner";
import EmptyState from "../../components/EmptyState";
import { insights as insightsApi } from "../../components/Api";
import { useAuth } from "../../hooks/useAuth";
import { useAsync } from "../../hooks/useAsync";
import { SubNav } from "../Decisions/decisionUi";

/* /insights — recurring themes and activity trends, computed from real requests. */
const Insights = () => {
  const { currentUser } = useAuth();
  const workspaceId = currentUser?.workspaceId;

  const { data, loading, error, reload } = useAsync(
    () => (workspaceId ? insightsApi.get(workspaceId) : Promise.resolve(null)),
    [workspaceId],
  );

  const maxWeek = Math.max(1, ...(data?.weekly || []).map((w) => Math.max(w.newRequests, w.newVotes)));

  return (
    <>
      <Header />

      <div className="fm-page-head">
        <div>
          <h1 className="fm-display">Insights</h1>
          <p className="fm-x-lede">What customers keep asking for, and how activity is moving.</p>
        </div>
      </div>

      <div className="fm-x-wrap">
        <SubNav active="insights" />
        <ErrorBanner error={error} onRetry={reload} />
        {loading && !data && <div className="fm-loading">Loading insights…</div>}

        {data && (
          <>
            <div className="fm-stat-row">
              <div className="fm-stat-card">
                <div className="fm-stat-value">{data.openRequests}</div>
                <div className="fm-stat-label">Open requests</div>
              </div>
              {Object.entries(data.byStatus).map(([status, count]) => (
                <div className="fm-stat-card" key={status}>
                  <div className="fm-stat-value">{count}</div>
                  <div className="fm-stat-label">{status.replace("_", " ").toLowerCase()}</div>
                </div>
              ))}
            </div>

            <section className="fm-card fm-x-panel">
              <h2 className="fm-display">Recurring themes</h2>
              <p className="fm-x-sub">{data.method}</p>
              {data.themes.length === 0 ? (
                <EmptyState title="No themes yet" description="Themes appear once two or more open requests share a term." />
              ) : (
                data.themes.map((t) => (
                  <details key={t.term} className="fm-x-theme">
                    <summary>
                      <strong>{t.term}</strong> — {t.requestCount} requests, {t.totalVotes} votes
                    </summary>
                    <ul>
                      {t.topRequests.map((p) => (
                        <li key={p.id}>
                          <Link to={`/priorities/${p.id}`}>{p.title}</Link> ({p.votes} votes)
                        </li>
                      ))}
                    </ul>
                  </details>
                ))
              )}
            </section>

            <section className="fm-card fm-x-panel">
              <h2 className="fm-display">Last 8 weeks</h2>
              <table className="fm-table">
                <thead>
                  <tr><th>Week of</th><th>New requests</th><th>New votes</th></tr>
                </thead>
                <tbody>
                  {data.weekly.map((w) => (
                    <tr key={w.weekStart}>
                      <td>{w.weekStart}</td>
                      <td>
                        <span className="fm-x-bar" style={{ width: `${(w.newRequests / maxWeek) * 120}px` }} /> {w.newRequests}
                      </td>
                      <td>
                        <span className="fm-x-bar alt" style={{ width: `${(w.newVotes / maxWeek) * 120}px` }} /> {w.newVotes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="fm-x-sub">Votes cast before vote timestamps were recorded are not included in weekly counts.</p>
            </section>
          </>
        )}
      </div>
    </>
  );
};

export default Insights;

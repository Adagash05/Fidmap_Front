import { Fragment, useState } from "react";
import { Link } from "react-router-dom";

import Header from "../../Header";
import ErrorBanner from "../ErrorBanner";
import EmptyState from "../../components/EmptyState";
import { decisions as decisionsApi } from "../../components/Api";
import { useAuth } from "../../hooks/useAuth";
import { useAsync } from "../../hooks/useAsync";
import {
  ConfidenceTag,
  Pager,
  RecommendationBadge,
  ScoreBreakdown,
  ScoreCell,
  SubNav,
  RECOMMENDATION,
} from "./decisionUi";

/*
 * /priorities — "what should we build next?"
 * Ranked by an explainable, versioned score computed on the server from real
 * evidence (supporters, linked survey responses, recent activity) plus your
 * team's own urgency / strategic-fit ratings. Expand a row to see exactly why.
 */
const Priorities = () => {
  const { currentUser } = useAuth();
  const workspaceId = currentUser?.workspaceId;

  const [page, setPage] = useState(0);
  const [includeClosed, setIncludeClosed] = useState(false);
  const [sort, setSort] = useState("score");
  const [open, setOpen] = useState(null);

  const { data, loading, error, reload } = useAsync(
    () =>
      workspaceId
        ? decisionsApi.priorities(workspaceId, { page, includeClosed, sort })
        : Promise.resolve(null),
    [workspaceId, page, includeClosed, sort],
  );

  const rows = data?.items || [];

  return (
    <>
      <Header />

      <div className="fm-page-head">
        <div>
          <h1 className="fm-display">What to build next</h1>
          <p className="fm-x-lede">
            Requests ranked by evidence, not volume. Open a row to see why it
            scored the way it did, then record a decision.
          </p>
        </div>
      </div>

      <div className="fm-x-wrap">
        <SubNav active="priorities" />

        <div className="fm-x-toolbar">
          <label className="fm-check">
            <input
              type="checkbox"
              checked={includeClosed}
              onChange={(e) => {
                setIncludeClosed(e.target.checked);
                setPage(0);
              }}
            />
            Include completed and rejected
          </label>

          <label className="fm-x-inline">
            Sort by
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(0);
              }}
            >
              <option value="score">Priority score</option>
              <option value="supporters">Supporters</option>
            </select>
          </label>
        </div>

        <ErrorBanner error={error} onRetry={reload} />

        {loading && !data && <div className="fm-loading">Scoring requests…</div>}

        {!loading && !error && rows.length === 0 && (
          <EmptyState
            title="Nothing to prioritise yet"
            description="Once customers submit and vote on requests, they appear here with an explained score."
          />
        )}

        {rows.length > 0 && (
          <div className="fm-table-wrap">
            <table className="fm-table">
              <thead>
                <tr>
                  <th>Request</th>
                  <th>Score</th>
                  <th>Recommendation</th>
                  <th>Supporters</th>
                  <th>Surveys</th>
                  <th>Effort</th>
                  <th>Decision</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <Fragment key={row.feedbackId}>
                    <tr>
                      <td style={{ whiteSpace: "normal", maxWidth: 320 }}>
                        <Link to={`/priorities/${row.feedbackId}`}>{row.title}</Link>
                        <div className="fm-x-sub">{row.boardName}</div>
                      </td>
                      <td>
                        <ScoreCell result={row.result} />
                      </td>
                      <td>
                        <RecommendationBadge value={row.result.recommendation} />
                        <div style={{ marginTop: 4 }}>
                          <ConfidenceTag value={row.result.confidence} />
                        </div>
                      </td>
                      <td>{row.supporters}</td>
                      <td>{row.surveyResponses}</td>
                      <td>{row.effort ? `${row.effort}/5` : "—"}</td>
                      <td>
                        {row.decidedAction
                          ? RECOMMENDATION[row.decidedAction]?.label
                          : "Not decided"}
                        {row.roadmapItemId && <div className="fm-x-sub">On roadmap</div>}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="fm-btn-ghost"
                          aria-expanded={open === row.feedbackId}
                          onClick={() =>
                            setOpen(open === row.feedbackId ? null : row.feedbackId)
                          }
                        >
                          {open === row.feedbackId ? "Hide why" : "Why?"}
                        </button>
                      </td>
                    </tr>
                    {open === row.feedbackId && (
                      <tr>
                        <td colSpan={8} style={{ background: "var(--fm-soft)" }}>
                          <ScoreBreakdown result={row.result} />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pager page={data} onPage={setPage} />
      </div>
    </>
  );
};

export default Priorities;

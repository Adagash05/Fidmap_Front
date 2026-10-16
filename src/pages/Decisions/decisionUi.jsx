import { Link } from "react-router-dom";

/* Shared presentation bits for the decision pages. */

export const RECOMMENDATION = {
  PRIORITIZE: { label: "Prioritize", color: "#15803d" },
  CONSIDER: { label: "Consider", color: "#2563eb" },
  INVESTIGATE: { label: "Investigate", color: "#b45309" },
  DEFER: { label: "Defer", color: "#64748b" },
  REJECT: { label: "Reject", color: "#dc2626" },
};

export const CONFIDENCE = {
  HIGH: { label: "High confidence", color: "#15803d" },
  MEDIUM: { label: "Medium confidence", color: "#b45309" },
  LOW: { label: "Low confidence", color: "#64748b" },
};

export function RecommendationBadge({ value }) {
  const meta = RECOMMENDATION[value] || { label: value, color: "#64748b" };
  return (
    <span className="fm-badge" style={{ background: meta.color }}>
      {meta.label}
    </span>
  );
}

export function ConfidenceTag({ value }) {
  const meta = CONFIDENCE[value] || { label: value, color: "#64748b" };
  return (
    <span className="fm-tag" style={{ color: meta.color, fontWeight: 600 }}>
      {meta.label}
    </span>
  );
}

/* Score with its honest range: "72 (range 55–88)" when evidence is missing. */
export function ScoreCell({ result }) {
  const uncertain = result.scoreLow !== result.scoreHigh;
  return (
    <div className="fm-x-score">
      <strong>{result.score}</strong>
      <span className="fm-x-range">
        {uncertain ? `range ${result.scoreLow}–${result.scoreHigh}` : "complete"}
      </span>
    </div>
  );
}

/* The "why": every component with its weight and the evidence behind it. */
export function ScoreBreakdown({ result }) {
  return (
    <div className="fm-x-breakdown">
      <p className="fm-x-reason">{result.reason}</p>

      <table className="fm-table" style={{ whiteSpace: "normal" }}>
        <thead>
          <tr>
            <th>Signal</th>
            <th>Value</th>
            <th>Weight</th>
            <th>Contribution</th>
            <th>Evidence</th>
          </tr>
        </thead>
        <tbody>
          {result.components.map((c) => (
            <tr key={c.key}>
              <td>{c.label}</td>
              <td>{c.value == null ? "—" : c.value}</td>
              <td>{c.weight}</td>
              <td>{c.value == null ? "excluded" : c.contribution}</td>
              <td>{c.explanation}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {result.missingEvidence?.length > 0 && (
        <p className="fm-x-missing">
          To raise confidence: {result.missingEvidence.join(" · ")}
        </p>
      )}

      <p className="fm-x-version">
        Scoring {result.version}. Missing signals are left out and the rest are
        re-weighted; effort is shown beside the score, never inside it.
      </p>
    </div>
  );
}

export function Pager({ page, onPage }) {
  if (!page || page.totalPages <= 1) return null;
  return (
    <div className="fm-x-pager">
      <button
        type="button"
        className="fm-btn-ghost"
        disabled={page.page <= 0}
        onClick={() => onPage(page.page - 1)}
      >
        Previous
      </button>
      <span>
        Page {page.page + 1} of {page.totalPages}
      </span>
      <button
        type="button"
        className="fm-btn-ghost"
        disabled={!page.hasNext}
        onClick={() => onPage(page.page + 1)}
      >
        Next
      </button>
    </div>
  );
}

export function SubNav({ active }) {
  const links = [
    ["/priorities", "Priorities", "priorities"],
    ["/duplicates", "Duplicates", "duplicates"],
    ["/insights", "Insights", "insights"],
    ["/surveys", "Surveys", "surveys"],
  ];
  return (
    <nav className="fm-x-subnav" aria-label="Decision tools">
      {links.map(([to, label, key]) => (
        <Link key={key} to={to} className={key === active ? "active" : ""}>
          {label}
        </Link>
      ))}
    </nav>
  );
}

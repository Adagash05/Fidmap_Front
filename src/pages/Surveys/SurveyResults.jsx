import ErrorBanner from "../ErrorBanner";
import { surveys as surveysApi } from "../../components/Api";
import { useAsync } from "../../hooks/useAsync";

/* Aggregated results — computed from stored answers only. */
const SurveyResults = ({ surveyId }) => {
  const { data, loading, error, reload } = useAsync(() => surveysApi.results(surveyId), [surveyId]);

  if (loading && !data) return <div className="fm-loading">Loading results…</div>;
  if (error) return <ErrorBanner error={error} onRetry={reload} />;
  if (!data) return null;

  return (
    <div className="fm-x-results">
      <p>
        <strong>{data.responseCount}</strong> response{data.responseCount === 1 ? "" : "s"}
      </p>

      {data.responseCount === 0 && <p className="fm-x-sub">No responses yet.</p>}

      {data.questions.map((q) => {
        const entries = Object.entries(q.distribution || {});
        const max = Math.max(1, ...entries.map(([, n]) => n));
        return (
          <div key={q.questionId} className="fm-x-result">
            <h4>{q.question}</h4>
            <div className="fm-x-sub">
              {q.answerCount} answer{q.answerCount === 1 ? "" : "s"}
              {q.averageRating != null && ` · average ${q.averageRating.toFixed(2)}/5`}
            </div>
            {entries.map(([label, count]) => (
              <div key={label} className="fm-x-distrow">
                <span className="fm-x-distlabel">{label}</span>
                <span className="fm-x-bar" style={{ width: `${(count / max) * 160}px` }} />
                <span>{count}</span>
              </div>
            ))}
            {(q.recentTextAnswers || []).length > 0 && (
              <ul className="fm-x-text">
                {q.recentTextAnswers.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SurveyResults;

import { useState } from "react";
import { Plus } from "lucide-react";

import Header from "../../Header";
import ErrorBanner from "../ErrorBanner";
import EmptyState from "../../components/EmptyState";
import ConfirmDialog from "../../components/ConfirmDialog";
import { surveys as surveysApi } from "../../components/Api";
import { useAuth } from "../../hooks/useAuth";
import { useAsync } from "../../hooks/useAsync";
import { SubNav } from "../Decisions/decisionUi";
import SurveyBuilderModal from "./SurveyBuilderModal";
import SurveyResults from "./SurveyResults";

const STATUS_COLOR = { DRAFT: "#64748b", PUBLISHED: "#15803d", CLOSED: "#b45309" };

/* /surveys — create, publish, share, and read results of customer surveys. */
const Surveys = () => {
  const { currentUser } = useAuth();
  const workspaceId = currentUser?.workspaceId;

  const [showCreate, setShowCreate] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [openResults, setOpenResults] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [copied, setCopied] = useState(null);

  const { data, loading, error, reload } = useAsync(
    () => (workspaceId ? surveysApi.list(workspaceId) : Promise.resolve(null)),
    [workspaceId],
  );

  const run = async (fn) => {
    setActionError(null);
    try {
      await fn();
      reload();
    } catch (e) {
      setActionError(e);
    }
  };

  const surveyUrl = (id) => `${window.location.origin}/survey/${id}`;

  const copy = async (id) => {
    try {
      await navigator.clipboard.writeText(surveyUrl(id));
      setCopied(id);
    } catch {
      setCopied(null);
    }
  };

  const items = data || [];

  return (
    <>
      <Header />

      <div className="fm-page-head">
        <div>
          <h1 className="fm-display">Surveys</h1>
          <p className="fm-x-lede">Ask customers directly, then link the answers to a request as evidence.</p>
        </div>
        <button type="button" className="fm-btn-primary" onClick={() => setShowCreate(true)} disabled={!workspaceId}>
          <Plus size={14} /> New survey
        </button>
      </div>

      <div className="fm-x-wrap">
        <SubNav active="surveys" />
        <ErrorBanner error={error || actionError} onRetry={reload} />
        {loading && !data && <div className="fm-loading">Loading surveys…</div>}

        {!loading && !error && items.length === 0 && (
          <EmptyState title="No surveys yet" description="Create a survey, publish it, and share the link." />
        )}

        {items.map((s) => (
          <div key={s.id} className="fm-card fm-x-panel">
            <div className="fm-x-panel-head">
              <h2 className="fm-display">{s.title}</h2>
              <span className="fm-badge" style={{ background: STATUS_COLOR[s.status] }}>{s.status.toLowerCase()}</span>
            </div>
            {s.description && <p>{s.description}</p>}
            <div className="fm-x-sub">
              {s.questions.length} question{s.questions.length === 1 ? "" : "s"} · {s.responseCount} response{s.responseCount === 1 ? "" : "s"}
            </div>

            <div className="fm-x-actions">
              {s.status === "DRAFT" && (
                <button type="button" className="fm-btn-primary" disabled={s.questions.length === 0} onClick={() => run(() => surveysApi.publish(s.id))}>
                  Publish
                </button>
              )}
              {s.status === "PUBLISHED" && (
                <>
                  <button type="button" className="fm-btn-ghost" onClick={() => copy(s.id)}>
                    {copied === s.id ? "Link copied" : "Copy public link"}
                  </button>
                  <button type="button" className="fm-btn-ghost" onClick={() => run(() => surveysApi.close(s.id))}>
                    Close survey
                  </button>
                </>
              )}
              <button type="button" className="fm-btn-ghost" onClick={() => setOpenResults(openResults === s.id ? null : s.id)}>
                {openResults === s.id ? "Hide results" : "Results"}
              </button>
              <button type="button" className="fm-btn-ghost" onClick={() => setDeleting(s)}>
                Delete
              </button>
            </div>

            {openResults === s.id && <SurveyResults surveyId={s.id} />}
          </div>
        ))}
      </div>

      {showCreate && (
        <SurveyBuilderModal
          workspaceId={workspaceId}
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            reload();
          }}
        />
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete survey"
          message={`This permanently deletes "${deleting.title}" and its responses. This can't be undone.`}
          onClose={() => setDeleting(null)}
          onConfirm={async () => {
            await surveysApi.remove(deleting.id);
            setDeleting(null);
            reload();
          }}
        />
      )}
    </>
  );
};

export default Surveys;

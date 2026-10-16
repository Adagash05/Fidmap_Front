import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import Header from "../../Header";
import ErrorBanner from "../ErrorBanner";
import {
  decisions as decisionsApi,
  roadmap as roadmapApi,
} from "../../components/Api";
import { useAuth } from "../../hooks/useAuth";
import { useAsync } from "../../hooks/useAsync";
import {
  ConfidenceTag,
  RECOMMENDATION,
  RecommendationBadge,
  ScoreBreakdown,
  ScoreCell,
} from "./decisionUi";

const SCALE = [1, 2, 3, 4, 5];

function ScaleSelect({ id, label, value, onChange, hint }) {
  return (
    <div className="fm-field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
      >
        <option value="">Not rated</option>
        {SCALE.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <div className="fm-x-sub">{hint}</div>
    </div>
  );
}

/*
 * /priorities/:feedbackId — the decision brief for one request:
 * the evidence, the explained score, your team's inputs, and a recorded,
 * auditable decision that can create or link a roadmap item in one step.
 */
const DecisionBrief = () => {
  const { feedbackId } = useParams();
  const { currentUser } = useAuth();
  const workspaceId = currentUser?.workspaceId;

  const brief = useAsync(() => decisionsApi.brief(feedbackId), [feedbackId]);
  const roadmap = useAsync(
    () => (workspaceId ? roadmapApi.get(workspaceId) : Promise.resolve(null)),
    [workspaceId],
  );

  const b = brief.data;

  return (
    <>
      <Header />

      <div className="fm-page-head">
        <div>
          <Link to="/priorities" className="fm-x-back">
            ← All priorities
          </Link>
          <h1 className="fm-display">{b?.title || "Decision brief"}</h1>
          {b && (
            <p className="fm-x-lede">
              {b.boardName} · status {b.status}
            </p>
          )}
        </div>
      </div>

      <div className="fm-x-wrap">
        <ErrorBanner error={brief.error} onRetry={brief.reload} />

        {brief.loading && !b && <div className="fm-loading">Loading brief…</div>}

        {b && (
          <BriefBody
            // Remount the forms with fresh server values after every save.
            key={`${b.history.length}-${b.inputs.urgency}-${b.inputs.strategic}-${b.inputs.effort}`}
            brief={b}
            feedbackId={feedbackId}
            roadmapItems={roadmap.data?.items || []}
            onChanged={brief.reload}
          />
        )}
      </div>
    </>
  );
};

function BriefBody({ brief: b, feedbackId, roadmapItems, onChanged }) {
  const [inputs, setInputs] = useState(b.inputs);
  const [inputsBusy, setInputsBusy] = useState(false);
  const [inputsError, setInputsError] = useState(null);

  const [action, setAction] = useState(b.result.recommendation);
  const [rationale, setRationale] = useState("");
  const [roadmapMode, setRoadmapMode] = useState("none");
  const [existingItemId, setExistingItemId] = useState("");
  const [newTitle, setNewTitle] = useState(b.title);
  const [targetDate, setTargetDate] = useState("");
  const [decideBusy, setDecideBusy] = useState(false);
  const [decideError, setDecideError] = useState(null);
  const [notice, setNotice] = useState(null);

  const overriding = action !== b.result.recommendation;
  const canRoadmap = action === "PRIORITIZE" || action === "CONSIDER";
  const needsRationale = overriding || action === "REJECT";

  const saveInputs = async () => {
    setInputsBusy(true);
    setInputsError(null);
    try {
      await decisionsApi.saveInputs(feedbackId, inputs);
      setNotice("Inputs saved — the score has been recalculated.");
      onChanged();
    } catch (e) {
      setInputsError(e);
    } finally {
      setInputsBusy(false);
    }
  };

  const decide = async (event) => {
    event.preventDefault();
    if (decideBusy) return;
    setDecideBusy(true);
    setDecideError(null);

    const body = { action, rationale: rationale.trim() || null };

    if (canRoadmap && roadmapMode === "existing" && existingItemId) {
      body.roadmapItemId = existingItemId;
    }
    if (canRoadmap && roadmapMode === "new") {
      body.newRoadmapItem = {
        title: newTitle.trim() || b.title,
        description: null,
        targetDate: targetDate || null,
      };
    }

    try {
      await decisionsApi.decide(feedbackId, body);
      setNotice("Decision recorded.");
      setRationale("");
      onChanged();
    } catch (e) {
      setDecideError(e);
    } finally {
      setDecideBusy(false);
    }
  };

  return (
    <>
      {notice && <div className="fm-x-notice">{notice}</div>}

      <section className="fm-card fm-x-panel">
        <div className="fm-x-panel-head">
          <h2 className="fm-display">Recommendation</h2>
          <div>
            <RecommendationBadge value={b.result.recommendation} />{" "}
            <ConfidenceTag value={b.result.confidence} />
          </div>
        </div>
        <ScoreCell result={b.result} />
        <ScoreBreakdown result={b.result} />
      </section>

      <section className="fm-card fm-x-panel">
        <h2 className="fm-display">Evidence</h2>
        <ul className="fm-x-facts">
          <li>
            <strong>{b.evidence.supporters}</strong> distinct supporters (author, voters, commenters)
          </li>
          <li>
            <strong>{b.evidence.surveyResponses}</strong> survey responses
            {b.evidence.surveyAverageRating != null &&
              ` · average rating ${b.evidence.surveyAverageRating.toFixed(1)}/5`}
          </li>
          <li>
            Last activity:{" "}
            {b.evidence.lastActivityAt
              ? new Date(b.evidence.lastActivityAt).toLocaleDateString()
              : "unknown"}
          </li>
        </ul>
        {b.description && <p className="fm-x-desc">{b.description}</p>}

        <h3 className="fm-x-subhead">Where this evidence comes from</h3>
        {b.linkedSurveys.length === 0 && b.mergedRequests.length === 0 && (
          <p className="fm-x-sub">
            No survey is linked and no duplicates were merged into this request.
            Link a survey to this request to add structured evidence.
          </p>
        )}
        {b.linkedSurveys.length > 0 && (
          <ul className="fm-x-facts">
            {b.linkedSurveys.map((sv) => (
              <li key={sv.id}>
                Survey “{sv.title}” ({sv.status.toLowerCase()}): {sv.responses} response
                {sv.responses === 1 ? "" : "s"} —{" "}
                <Link to="/surveys">view results</Link>
              </li>
            ))}
          </ul>
        )}
        {b.mergedRequests.length > 0 && (
          <>
            <p className="fm-x-sub">Duplicate requests merged into this one (their votes are counted here):</p>
            <ul className="fm-x-facts">
              {b.mergedRequests.map((m) => (
                <li key={m.id}>{m.title}</li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="fm-card fm-x-panel">
        <h2 className="fm-display">Your team&apos;s inputs</h2>
        <p className="fm-x-sub">
          Optional. Leave a rating empty if you do not know — it is then left
          out of the score rather than guessed.
        </p>
        <ErrorBanner error={inputsError} />
        <div className="fm-field-row">
          <ScaleSelect
            id="in-urgency"
            label="Urgency"
            value={inputs.urgency}
            hint="1 = can wait, 5 = customers are blocked"
            onChange={(v) => setInputs({ ...inputs, urgency: v })}
          />
          <ScaleSelect
            id="in-strategic"
            label="Strategic fit"
            value={inputs.strategic}
            hint="1 = off-strategy, 5 = core to the plan"
            onChange={(v) => setInputs({ ...inputs, strategic: v })}
          />
          <ScaleSelect
            id="in-effort"
            label="Effort"
            value={inputs.effort}
            hint="1 = trivial, 5 = very large. Shown beside the score, not in it."
            onChange={(v) => setInputs({ ...inputs, effort: v })}
          />
        </div>
        <button
          type="button"
          className="fm-btn-primary"
          onClick={saveInputs}
          disabled={inputsBusy}
        >
          {inputsBusy ? "Saving…" : "Save inputs"}
        </button>
      </section>

      <section className="fm-card fm-x-panel">
        <h2 className="fm-display">Record a decision</h2>
        <ErrorBanner error={decideError} />
        <form onSubmit={decide}>
          <div className="fm-field">
            <label htmlFor="dec-action">Decision</label>
            <select id="dec-action" value={action} onChange={(e) => setAction(e.target.value)}>
              {Object.entries(RECOMMENDATION).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label}
                  {key === b.result.recommendation ? " (recommended)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="fm-field">
            <label htmlFor="dec-why">
              Rationale{needsRationale ? " (required)" : " (optional)"}
            </label>
            <textarea
              id="dec-why"
              rows={3}
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              placeholder={
                overriding
                  ? "Why are you overriding the recommendation?"
                  : "Anything the team should remember about this call"
              }
              required={needsRationale}
            />
          </div>

          {canRoadmap && (
            <fieldset className="fm-x-fieldset">
              <legend>Roadmap</legend>
              <label className="fm-check">
                <input
                  type="radio"
                  name="rm"
                  checked={roadmapMode === "none"}
                  onChange={() => setRoadmapMode("none")}
                />
                Don&apos;t add to the roadmap yet
              </label>
              <label className="fm-check">
                <input
                  type="radio"
                  name="rm"
                  checked={roadmapMode === "new"}
                  onChange={() => setRoadmapMode("new")}
                />
                Create a roadmap item from this request
              </label>
              {roadmapMode === "new" && (
                <div className="fm-field-row">
                  <div className="fm-field">
                    <label htmlFor="rm-title">Item title</label>
                    <input id="rm-title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                  </div>
                  <div className="fm-field">
                    <label htmlFor="rm-date">Target date (optional)</label>
                    <input id="rm-date" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} />
                  </div>
                </div>
              )}
              <label className="fm-check">
                <input
                  type="radio"
                  name="rm"
                  checked={roadmapMode === "existing"}
                  onChange={() => setRoadmapMode("existing")}
                  disabled={roadmapItems.length === 0}
                />
                Link to an existing roadmap item
              </label>
              {roadmapMode === "existing" && (
                <div className="fm-field">
                  <select value={existingItemId} onChange={(e) => setExistingItemId(e.target.value)} required>
                    <option value="">Choose an item…</option>
                    {roadmapItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </fieldset>
          )}

          <button type="submit" className="fm-btn-primary" disabled={decideBusy}>
            {decideBusy ? "Saving…" : "Record decision"}
          </button>
        </form>
      </section>

      <section className="fm-card fm-x-panel">
        <h2 className="fm-display">Decision history</h2>
        {b.history.length === 0 && <p className="fm-x-sub">No decisions recorded yet.</p>}
        {b.history.map((h) => (
          <div key={h.id} className="fm-x-history">
            <div>
              <RecommendationBadge value={h.decidedAction} />
              <span className="fm-x-sub">
                {" "}
                {new Date(h.decidedAt).toLocaleString()} · score {h.scoreSnapshot} ({h.confidence?.toLowerCase()} confidence, scoring {h.scoringVersion})
                {h.recommendedAction !== h.decidedAction &&
                  ` · overrode ${RECOMMENDATION[h.recommendedAction]?.label}`}
              </span>
            </div>
            {h.rationale && <p>{h.rationale}</p>}
            {h.roadmapItemId && (
              <Link to="/roadmap" className="fm-x-sub">
                View on roadmap
              </Link>
            )}
          </div>
        ))}
      </section>
    </>
  );
}

export default DecisionBrief;

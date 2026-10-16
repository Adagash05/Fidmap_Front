import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

import ErrorBanner from "../ErrorBanner";
import { surveys as surveysApi } from "../../components/Api";

const TYPES = [
  ["TEXT", "Free text"],
  ["SINGLE_CHOICE", "Single choice"],
  ["MULTIPLE_CHOICE", "Multiple choice"],
  ["RATING", "Rating (1–5)"],
];

const isChoice = (type) => type === "SINGLE_CHOICE" || type === "MULTIPLE_CHOICE";

const blankQuestion = () => ({ question: "", type: "TEXT", required: false, optionsText: "" });

/* Creates a DRAFT survey with its questions. Publishing is a separate, explicit step. */
const SurveyBuilderModal = ({ workspaceId, onClose, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([blankQuestion()]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const patch = (index, change) =>
    setQuestions((list) => list.map((q, i) => (i === index ? { ...q, ...change } : q)));

  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setError(null);

    try {
      await surveysApi.create(workspaceId, {
        title: title.trim(),
        description: description.trim() || null,
        questions: questions.map((q, index) => ({
          question: q.question.trim(),
          type: q.type,
          position: index,
          required: q.required,
          options: isChoice(q.type)
            ? q.optionsText.split("\n").map((o) => o.trim()).filter(Boolean)
            : null,
        })),
      });
      onCreated();
    } catch (e) {
      setError(e);
      setBusy(false);
    }
  };

  return (
    <div className="fm-overlay" onClick={onClose}>
      <div className="fm-modal fm-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="fm-modal-head">
          <div className="fm-display" style={{ fontWeight: 700, fontSize: 16 }}>New survey</div>
          <button className="fm-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <ErrorBanner error={error} />

        <form onSubmit={submit}>
          <div className="fm-field">
            <label htmlFor="sv-title">Title</label>
            <input id="sv-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} required autoFocus />
          </div>

          <div className="fm-field">
            <label htmlFor="sv-desc">Description (optional)</label>
            <textarea id="sv-desc" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          {questions.map((q, index) => (
            <div key={index} className="fm-x-question">
              <div className="fm-field-row">
                <div className="fm-field" style={{ flex: 3 }}>
                  <label htmlFor={`q-${index}`}>Question {index + 1}</label>
                  <input id={`q-${index}`} value={q.question} onChange={(e) => patch(index, { question: e.target.value })} maxLength={500} required />
                </div>
                <div className="fm-field">
                  <label htmlFor={`t-${index}`}>Type</label>
                  <select id={`t-${index}`} value={q.type} onChange={(e) => patch(index, { type: e.target.value })}>
                    {TYPES.map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {isChoice(q.type) && (
                <div className="fm-field">
                  <label htmlFor={`o-${index}`}>Options (one per line, at least 2)</label>
                  <textarea id={`o-${index}`} rows={3} value={q.optionsText} onChange={(e) => patch(index, { optionsText: e.target.value })} required />
                </div>
              )}

              <div className="fm-x-actions">
                <label className="fm-check">
                  <input type="checkbox" checked={q.required} onChange={(e) => patch(index, { required: e.target.checked })} />
                  Required
                </label>
                {questions.length > 1 && (
                  <button type="button" className="fm-btn-ghost" onClick={() => setQuestions((list) => list.filter((_, i) => i !== index))}>
                    <Trash2 size={14} /> Remove
                  </button>
                )}
              </div>
            </div>
          ))}

          <button type="button" className="fm-btn-ghost" onClick={() => setQuestions((list) => [...list, blankQuestion()])} disabled={questions.length >= 30}>
            <Plus size={14} /> Add question
          </button>

          <button type="submit" className="fm-btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 12 }} disabled={busy}>
            {busy ? "Saving…" : "Save as draft"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SurveyBuilderModal;

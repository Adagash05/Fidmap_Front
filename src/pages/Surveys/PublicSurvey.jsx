import { useState } from "react";
import { useParams } from "react-router-dom";

import Seo from "../../components/Seo";
import ErrorBanner from "../ErrorBanner";
import { surveys as surveysApi } from "../../components/Api";
import { useAsync } from "../../hooks/useAsync";

/* /survey/:surveyId — public, no sign-in. One response per email address. */
const PublicSurvey = () => {
  const { surveyId } = useParams();

  const { data: survey, loading, error } = useAsync(() => surveysApi.getPublic(surveyId), [surveyId]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [values, setValues] = useState({});
  const [busy, setBusy] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [done, setDone] = useState(false);

  const setValue = (id, value) => setValues((v) => ({ ...v, [id]: value }));

  const toggleMulti = (id, option) =>
    setValues((v) => {
      const current = v[id] || [];
      return {
        ...v,
        [id]: current.includes(option) ? current.filter((o) => o !== option) : [...current, option],
      };
    });

  const submit = async (event) => {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setSubmitError(null);

    const answers = survey.questions
      .map((q) => {
        const v = values[q.id];
        if (q.type === "MULTIPLE_CHOICE") return { questionId: q.id, answers: v || [] };
        return { questionId: q.id, answer: v == null ? "" : String(v) };
      })
      .filter((a) => (a.answers ? a.answers.length > 0 : a.answer !== ""));

    try {
      await surveysApi.submit(survey.id, { respondent: { name: name.trim(), email: email.trim() }, answers });
      setDone(true);
    } catch (e) {
      setSubmitError(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fm-auth-page">
      <Seo title="FIDMAP" description="FIDMAP" path={typeof window !== "undefined" ? window.location.pathname : "/"} noIndex />
      <div className="fm-auth-card" style={{ maxWidth: 640 }}>
        {loading && <div className="fm-loading">Loading survey…</div>}

        {error && (
          <ErrorBanner
            error={error.status === 404 ? { ...error, message: "This survey is not available." } : error}
          />
        )}

        {survey && done && (
          <>
            <h1 className="fm-auth-title">Thank you!</h1>
            <p className="fm-auth-subtitle">Your response to “{survey.title}” was recorded.</p>
          </>
        )}

        {survey && !done && (
          <form onSubmit={submit}>
            <h1 className="fm-auth-title">{survey.title}</h1>
            {survey.description && <p className="fm-auth-subtitle">{survey.description}</p>}

            <ErrorBanner error={submitError} />

            <div className="fm-field-row">
              <div className="fm-field">
                <label htmlFor="sp-name">Your name</label>
                <input id="sp-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} />
              </div>
              <div className="fm-field">
                <label htmlFor="sp-email">Email</label>
                <input id="sp-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>

            {survey.questions.map((q) => (
              <div key={q.id} className="fm-field">
                <label htmlFor={`sq-${q.id}`}>
                  {q.question}
                  {q.required ? " *" : ""}
                </label>

                {q.type === "TEXT" && (
                  <textarea id={`sq-${q.id}`} rows={3} value={values[q.id] || ""} onChange={(e) => setValue(q.id, e.target.value)} required={q.required} maxLength={2000} />
                )}

                {q.type === "SINGLE_CHOICE" &&
                  q.options.map((o) => (
                    <label key={o.id} className="fm-check">
                      <input type="radio" name={`sq-${q.id}`} checked={values[q.id] === o.value} onChange={() => setValue(q.id, o.value)} required={q.required} />
                      {o.value}
                    </label>
                  ))}

                {q.type === "MULTIPLE_CHOICE" &&
                  q.options.map((o) => (
                    <label key={o.id} className="fm-check">
                      <input type="checkbox" checked={(values[q.id] || []).includes(o.value)} onChange={() => toggleMulti(q.id, o.value)} />
                      {o.value}
                    </label>
                  ))}

                {q.type === "RATING" && (
                  <div className="fm-x-rating" role="radiogroup" aria-label={q.question}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <label key={n} className="fm-check">
                        <input type="radio" name={`sq-${q.id}`} checked={values[q.id] === String(n)} onChange={() => setValue(q.id, String(n))} required={q.required} />
                        {n}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <button type="submit" className="fm-btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>
              {busy ? "Sending…" : "Submit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PublicSurvey;

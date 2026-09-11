import { Compass } from "lucide-react";

import ErrorBanner from "../ErrorBanner";

const WorkspaceForm = ({
  formData,
  handleChange,
  previousStep,
  handleSubmit,
  busy,
  error,
}) => {
  return (
    <div className="fm-auth-page">
      <div className="fm-brand fm-auth-brand">
        <div className="fm-brand-mark">
          <Compass size={18} />
        </div>
        <div className="fm-brand-name fm-display">fidmap</div>
      </div>

      <form className="fm-auth-card">
        <h1 className="fm-display fm-auth-title">Name your workspace</h1>
        <p className="fm-auth-subtitle">Step 2 of 2 — your workspace</p>

        <ErrorBanner error={error} />

        <div className="fm-field">
          <label htmlFor="name">Workspace name</label>
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Acme Inc."
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="button"
            className="fm-btn-ghost"
            onClick={previousStep}
            disabled={busy}
          >
            Back
          </button>

          <button
            type="submit"
            className="fm-btn-primary"
            style={{ flex: 1, justifyContent: "center" }}
            onClick={(e) => handleSubmit(e, formData)}
            disabled={busy}
          >
            {busy ? "Creating…" : "Create workspace"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkspaceForm;

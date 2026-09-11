import { createContext, useState } from "react";
import { X } from "lucide-react";

const IdentityContext = createContext();

export const IdentityProvider = ({ children }) => {
  function IdentityModal({ onClose, onSubmit, title = "One quick thing" }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const valid = name.trim().length > 0 && /\S+@\S+\.\S+/.test(email.trim());

    return (
      <div className="fm-overlay" onClick={onClose}>
        <div className="fm-modal" onClick={(e) => e.stopPropagation()}>
          <div className="fm-modal-head">
            <div
              className="fm-display"
              style={{ fontWeight: 700, fontSize: 16 }}
            >
              {title}
            </div>

            <button className="fm-close" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <p
            style={{
              fontSize: 12.5,
              color: "var(--ink-soft)",
              marginTop: -8,
              marginBottom: 16,
            }}
          >
            Just so we know who to credit — no account needed.
          </p>

          <div className="fm-field-row">
            <div className="fm-field">
              <label htmlFor="id-name">Name</label>

              <input
                id="id-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="fm-field">
              <label htmlFor="id-email">Email</label>

              <input
                id="id-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            className="fm-btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={!valid}
            onClick={() => onSubmit(name.trim(), email.trim())}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <IdentityContext.Provider
      value={{
        IdentityModal,
      }}
    >
      {children}
    </IdentityContext.Provider>
  );
};

export default IdentityContext;

import { useState } from "react";
import { X } from "lucide-react";

import ErrorBanner from "../ErrorBanner";
import { isValidReferralCode, buildReferralLink } from "../../utils/referral";

/*
 * POST /api/admin/referrals/partners — UNVERIFIED, see
 * docs/backend-api-requirements.md #16. Referral code is set once here and
 * never editable afterward (see PartnerDetailModal.jsx) — validated
 * client-side against the same pattern utils/referral.js uses to *accept*
 * a code from a URL, so a code this form would reject could never actually
 * be captured on a real referral link.
 */
const CreatePartnerModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [commission, setCommission] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const commissionValue = Number(commission);
  // email is genuinely optional on the backend (CreateReferralPartnerRequest
  // has no @NotBlank on it) — not required here either.
  const valid =
    name.trim().length > 0 &&
    isValidReferralCode(code.trim()) &&
    commission !== "" &&
    commissionValue >= 0 &&
    commissionValue <= 100;

  const submit = async (e) => {
    e.preventDefault();

    if (busy || !valid) return;

    setBusy(true);
    setError(null);

    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        referralCode: code.trim(),
        commissionPercentage: commissionValue,
      });
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  };

  return (
    <div className="fm-overlay" onClick={onClose}>
      <div className="fm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fm-modal-head">
          <div className="fm-display" style={{ fontWeight: 700, fontSize: 16 }}>
            Add referral partner
          </div>
          <button className="fm-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <ErrorBanner error={error} />

        <form onSubmit={submit}>
          <div className="fm-field">
            <label htmlFor="admin-partner-name">Name</label>
            <input
              id="admin-partner-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Kamal Osei"
              autoFocus
              autoComplete="off"
              required
            />
          </div>

          <div className="fm-field">
            <label htmlFor="admin-partner-email">Email</label>
            <input
              id="admin-partner-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="kamal@example.com"
              autoComplete="off"
              required
            />
          </div>

          <div className="fm-field-row">
            <div className="fm-field">
              <label htmlFor="admin-partner-code">Referral code</label>
              <input
                id="admin-partner-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="KAMAL"
                autoComplete="off"
                required
              />
            </div>

            <div className="fm-field">
              <label htmlFor="admin-partner-commission">Commission %</label>
              <input
                id="admin-partner-commission"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                placeholder="20"
                required
              />
            </div>
          </div>

          <p style={{ fontSize: 12, color: "var(--fm-muted)", marginTop: -4, marginBottom: 16 }}>
            The referral code can't be changed after creation — it may already be in
            a link. This becomes{" "}
            {code.trim() && isValidReferralCode(code.trim())
              ? buildReferralLink(code.trim())
              : buildReferralLink("CODE")}
            .
          </p>

          <button
            type="submit"
            className="fm-btn-primary"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={busy || !valid}
          >
            {busy ? "Adding…" : "Add partner"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePartnerModal;

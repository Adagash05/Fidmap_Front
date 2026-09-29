import { useEffect, useState } from "react";
import { X, Copy, Send } from "lucide-react";

import ErrorBanner from "../ErrorBanner";
import EmptyState from "../../components/EmptyState";
import { referralAdmin as referralAdminApi } from "../../components/Api";
import { formatMoneyMinor } from "../../utils/money";

/*
 * Opened from ReferralPartners.jsx. Two modes: view (default) and edit.
 *
 * Verified against the real backend (com.amsal.fidmap.referral.*, uploaded
 * 2026-09-27):
 * - UpdateReferralPartnerRequest has no referralCode field — it's not
 *   editable here, matching this system's own rule that a distributed code
 *   must stay stable.
 * - ReferralConversionResponse (GET .../conversions) does NOT include
 *   payoutStatus, paidAt, payoutReference or payoutNote — only the
 *   conversion's own EARNED/REVERSED status. The payout column below is
 *   deliberately absent; a note above the table explains why, rather than
 *   showing a fabricated status.
 * - The payout PUT endpoint itself has no controller mapping yet (see
 *   Api.js's referralAdmin banner) — the form still submits for real and
 *   will show the resulting 404 through the normal ErrorBanner once
 *   attempted, rather than pretending it's unavailable pre-emptively.
 */
const STATUS_OPTIONS = ["ACTIVE", "INACTIVE"];
const PAYOUT_OPTIONS = ["PENDING", "PAID", "REVERSED"];

const PayoutForm = ({ conversion, onClose, onSubmit }) => {
  const [status, setStatus] = useState("PAID");
  const [reference, setReference] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      await onSubmit(conversion.id, {
        status,
        payoutReference: reference.trim() || undefined,
        payoutNote: note.trim() || undefined,
      });
      onClose();
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
            Update payout — {conversion.product || conversion.id}
          </div>
          <button className="fm-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <ErrorBanner error={error} />

        <form onSubmit={submit}>
          <div className="fm-field">
            <label htmlFor="payout-status">Status</label>
            <select id="payout-status" value={status} onChange={(e) => setStatus(e.target.value)}>
              {PAYOUT_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="fm-field">
            <label htmlFor="payout-reference">Payout reference</label>
            <input
              id="payout-reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="BANK-TRANSFER-001"
              autoComplete="off"
            />
          </div>

          <div className="fm-field">
            <label htmlFor="payout-note">Note</label>
            <textarea
              id="payout-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Paid via bank transfer"
            />
          </div>

          <button type="submit" className="fm-btn-primary" style={{ width: "100%", justifyContent: "center" }} disabled={busy}>
            {busy ? "Saving…" : "Save payout"}
          </button>
        </form>
      </div>
    </div>
  );
};

const PartnerDetailModal = ({ partnerId, onClose, onUpdated }) => {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [saveError, setSaveError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [conversions, setConversions] = useState(null);
  const [conversionsError, setConversionsError] = useState(null);

  const [inviting, setInviting] = useState(false);
  const [inviteResult, setInviteResult] = useState(null);
  const [inviteError, setInviteError] = useState(null);

  const [copied, setCopied] = useState(false);
  const [payoutTarget, setPayoutTarget] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await referralAdminApi.getPartner(partnerId);
        if (!cancelled) setPartner(data);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    referralAdminApi
      .listPartnerConversions(partnerId)
      .then((data) => {
        if (!cancelled) setConversions(data || []);
      })
      .catch((e) => {
        if (!cancelled) setConversionsError(e);
      });

    return () => {
      cancelled = true;
    };
  }, [partnerId]);

  const startEdit = () => {
    setForm({
      name: partner.name || "",
      email: partner.email || "",
      commissionPercentage: partner.commissionPercentage ?? "",
      status: partner.status || "ACTIVE",
    });
    setEditing(true);
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setSaveError(null);
    try {
      const updated = await referralAdminApi.updatePartner(partnerId, {
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        commissionPercentage: Number(form.commissionPercentage),
        status: form.status,
      });
      setPartner(updated);
      setEditing(false);
      onUpdated?.();
    } catch (err) {
      setSaveError(err);
    } finally {
      setSaving(false);
    }
  };

  const copyLink = () => {
    if (!partner?.referralLink) return;
    navigator.clipboard.writeText(partner.referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const sendInvite = async () => {
    if (inviting) return;
    setInviting(true);
    setInviteError(null);
    try {
      const result = await referralAdminApi.invitePartner(partnerId);
      setInviteResult(result);
    } catch (err) {
      setInviteError(err);
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="fm-overlay" onClick={onClose}>
      <div className="fm-modal fm-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="fm-modal-head">
          <div className="fm-display" style={{ fontWeight: 700, fontSize: 16 }}>
            {partner?.name || "Partner"}
          </div>
          <button className="fm-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <ErrorBanner error={error} />
        {loading && <div className="fm-loading">Loading partner…</div>}

        {!loading && partner && !editing && (
          <>
            <div style={{ border: "1px solid var(--fm-border)", borderRadius: 10, overflow: "hidden", marginBottom: 20 }}>
              {[
                ["Email", partner.email || "—"],
                ["Referral code", partner.referralCode],
                ["Commission percentage", `${partner.commissionPercentage}%`],
                ["Status", partner.status],
                ["Referred customers", partner.referredCustomers ?? "—"],
                ["Revenue generated", formatMoneyMinor(partner.revenueAmountMinor)],
                ["Commission earned", formatMoneyMinor(partner.commissionAmountMinor)],
              ].map(([label, value], i) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "10px 14px",
                    borderTop: i === 0 ? "none" : "1px solid var(--fm-border)",
                    fontSize: 13.5,
                  }}
                >
                  <span style={{ color: "var(--fm-muted)" }}>{label}</span>
                  <span style={{ fontWeight: 600, textAlign: "right" }}>{value}</span>
                </div>
              ))}

              {partner.referralLink && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    padding: "10px 14px",
                    borderTop: "1px solid var(--fm-border)",
                    fontSize: 13.5,
                  }}
                >
                  <code style={{ fontSize: 12.5, color: "var(--fm-muted)", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {partner.referralLink}
                  </code>
                  <button type="button" className="fm-btn-ghost" style={{ flexShrink: 0, height: 28, padding: "0 10px" }} onClick={copyLink}>
                    <Copy size={12} />
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              )}
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
              <button type="button" className="fm-btn-ghost" onClick={startEdit}>
                Edit
              </button>
              <button type="button" className="fm-btn-ghost" onClick={sendInvite} disabled={inviting}>
                <Send size={13} />
                {inviting ? "Sending…" : "Invite partner"}
              </button>
            </div>

            <ErrorBanner error={inviteError} />
            {inviteResult && (
              <p style={{ fontSize: 12.5, color: "var(--fm-success)", marginTop: -12, marginBottom: 20 }}>
                Invitation created for {inviteResult.email}. Link: {inviteResult.invitationUrl}
              </p>
            )}

            <div className="fm-display" style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
              Conversions
            </div>
            <p style={{ fontSize: 12, color: "var(--fm-muted)", marginTop: -4, marginBottom: 12 }}>
              The backend doesn't currently return payout status on this list — use "Update
              payout" below to set it regardless.
            </p>

            <ErrorBanner error={conversionsError} />

            {conversions && conversions.length === 0 && (
              <EmptyState title="No conversions yet" description="Nothing has been attributed to this partner yet." />
            )}

            {conversions && conversions.length > 0 && (
              <div className="fm-table-wrap">
                <table className="fm-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Revenue</th>
                      <th>Commission %</th>
                      <th>Commission</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {conversions.map((c) => (
                      <tr key={c.id}>
                        <td>{c.product || "—"}</td>
                        <td>{formatMoneyMinor(c.revenueAmountMinor, c.currency)}</td>
                        <td>{c.commissionPercentage != null ? `${c.commissionPercentage}%` : "—"}</td>
                        <td>{formatMoneyMinor(c.commissionAmountMinor, c.currency)}</td>
                        <td>{c.status || "—"}</td>
                        <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}</td>
                        <td>
                          <button type="button" className="fm-btn-ghost" style={{ height: 28, padding: "0 10px", fontSize: 12 }} onClick={() => setPayoutTarget(c)}>
                            Update payout
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {!loading && partner && editing && (
          <form onSubmit={saveEdit}>
            <ErrorBanner error={saveError} />

            <div className="fm-field">
              <label htmlFor="edit-name">Name</label>
              <input id="edit-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>

            <div className="fm-field">
              <label htmlFor="edit-email">Email</label>
              <input id="edit-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className="fm-field-row">
              <div className="fm-field">
                <label htmlFor="edit-commission">Commission %</label>
                <input
                  id="edit-commission"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={form.commissionPercentage}
                  onChange={(e) => setForm({ ...form, commissionPercentage: e.target.value })}
                  required
                />
              </div>
              <div className="fm-field">
                <label htmlFor="edit-status">Status</label>
                <select id="edit-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <p style={{ fontSize: 12, color: "var(--fm-muted)", marginTop: -4, marginBottom: 16 }}>
              Referral code ({partner.referralCode}) can't be changed once issued.
            </p>

            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" className="fm-btn-ghost" onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="fm-btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={saving}>
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        )}

        {payoutTarget && (
          <PayoutForm
            conversion={payoutTarget}
            onClose={() => setPayoutTarget(null)}
            onSubmit={(id, body) => referralAdminApi.updatePayout(id, body)}
          />
        )}
      </div>
    </div>
  );
};

export default PartnerDetailModal;

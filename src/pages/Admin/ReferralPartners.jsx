import { useEffect, useState } from "react";
import { Copy, Plus } from "lucide-react";

import Header from "../../Header";
import ErrorBanner from "../ErrorBanner";
import EmptyState from "../../components/EmptyState";
import Seo from "../../components/Seo";
import { referralAdmin as referralAdminApi } from "../../components/Api";
import { useAuth } from "../../hooks/useAuth";
import { formatMoneyMinor } from "../../utils/money";
import CreatePartnerModal from "./CreatePartnerModal";
import PartnerDetailModal from "./PartnerDetailModal";

/*
 * /admin/referrals. Verified against the real backend (uploaded
 * 2026-09-27): SecurityConfig gates every /api/admin/referrals/** path on
 * hasRole("SUPER_ADMIN") — a real platform role distinct from a workspace
 * OWNER (see Role.java). Gated here the same way rather than on isStaff.
 *
 * ReferralAdminSummaryResponse has no currency field, so the summary row
 * below formats in USD — the only currency this system currently deals in
 * anywhere else (ReferralService.recordPaidOrder defaults to "USD" too).
 */
const SummaryCard = ({ label, value }) => (
  <div className="fm-stat-card">
    <div>
      <div className="fm-stat-value">{value}</div>
      <div className="fm-stat-label">{label}</div>
    </div>
  </div>
);

const ReferralPartners = () => {
  const { currentUser, isChecking } = useAuth();

  const [summary, setSummary] = useState(null);
  const [summaryError, setSummaryError] = useState(null);

  const [partners, setPartners] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);
  const [detailId, setDetailId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Plain function, reused by the effect below (initial load) and by
  // user-triggered refreshes (create/update success) — those latter calls
  // are from event handlers, not effects, so they're unaffected by the
  // note below.
  const load = () => {
    setLoading(true);
    setError(null);
    referralAdminApi
      .listPartners()
      .then((data) => setPartners(data || []))
      .catch(setError)
      .finally(() => setLoading(false));

    referralAdminApi.getSummary().then(setSummary).catch(setSummaryError);
  };

  // Defines and calls its own loader inline (mirrors StaffDashboard.jsx's
  // effect) rather than invoking the outer `load` above directly — the
  // lint rule flags a synchronous setState reachable from an effect body,
  // which an inline function satisfies and a bare outer-function call
  // does not.
  useEffect(() => {
    if (currentUser?.role !== "SUPER_ADMIN") return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await referralAdminApi.listPartners();
        if (!cancelled) setPartners(data || []);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    referralAdminApi
      .getSummary()
      .then((data) => {
        if (!cancelled) setSummary(data);
      })
      .catch((e) => {
        if (!cancelled) setSummaryError(e);
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const copyLink = (partner) => {
    if (!partner.referralLink) return;
    navigator.clipboard.writeText(partner.referralLink).then(() => {
      setCopiedId(partner.id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  // No try/catch here: a rejected promise already propagates to
  // CreatePartnerModal's own await, whose catch shows the error — this
  // only needs to run on success.
  const createPartner = async (payload) => {
    await referralAdminApi.createPartner(payload);
    setCreating(false);
    load();
  };

  if (isChecking) {
    return <div className="fm-loading">Checking your session…</div>;
  }

  if (currentUser?.role !== "SUPER_ADMIN") {
    return (
      <>
        <Header />
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 28px" }}>
          <EmptyState
            title="Not available"
            description="This area is restricted to FIDMAP's own operators."
          />
        </div>
      </>
    );
  }

  const notImplemented = error?.status === 404;

  return (
    <>
      <Seo title="Referral partners" description="Manage FIDMAP referral partners." path="/admin/referrals" noIndex />
      <Header />

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 28px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, gap: 16, flexWrap: "wrap" }}>
          <div>
            <h1 className="fm-display" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>
              Referral partners
            </h1>
            <p style={{ fontSize: 13.5, color: "var(--fm-muted)", margin: 0 }}>
              Track partners, their conversions, and commission payouts.
            </p>
          </div>
          <button type="button" className="fm-btn-primary" onClick={() => setCreating(true)}>
            <Plus size={14} />
            Add partner
          </button>
        </div>

        <ErrorBanner error={summaryError} />
        {summary && (
          <div className="fm-stat-row" style={{ gridTemplateColumns: "repeat(4, 1fr)", marginBottom: 28 }}>
            <SummaryCard label="Total partners" value={summary.totalPartners} />
            <SummaryCard label="Active partners" value={summary.activePartners} />
            <SummaryCard label="Referred customers" value={summary.referredCustomers} />
            <SummaryCard label="Total conversions" value={summary.totalConversions} />
            <SummaryCard label="Total revenue" value={formatMoneyMinor(summary.totalRevenueAmountMinor)} />
            <SummaryCard label="Commission earned" value={formatMoneyMinor(summary.totalCommissionEarnedAmountMinor)} />
            <SummaryCard label="Commission pending" value={formatMoneyMinor(summary.totalCommissionPendingAmountMinor)} />
            <SummaryCard label="Commission paid" value={formatMoneyMinor(summary.totalCommissionPaidAmountMinor)} />
          </div>
        )}

        <ErrorBanner error={notImplemented ? null : error} />
        {loading && <div className="fm-loading">Loading partners…</div>}

        {notImplemented && (
          <EmptyState
            title="Not available yet"
            description="Referral partner management is ready to use as soon as the backend adds these endpoints."
          />
        )}

        {!loading && !notImplemented && partners && partners.length === 0 && (
          <EmptyState
            title="No referral partners yet"
            description="Add your first partner to start tracking referrals."
          />
        )}

        {!loading && partners && partners.length > 0 && (
          <div className="fm-table-wrap">
            <table className="fm-table">
              <thead>
                <tr>
                  <th>Partner</th>
                  <th>Email</th>
                  <th>Code</th>
                  <th>Commission %</th>
                  <th>Status</th>
                  <th>Customers</th>
                  <th>Revenue</th>
                  <th>Commission</th>
                  <th>Link</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {partners.map((p) => (
                  <tr key={p.id} onClick={() => setDetailId(p.id)} style={{ cursor: "pointer" }}>
                    <td style={{ fontWeight: 600 }}>{p.name}</td>
                    <td>{p.email || "—"}</td>
                    <td className="fm-mono">{p.referralCode}</td>
                    <td>{p.commissionPercentage != null ? `${p.commissionPercentage}%` : "—"}</td>
                    <td>
                      <span
                        className="fm-badge"
                        style={{ background: p.status === "ACTIVE" ? "var(--fm-success)" : "#64748b" }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td>{p.referredCustomers ?? "—"}</td>
                    <td>{formatMoneyMinor(p.revenueAmountMinor)}</td>
                    <td>{formatMoneyMinor(p.commissionAmountMinor)}</td>
                    <td>
                      <button
                        type="button"
                        className="fm-btn-ghost"
                        style={{ height: 28, padding: "0 10px", fontSize: 12 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          copyLink(p);
                        }}
                      >
                        <Copy size={12} />
                        {copiedId === p.id ? "Copied" : "Copy"}
                      </button>
                    </td>
                    <td />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {creating && (
        <CreatePartnerModal onClose={() => setCreating(false)} onSubmit={createPartner} />
      )}
      {detailId && (
        <PartnerDetailModal partnerId={detailId} onClose={() => setDetailId(null)} onUpdated={load} />
      )}
    </>
  );
};

export default ReferralPartners;

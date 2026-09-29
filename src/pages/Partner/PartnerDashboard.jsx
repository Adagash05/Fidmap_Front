import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Copy, LogOut } from "lucide-react";

import ErrorBanner from "../ErrorBanner";
import EmptyState from "../../components/EmptyState";
import Seo from "../../components/Seo";
import { partnerPortal as partnerPortalApi } from "../../components/Api";
import { useAuth } from "../../hooks/useAuth";
import { formatMoneyMinor } from "../../utils/money";
import { PAYOUT_STATUS } from "../../constants/PAYOUT_STATUS";

/*
 * /partner/dashboard — Overview / Conversions / Profile tabs, mirroring
 * Settings.jsx's own tab pattern. Uses the existing staff AuthContext
 * (useAuth) throughout — verified against the real backend: a partner is
 * a plain `User` with role Role.PARTNER, authenticated the same as
 * everyone else (see PartnerProtectedRoute.jsx).
 *
 * Field names below are taken directly from the real DTOs
 * (PartnerDashboardResponse / PartnerConversionResponse /
 * ReferralPartnerProfileResponse in com.amsal.fidmap.referral, backend
 * uploaded 2026-09-27) — every figure is backend-supplied, nothing is
 * computed client-side.
 */
const TABS = [
  ["overview", "Overview"],
  ["conversions", "Conversions"],
  ["profile", "Profile"],
];

const StatCard = ({ label, value }) => (
  <div className="fm-stat-card">
    <div>
      <div className="fm-stat-value">{value}</div>
      <div className="fm-stat-label">{label}</div>
    </div>
  </div>
);

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // /partner/dashboard and /partner/profile both render this component —
  // one route per entry point, but no separate page, mirroring how
  // Settings.jsx's own tabs work (client-side tab state, not per-tab
  // URLs). Only the initial tab differs by which path was entered on.
  const [tab, setTab] = useState(
    location.pathname === "/partner/profile" ? "profile" : "overview",
  );
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const [conversions, setConversions] = useState(null);
  const [conversionsLoading, setConversionsLoading] = useState(false);
  const [conversionsError, setConversionsError] = useState(null);

  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    partnerPortalApi
      .getDashboard()
      .then((data) => {
        if (!cancelled) setDashboard(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (tab !== "conversions" || conversions !== null) return;

    let cancelled = false;

    (async () => {
      setConversionsLoading(true);
      try {
        const data = await partnerPortalApi.getConversions();
        if (!cancelled) setConversions(data || []);
      } catch (e) {
        if (!cancelled) setConversionsError(e);
      } finally {
        if (!cancelled) setConversionsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tab, conversions]);

  useEffect(() => {
    if (tab !== "profile" || profile !== null) return;

    let cancelled = false;

    (async () => {
      setProfileLoading(true);
      try {
        const data = await partnerPortalApi.getProfile();
        if (!cancelled) setProfile(data);
      } catch (e) {
        if (!cancelled) setProfileError(e);
      } finally {
        if (!cancelled) setProfileLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [tab, profile]);

  const handleSignOut = () => {
    logout();
    navigate("/partner/sign-in", { replace: true });
  };

  const copyLink = () => {
    const link = dashboard?.referralLink;
    if (!link) return;

    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const notImplemented = error?.status === 404;

  return (
    <>
      <Seo
        title="Partner dashboard"
        description="Your FIDMAP referral stats."
        path="/partner/dashboard"
        noIndex
      />

      <header className="fm-header">
        <Link
          to="/partner/dashboard"
          className="fm-brand"
          style={{ textDecoration: "none" }}
        >
          <div className="fm-brand-mark">
            <img src="/logo.svg" alt="FIDMAP" />
          </div>
          <div>
            <div className="fm-brand-name fm-display">fidmap</div>
            <div className="fm-brand-sub fm-mono">partner portal</div>
          </div>
        </Link>

        <div className="fm-header-actions">
          <button type="button" className="fm-btn-ghost" onClick={handleSignOut}>
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 28px 80px" }}>
        <h1 className="fm-display" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px" }}>
          {dashboard?.partnerName ? `Welcome, ${dashboard.partnerName}` : "Partner dashboard"}
        </h1>
        <p style={{ fontSize: 13.5, color: "var(--fm-muted)", margin: "0 0 16px" }}>
          Your referral link, conversions, and commission — all tracked by FIDMAP.
        </p>

        <div style={{ display: "flex", gap: 6, marginBottom: 20, borderBottom: "1px solid var(--fm-border)" }}>
          {TABS.map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`fm-tab${tab === key ? " active" : ""}`}
              style={{ borderRadius: "8px 8px 0 0" }}
            >
              {label}
            </button>
          ))}
        </div>

        {notImplemented ? (
          <EmptyState
            title="Not available yet"
            description="The partner dashboard is ready to use as soon as the backend adds these endpoints."
          />
        ) : (
          <>
            {tab === "overview" && (
              <>
                <ErrorBanner error={error} />
                {loading && <div className="fm-loading">Loading dashboard…</div>}

                {!loading && dashboard && (
                  <>
                    {dashboard.referralLink && (
                      <div
                        className="fm-card"
                        style={{ cursor: "default", alignItems: "center", marginBottom: 20 }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="fm-card-title">Your referral link</div>
                          <code style={{ fontSize: 13, color: "var(--fm-muted)" }}>
                            {dashboard.referralLink}
                          </code>
                        </div>
                        <button type="button" className="fm-btn-primary" onClick={copyLink}>
                          <Copy size={14} />
                          {copied ? "Copied" : "Copy link"}
                        </button>
                      </div>
                    )}

                    <div className="fm-stat-row" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                      <StatCard label="Referred customers" value={dashboard.referredCustomers ?? "—"} />
                      <StatCard label="Conversions" value={dashboard.conversions ?? "—"} />
                      <StatCard label="Pending conversions" value={dashboard.pendingConversions ?? "—"} />
                      <StatCard label="Reversed conversions" value={dashboard.reversedConversions ?? "—"} />
                      <StatCard
                        label="Revenue generated"
                        value={formatMoneyMinor(dashboard.revenueAmountMinor, dashboard.currency)}
                      />
                      <StatCard
                        label="Commission earned"
                        value={formatMoneyMinor(dashboard.commissionEarnedAmountMinor, dashboard.currency)}
                      />
                      <StatCard
                        label="Commission pending"
                        value={formatMoneyMinor(dashboard.commissionPendingAmountMinor, dashboard.currency)}
                      />
                      <StatCard
                        label="Commission paid"
                        value={formatMoneyMinor(dashboard.commissionPaidAmountMinor, dashboard.currency)}
                      />
                      <StatCard
                        label="Commission reversed"
                        value={formatMoneyMinor(dashboard.commissionReversedAmountMinor, dashboard.currency)}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {tab === "conversions" && (
              <>
                <ErrorBanner error={conversionsError} />
                {conversionsLoading && <div className="fm-loading">Loading conversions…</div>}

                {!conversionsLoading && conversions && conversions.length === 0 && (
                  <EmptyState
                    title="No conversions yet"
                    description="Share your referral link to start earning commissions."
                  />
                )}

                {!conversionsLoading && conversions && conversions.length > 0 && (
                  <div className="fm-table-wrap">
                    <table className="fm-table">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Revenue</th>
                          <th>Commission %</th>
                          <th>Commission</th>
                          <th>Status</th>
                          <th>Payout</th>
                          <th>Date</th>
                          <th>Paid date</th>
                          <th>Reference</th>
                        </tr>
                      </thead>
                      <tbody>
                        {conversions.map((c) => {
                          const payout = PAYOUT_STATUS[c.payoutStatus] || {
                            label: c.payoutStatus || "—",
                            color: "#64748b",
                          };
                          return (
                            <tr key={c.id}>
                              <td>{c.product || "—"}</td>
                              <td>{formatMoneyMinor(c.revenueAmountMinor, c.currency)}</td>
                              <td>{c.commissionPercentage != null ? `${c.commissionPercentage}%` : "—"}</td>
                              <td>{formatMoneyMinor(c.commissionAmountMinor, c.currency)}</td>
                              <td>{c.conversionStatus || "—"}</td>
                              <td>
                                <span className="fm-badge" style={{ background: payout.color }}>
                                  {payout.label}
                                </span>
                              </td>
                              <td>{c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}</td>
                              <td>{c.paidAt ? new Date(c.paidAt).toLocaleDateString() : "—"}</td>
                              <td>{c.payoutReference || "—"}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}

            {tab === "profile" && (
              <>
                <ErrorBanner error={profileError} />
                {profileLoading && <div className="fm-loading">Loading profile…</div>}

                {!profileLoading && profile && (
                  <div style={{ border: "1px solid var(--fm-border)", borderRadius: 10, overflow: "hidden", background: "#fff" }}>
                    {[
                      ["Name", profile.name],
                      ["Email", profile.email],
                      ["Referral code", profile.referralCode],
                      ["Referral link", profile.referralLink],
                      [
                        "Commission percentage",
                        profile.commissionPercentage != null ? `${profile.commissionPercentage}%` : "—",
                      ],
                      ["Status", profile.status],
                    ].map(([label, value], i) => (
                      <div
                        key={label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 12,
                          padding: "12px 14px",
                          borderTop: i === 0 ? "none" : "1px solid var(--fm-border)",
                          fontSize: 13.5,
                        }}
                      >
                        <span style={{ color: "var(--fm-muted)" }}>{label}</span>
                        <span style={{ fontWeight: 600, textAlign: "right" }}>{value || "—"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default PartnerDashboard;

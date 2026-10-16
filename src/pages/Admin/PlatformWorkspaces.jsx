import { useState } from "react";

import Header from "../../Header";
import ErrorBanner from "../ErrorBanner";
import EmptyState from "../../components/EmptyState";
import { platformAdmin } from "../../components/Api";
import { useAuth } from "../../hooks/useAuth";
import { useAsync } from "../../hooks/useAsync";
import { Pager } from "../Decisions/decisionUi";

/*
 * /admin/workspaces — SUPER_ADMIN directory of every workspace (name, owner,
 * seats, subscription state) plus the audit trail. The backend enforces the
 * role; this page only mirrors that for UX. Viewing the directory is itself audited.
 */
const PlatformWorkspaces = () => {
  const { currentUser, isChecking } = useAuth();
  const isSuper = currentUser?.role === "SUPER_ADMIN";

  const [q, setQ] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [auditPage, setAuditPage] = useState(0);

  const dir = useAsync(
    () => (isSuper ? platformAdmin.workspaces({ q: query, page }) : Promise.resolve(null)),
    [isSuper, query, page],
  );
  const audit = useAsync(
    () => (isSuper ? platformAdmin.audit({ page: auditPage }) : Promise.resolve(null)),
    [isSuper, auditPage],
  );

  if (isChecking) return <div className="fm-loading">Loading…</div>;

  if (!isSuper) {
    return (
      <>
        <Header />
        <EmptyState title="Not available" description="This page is for platform administrators." />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="fm-page-head">
        <h1 className="fm-display">Workspaces</h1>
      </div>

      <div className="fm-x-wrap">
        <form
          className="fm-searchrow"
          onSubmit={(e) => {
            e.preventDefault();
            setPage(0);
            setQuery(q.trim());
          }}
        >
          <input className="fm-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or slug" aria-label="Search workspaces" />
          <button type="submit" className="fm-btn-ghost">Search</button>
        </form>

        <ErrorBanner error={dir.error} onRetry={dir.reload} />
        {dir.loading && !dir.data && <div className="fm-loading">Loading…</div>}

        {dir.data && dir.data.items.length === 0 && <EmptyState title="No workspaces found" />}

        {dir.data && dir.data.items.length > 0 && (
          <div className="fm-table-wrap">
            <table className="fm-table">
              <thead>
                <tr><th>Name</th><th>Slug</th><th>Owner</th><th>Members</th><th>Plan</th><th>Access</th></tr>
              </thead>
              <tbody>
                {dir.data.items.map((w) => (
                  <tr key={w.id}>
                    <td>{w.name}</td>
                    <td>{w.slug}</td>
                    <td>{w.ownerEmail || "—"}</td>
                    <td>{w.members}</td>
                    <td>{w.plan || "—"}</td>
                    <td>{w.subscriptionStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pager page={dir.data} onPage={setPage} />

        <h2 className="fm-display" style={{ marginTop: 32 }}>Audit log</h2>
        <ErrorBanner error={audit.error} onRetry={audit.reload} />
        {audit.data && audit.data.items.length === 0 && <EmptyState title="No audit entries yet" />}
        {audit.data && audit.data.items.length > 0 && (
          <div className="fm-table-wrap">
            <table className="fm-table">
              <thead>
                <tr><th>When</th><th>Action</th><th>Target</th><th>Detail</th></tr>
              </thead>
              <tbody>
                {audit.data.items.map((a) => (
                  <tr key={a.id}>
                    <td>{new Date(a.createdAt).toLocaleString()}</td>
                    <td>{a.action}</td>
                    <td>{a.targetType ? `${a.targetType} ${a.targetId || ""}` : "—"}</td>
                    <td style={{ whiteSpace: "normal" }}>{a.detail || ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pager page={audit.data} onPage={setAuditPage} />
      </div>
    </>
  );
};

export default PlatformWorkspaces;

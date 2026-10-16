import { useState } from "react";

import Header from "../../Header";
import ErrorBanner from "../ErrorBanner";
import EmptyState from "../../components/EmptyState";
import { duplicates as duplicatesApi } from "../../components/Api";
import { useAuth } from "../../hooks/useAuth";
import { useAsync } from "../../hooks/useAsync";
import { Pager, SubNav } from "./decisionUi";

function PostBox({ post, label, kept, onKeep }) {
  return (
    <div className={`fm-x-dupbox${kept ? " kept" : ""}`}>
      <div className="fm-x-sub">{label}</div>
      <strong>{post?.title}</strong>
      {post?.description && <p>{post.description}</p>}
      <div className="fm-x-sub">
        {post?.votes ?? 0} votes · {post?.status}
      </div>
      <label className="fm-check">
        <input type="radio" checked={kept} onChange={onKeep} />
        Keep this one
      </label>
    </div>
  );
}

function Suggestion({ s, onDone, onError }) {
  const [keep, setKeep] = useState(s.target.id);
  const [busy, setBusy] = useState(false);

  const act = async (fn) => {
    setBusy(true);
    try {
      await fn();
      onDone();
    } catch (e) {
      onError(e);
      setBusy(false);
    }
  };

  return (
    <div className="fm-card fm-x-panel">
      <div className="fm-x-panel-head">
        <span className="fm-tag">{Math.round(s.similarity * 100)}% similar</span>
        <span className="fm-x-sub">{s.reason}</span>
      </div>

      <div className="fm-x-dupgrid">
        <PostBox post={s.target} label="Suggested to keep" kept={keep === s.target.id} onKeep={() => setKeep(s.target.id)} />
        <PostBox post={s.source} label="Suggested duplicate" kept={keep === s.source.id} onKeep={() => setKeep(s.source.id)} />
      </div>

      <p className="fm-x-sub">
        Merging moves the other request&apos;s votes onto the one you keep (nobody is
        counted twice), keeps its comments and history, and keeps its followers
        subscribed.
      </p>

      <div className="fm-x-actions">
        <button type="button" className="fm-btn-primary" disabled={busy} onClick={() => act(() => duplicatesApi.confirm(s.id, keep))}>
          Merge
        </button>
        <button type="button" className="fm-btn-ghost" disabled={busy} onClick={() => act(() => duplicatesApi.dismiss(s.id))}>
          Not a duplicate
        </button>
      </div>
    </div>
  );
}

/* /duplicates — human-reviewed duplicate detection. Nothing merges automatically. */
const Duplicates = () => {
  const { currentUser } = useAuth();
  const workspaceId = currentUser?.workspaceId;

  const [page, setPage] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState(null);
  const [actionError, setActionError] = useState(null);

  const { data, loading, error, reload } = useAsync(
    () => (workspaceId ? duplicatesApi.list(workspaceId, { page }) : Promise.resolve(null)),
    [workspaceId, page],
  );

  const scan = async () => {
    setScanning(true);
    setScanMessage(null);
    setActionError(null);
    try {
      const result = await duplicatesApi.scan(workspaceId);
      setScanMessage(`Compared ${result.comparedPosts} open requests; found ${result.created} new possible duplicate(s).`);
      setPage(0);
      reload();
    } catch (e) {
      setActionError(e);
    } finally {
      setScanning(false);
    }
  };

  const items = data?.items || [];

  return (
    <>
      <Header />

      <div className="fm-page-head">
        <div>
          <h1 className="fm-display">Possible duplicates</h1>
          <p className="fm-x-lede">
            Similar requests split votes and hide real demand. Review each pair and merge the true duplicates.
          </p>
        </div>
        <button type="button" className="fm-btn-primary" onClick={scan} disabled={scanning || !workspaceId}>
          {scanning ? "Scanning…" : "Scan for duplicates"}
        </button>
      </div>

      <div className="fm-x-wrap">
        <SubNav active="duplicates" />
        {scanMessage && <div className="fm-x-notice">{scanMessage}</div>}
        <ErrorBanner error={error || actionError} onRetry={reload} />
        {loading && !data && <div className="fm-loading">Loading…</div>}

        {!loading && !error && items.length === 0 && (
          <EmptyState title="No pending duplicates" description="Run a scan to compare your open requests." />
        )}

        {items.map((s) => (
          <Suggestion key={s.id} s={s} onDone={reload} onError={setActionError} />
        ))}

        <Pager page={data} onPage={setPage} />
      </div>
    </>
  );
};

export default Duplicates;

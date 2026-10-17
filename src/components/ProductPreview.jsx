import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  MessageCircle,
  Plus,
  Search,
  Triangle,
  X,
} from "lucide-react";

import {
  DEMO_COMPLETED,
  DEMO_DUPLICATE,
  DEMO_REQUESTS,
  DEMO_ROADMAP,
  DEMO_WORKSPACE,
} from "../content/demoWorkspace";
import { FEEDBACK_STATUS, ROADMAP_STATUS } from "../constants/STATUS";
import {
  ConfidenceTag,
  RECOMMENDATION,
  RecommendationBadge,
  ScoreBreakdown,
  ScoreCell,
} from "../pages/Decisions/decisionUi";

/*
 * Interactive preview of FIDMAP (home page). A simplified, clickable walk
 * through the REAL workflow, in the order the product actually works:
 *
 *   Collect   public board: search, status filter, sort, vote, new idea
 *   Organize  Priorities -> Duplicates: review a suggested pair, merge/dismiss
 *   Prioritize Priorities: explained score, range, confidence, "Why?"
 *   Decide    decision brief: team ratings, decision, rationale, roadmap
 *   Plan      Roadmap: the six real statuses, target dates
 *   Tell      status change -> the email followers actually receive
 *
 * Everything shown exists in the product. Labels, statuses, columns, form
 * fields and e-mail wording are the app's own. The data is a fictional
 * "Tallyfox" workspace (src/content/demoWorkspace.js). Scores are outputs of
 * the real scoring engine, not re-implemented here (the rating combinations
 * come from the pre-computed lookup in demoScoreLookup.js).
 */

const STEPS = [
  {
    key: "collect",
    label: "Collect",
    nav: "Boards",
    title: "Customers post and vote on a public board",
    text: "Anyone with the board link can search requests, filter by status, vote and submit an idea. They give a name and email, no account.",
    hint: "Vote for a request, filter by status, or open one.",
  },
  {
    key: "organize",
    label: "Organize",
    nav: "Priorities",
    title: "Merge duplicates so demand is not split",
    text: "FIDMAP suggests pairs of similar requests. Nothing merges on its own: you choose which one to keep, and votes move across without counting anyone twice.",
    hint: "Choose which request to keep, then merge.",
  },
  {
    key: "prioritize",
    label: "Prioritize",
    nav: "Priorities",
    title: "See what the evidence says, and why",
    text: "Each request gets a score from supporters, survey answers, recent activity and your team's ratings. Open “Why?” to see every signal, its weight and its evidence.",
    hint: "Click “Why?” on any row.",
  },
  {
    key: "decide",
    label: "Decide",
    nav: "Priorities",
    title: "Record a decision you can defend",
    text: "Rate urgency and strategic fit, then record your decision. Overriding the recommendation, or rejecting, needs a reason. You can create the roadmap item in the same step.",
    hint: "Change a rating, then record the decision.",
  },
  {
    key: "plan",
    label: "Plan",
    nav: "Roadmap",
    title: "Put it on the roadmap",
    text: "Roadmap items move through six statuses and can carry a target date. The request stays linked to its item.",
    hint: "Change an item's status to move it.",
  },
  {
    key: "tell",
    label: "Tell",
    nav: "Roadmap",
    title: "Tell the people who asked",
    text: "When a request or its roadmap item changes status, people who posted, voted or commented get an email with a one-click unsubscribe. Each update is sent once.",
    hint: "Change a status and see the email.",
  },
];

const NAV = ["Dashboard", "Boards", "Priorities", "Roadmap", "Changelog"];

const ROADMAP_ORDER = [
  "CONSIDERING",
  "PLANNED",
  "IN_PROGRESS",
  "TESTING",
  "COMPLETE",
  "CANCELLED",
];

/* Wording copied from the backend (FeedbackService.statusLabel / RoadmapItemService). */
const FEEDBACK_EMAIL_LABEL = {
  OPEN: "open",
  PLANNED: "planned",
  IN_PROGRESS: "in progress",
  COMPLETED: "completed",
  REJECTED: "not planned",
};
const ROADMAP_EMAIL_LABEL = {
  CONSIDERING: "being considered",
  PLANNED: "planned",
  IN_PROGRESS: "in progress",
  TESTING: "in testing",
  COMPLETE: "shipped",
  CANCELLED: "no longer planned",
};

const SCALE = [1, 2, 3, 4, 5];

const Badge = ({ meta }) => (
  <span className="fm-pv-badge" style={{ background: meta.color }}>
    {meta.label}
  </span>
);

const initialRequests = () =>
  [...DEMO_REQUESTS, DEMO_COMPLETED].map((r) => ({
    id: r.id,
    title: r.title,
    description: r.description,
    status: r.status,
    voteCount: r.voteCount,
    endUserName: r.endUserName,
    comments: r.comments || [],
  }));

const ratingKey = (u, s) => `${u ?? "-"}/${s ?? "-"}`;

const ProductPreview = () => {
  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState({});
  const [live, setLive] = useState("");

  /* collect */
  const [requests, setRequests] = useState(initialRequests);
  const [voted, setVoted] = useState({});
  const [identity, setIdentity] = useState(null);
  const [askIdentity, setAskIdentity] = useState(null); // pending action
  const [filters, setFilters] = useState([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Top");
  const [openId, setOpenId] = useState(null);
  const [showNew, setShowNew] = useState(false);

  /* organize */
  const [dup, setDup] = useState("pending");
  const [keep, setKeep] = useState(DEMO_DUPLICATE.keep.id);

  /* prioritize / decide */
  const [lookup, setLookup] = useState(null);
  const [whyId, setWhyId] = useState(null);
  const [prioSort, setPrioSort] = useState("score");
  const mc = DEMO_REQUESTS.find((r) => r.id === "multicurrency");
  const [ratings, setRatings] = useState({
    urgency: mc.evidence.urgency,
    strategic: mc.evidence.strategic,
  });
  const [action, setAction] = useState(null);
  const [rationale, setRationale] = useState("");
  const [rmMode, setRmMode] = useState("none");
  const [rmTitle, setRmTitle] = useState(mc.title);
  const [rmDate, setRmDate] = useState("");
  const [rmExisting, setRmExisting] = useState("");
  const [formError, setFormError] = useState("");
  const [decision, setDecision] = useState(null);

  /* plan / tell */
  const [roadmap, setRoadmap] = useState(DEMO_ROADMAP);
  const [sent, setSent] = useState([]);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    if (step < 2 || lookup) return;
    let cancelled = false;
    import("../content/demoScoreLookup").then((m) => {
      if (!cancelled) setLookup(m.DEMO_SCORE_LOOKUP);
    });
    return () => {
      cancelled = true;
    };
  }, [step, lookup]);

  const touch = (key) => setTouched((t) => (t[key] ? t : { ...t, [key]: true }));
  const go = (next) => {
    setStep(next);
    setOpenId(null);
    setShowNew(false);
    setEmail(null);
  };

  /* ------------------------------ derived ------------------------------ */
  const mcResult = lookup?.[ratingKey(ratings.urgency, ratings.strategic)] || mc.result;
  const recommended = mcResult.recommendation;
  const chosen = action || recommended;
  const overriding = chosen !== recommended;
  const needsReason = overriding || chosen === "REJECT";
  const canRoadmap = chosen === "PRIORITIZE" || chosen === "CONSIDER";

  const statusOf = (id) => requests.find((r) => r.id === id)?.status;

  const priorityRows = useMemo(() => {
    const rows = DEMO_REQUESTS.map((r) => {
      const isMc = r.id === "multicurrency";
      const result = isMc ? mcResult : r.result;
      const status = statusOf(r.id) || r.status;
      const dec = isMc ? decision : r.decision;
      return {
        id: r.id,
        title: r.title,
        board: ["xero", "slack"].includes(r.id) ? "Integrations" : "Feature requests",
        supporters: r.evidence.supporters,
        surveys: r.evidence.surveyResponses,
        effort: r.evidence.effort,
        result,
        status,
        decided: dec?.action || null,
        onRoadmap: Boolean(dec?.roadmapItemId),
      };
    }).filter((r) => r.status !== "COMPLETED" && r.status !== "REJECTED");
    rows.sort((a, b) =>
      prioSort === "supporters"
        ? b.supporters - a.supporters
        : b.result.score - a.result.score,
    );
    return rows;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mcResult, decision, prioSort, requests]);

  const visibleRequests = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = requests.filter(
      (r) =>
        (!q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)) &&
        (filters.length === 0 || filters.includes(r.status)),
    );
    if (sort === "Top") list = [...list].sort((a, b) => b.voteCount - a.voteCount);
    return list;
  }, [requests, query, filters, sort]);

  /* ------------------------------ actions ------------------------------ */
  const needIdentity = (fn) => (identity ? fn(identity) : setAskIdentity(() => fn));

  const toggleVote = (id) =>
    needIdentity(() => {
      touch("collect");
      setVoted((v) => ({ ...v, [id]: !v[id] }));
      setRequests((rs) =>
        rs.map((r) =>
          r.id === id ? { ...r, voteCount: r.voteCount + (voted[id] ? -1 : 1) } : r,
        ),
      );
    });

  const submitIdea = (title, details) =>
    needIdentity((who) => {
      setRequests((rs) => [
        {
          id: `new-${rs.length}`,
          title,
          description: details,
          status: "OPEN",
          voteCount: 0,
          endUserName: who.name,
          comments: [],
        },
        ...rs,
      ]);
      setShowNew(false);
      touch("collect");
      setLive(`Request “${title}” added to the board.`);
    });

  const merge = () => {
    setDup("merged");
    touch("organize");
    if (keep === DEMO_DUPLICATE.keep.id) {
      setRequests((rs) =>
        rs.map((r) =>
          r.id === "recurring" ? { ...r, voteCount: r.voteCount + DEMO_DUPLICATE.duplicate.votes } : r,
        ),
      );
    }
    setLive("Requests merged.");
  };

  const record = (event) => {
    event.preventDefault();
    if (needsReason && !rationale.trim()) {
      setFormError(
        chosen === "REJECT"
          ? "A reason is required to reject a request."
          : "Tell your team why you are overriding the recommendation.",
      );
      return;
    }
    setFormError("");
    let roadmapItemId = null;
    if (canRoadmap && rmMode === "new") {
      roadmapItemId = "rm-new";
      setRoadmap((items) => [
        ...items.filter((i) => i.id !== "rm-new" && i.id !== "rm-multicurrency"),
        {
          id: "rm-new",
          title: rmTitle.trim() || mc.title,
          description: "Invoice in the client's currency.",
          status: "PLANNED",
          targetDate: rmDate || null,
          feedbackId: "multicurrency",
        },
      ]);
    } else if (canRoadmap && rmMode === "existing" && rmExisting) {
      roadmapItemId = rmExisting;
    }
    setDecision({
      action: chosen,
      recommended,
      rationale: rationale.trim(),
      score: mcResult.score,
      confidence: mcResult.confidence,
      roadmapItemId,
    });
    // The backend keeps the public status in step: REJECT -> Rejected; on the roadmap and still Open -> Planned.
    setRequests((rs) =>
      rs.map((r) => {
        if (r.id !== "multicurrency") return r;
        if (chosen === "REJECT") return { ...r, status: "REJECTED" };
        if (roadmapItemId && r.status === "OPEN") return { ...r, status: "PLANNED" };
        return r;
      }),
    );
    touch("decide");
    setLive("Decision recorded.");
  };

  const setRoadmapStatus = (id, status) => {
    setRoadmap((items) => items.map((i) => (i.id === id ? { ...i, status } : i)));
    touch("plan");
  };

  /* ---- Tell: what the backend queues when a status changes ---- */
  const tellTarget = decision?.roadmapItemId
    ? { postId: "multicurrency", itemId: decision.roadmapItemId }
    : { postId: "recurring", itemId: "rm-recurring" };
  const tellPost = requests.find((r) => r.id === tellTarget.postId);
  const tellItem = roadmap.find((i) => i.id === tellTarget.itemId);
  const followers = DEMO_REQUESTS.find((r) => r.id === tellTarget.postId).evidence.supporters;

  const queueEmail = (eventKey, headline, noMail) => {
    touch("tell");
    if (noMail) {
      setEmail({ none: noMail });
      return;
    }
    if (sent.includes(eventKey)) {
      setEmail({ duplicate: true });
      return;
    }
    setSent((s) => [...s, eventKey]);
    setEmail({ subject: `Update on "${tellPost.title}"`, headline });
  };

  const changePostStatus = (status) => {
    const previous = tellPost.status;
    setRequests((rs) => rs.map((r) => (r.id === tellPost.id ? { ...r, status } : r)));
    if (status === previous) return;
    if (status === "OPEN") {
      queueEmail(`STATUS:${status}`, "", "Moving a request back to Open does not email anyone.");
      return;
    }
    queueEmail(
      `STATUS:${status}`,
      `"${tellPost.title}" is now ${FEEDBACK_EMAIL_LABEL[status]}`,
    );
  };

  const changeItemStatus = (status) => {
    const previous = tellItem.status;
    setRoadmapStatus(tellItem.id, status);
    if (status === previous) return;
    queueEmail(
      `ROADMAP:${tellItem.id}:${status}`,
      `"${tellPost.title}" is ${ROADMAP_EMAIL_LABEL[status]}`,
    );
  };

  /* ------------------------------ views ------------------------------ */
  const renderCollect = () => {
    const open = requests.find((r) => r.id === openId);

    if (open) {
      return (
        <div className="fm-pv-detail">
          <button type="button" className="fm-pv-back" onClick={() => setOpenId(null)}>
            ← Back to the board
          </button>
          <div className="fm-pv-detail-head">
            <Badge meta={FEEDBACK_STATUS[open.status]} />
          </div>
          <div className="fm-pv-detail-body">
            <VoteBox
              votes={open.voteCount}
              on={voted[open.id]}
              onToggle={() => toggleVote(open.id)}
            />
            <div>
              <h4>{open.title}</h4>
              <p>{open.description}</p>
              <span className="fm-pv-tag">submitted by {open.endUserName}</span>
            </div>
          </div>
          <div className="fm-pv-eyebrow">Comments</div>
          {open.comments.length === 0 && (
            <p className="fm-pv-muted">No comments yet.</p>
          )}
          {open.comments.map((c) => (
            <div className="fm-pv-comment" key={c.message}>
              <span className="fm-pv-avatar">{c.name.slice(0, 1)}</span>
              <div>
                <strong>{c.name}</strong>
                <p>{c.message}</p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="fm-pv-board">
        <div className="fm-pv-board-head">
          <div>
            <div className="fm-pv-eyebrow">Feedback board</div>
            <h3>Feature requests</h3>
            <p className="fm-pv-muted">Tell us what would make Tallyfox better for you.</p>
          </div>
          <button
            type="button"
            className="fm-pv-btn fm-pv-btn-primary"
            onClick={() => setShowNew(true)}
          >
            <Plus size={14} aria-hidden="true" /> New idea
          </button>
        </div>

        <div className="fm-pv-board-cols">
          <fieldset className="fm-pv-filters">
            <legend>Status</legend>
            {Object.entries(FEEDBACK_STATUS).map(([key, meta]) => (
              <label key={key}>
                <input
                  type="checkbox"
                  checked={filters.includes(key)}
                  onChange={() => {
                    touch("collect");
                    setFilters((f) =>
                      f.includes(key) ? f.filter((x) => x !== key) : [...f, key],
                    );
                  }}
                />
                <span className="fm-pv-dot" style={{ background: meta.color }} aria-hidden="true" />
                {meta.label}
              </label>
            ))}
          </fieldset>

          <div className="fm-pv-list">
            <div className="fm-pv-searchrow">
              <label className="fm-pv-search">
                <Search size={14} aria-hidden="true" />
                <span className="fm-sr-only">Search requests</span>
                <input
                  placeholder="Search requests"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <label className="fm-sr-only" htmlFor="pv-sort">Sort requests</label>
              <select id="pv-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option>Top</option>
                <option>New</option>
              </select>
            </div>

            {visibleRequests.length === 0 && (
              <div className="fm-pv-empty">No requests match these filters yet.</div>
            )}

            {visibleRequests.map((r, i) => (
              <div
                key={r.id}
                className={`fm-pv-idea${i === 0 && !touched.collect ? " fm-pv-pulse" : ""}`}
                role="button"
                tabIndex={0}
                onClick={() => setOpenId(r.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenId(r.id);
                  }
                }}
                aria-label={`Open request: ${r.title}`}
              >
                <VoteBox votes={r.voteCount} on={voted[r.id]} onToggle={() => toggleVote(r.id)} />
                <div className="fm-pv-idea-main">
                  <h4>{r.title}</h4>
                  <p>{r.description}</p>
                  <div className="fm-pv-idea-meta">
                    <Badge meta={FEEDBACK_STATUS[r.status]} />
                    <span className="fm-pv-tag">by {r.endUserName}</span>
                    <span className="fm-pv-comments">
                      <MessageCircle size={12} aria-hidden="true" />
                      {r.comments.length || "—"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {askIdentity && (
          <IdentityPrompt
            onCancel={() => setAskIdentity(null)}
            onSubmit={(who) => {
              setIdentity(who);
              const fn = askIdentity;
              setAskIdentity(null);
              fn(who);
            }}
          />
        )}
        {showNew && (
          <NewIdea onCancel={() => setShowNew(false)} onSubmit={submitIdea} />
        )}
      </div>
    );
  };

  const renderOrganize = () => (
    <div className="fm-pv-page">
      <PageHead title="Possible duplicates" lede="Similar requests split votes and hide real demand. Review each pair and merge the true duplicates." />
      <SubNav active="Duplicates" />
      {dup === "pending" && (
        <div className="fm-pv-panel">
          <div className="fm-pv-panel-head">
            <span className="fm-pv-tag">{Math.round(DEMO_DUPLICATE.similarity * 100)}% similar</span>
            <span className="fm-pv-muted">{DEMO_DUPLICATE.reason}</span>
          </div>
          <div className="fm-pv-dupgrid" role="radiogroup" aria-label="Which request should be kept?">
            <DupBox
              label="Suggested to keep"
              id={DEMO_DUPLICATE.keep.id}
              title={DEMO_DUPLICATE.keep.title}
              text={DEMO_REQUESTS[0].description}
              meta={`${DEMO_DUPLICATE.keep.votes} votes · IN_PROGRESS`}
              checked={keep === DEMO_DUPLICATE.keep.id}
              onPick={() => setKeep(DEMO_DUPLICATE.keep.id)}
              pulse={!touched.organize}
            />
            <DupBox
              label="Suggested duplicate"
              id={DEMO_DUPLICATE.duplicate.id}
              title={DEMO_DUPLICATE.duplicate.title}
              text={DEMO_DUPLICATE.duplicate.description}
              meta={`${DEMO_DUPLICATE.duplicate.votes} votes · OPEN`}
              checked={keep === DEMO_DUPLICATE.duplicate.id}
              onPick={() => setKeep(DEMO_DUPLICATE.duplicate.id)}
            />
          </div>
          <p className="fm-pv-muted">
            Merging moves the other request&apos;s votes onto the one you keep (nobody is counted
            twice), keeps its comments and history, and keeps its followers subscribed.
          </p>
          <div className="fm-pv-actions">
            <button type="button" className="fm-pv-btn fm-pv-btn-primary" onClick={merge}>
              Merge
            </button>
            <button
              type="button"
              className="fm-pv-btn"
              onClick={() => {
                setDup("dismissed");
                touch("organize");
                setLive("Pair dismissed.");
              }}
            >
              Not a duplicate
            </button>
          </div>
        </div>
      )}
      {dup === "merged" && (
        <div className="fm-pv-panel fm-pv-done">
          <Check size={16} aria-hidden="true" />
          <div>
            <strong>Merged.</strong>{" "}
            {keep === DEMO_DUPLICATE.keep.id
              ? `${DEMO_DUPLICATE.duplicate.votes} votes moved onto “${DEMO_DUPLICATE.keep.title}”, which now has ${
                  requests.find((r) => r.id === "recurring").voteCount
                } votes. Anyone who had voted on both is counted once.`
              : `“${DEMO_DUPLICATE.keep.title}” is merged into “${DEMO_DUPLICATE.duplicate.title}”.`}
            <button type="button" className="fm-pv-link" onClick={() => { setDup("pending"); setKeep(DEMO_DUPLICATE.keep.id); setRequests(initialRequests()); }}>
              Reset this step
            </button>
          </div>
        </div>
      )}
      {dup === "dismissed" && (
        <div className="fm-pv-panel fm-pv-done">
          <Check size={16} aria-hidden="true" />
          <div>
            <strong>Dismissed.</strong> This pair will not be suggested again.
            <button type="button" className="fm-pv-link" onClick={() => setDup("pending")}>
              Reset this step
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderPrioritize = () => (
    <div className="fm-pv-page">
      <PageHead title="What to build next" lede="Requests ranked by evidence, not volume. Open a row to see why it scored the way it did, then record a decision." />
      <SubNav active="Priorities" />
      <div className="fm-pv-toolbar">
        <label className="fm-pv-inline">
          Sort by
          <select value={prioSort} onChange={(e) => setPrioSort(e.target.value)}>
            <option value="score">Priority score</option>
            <option value="supporters">Supporters</option>
          </select>
        </label>
      </div>
      <div className="fm-pv-tablewrap">
        <table className="fm-pv-table">
          <thead>
            <tr>
              <th>Request</th>
              <th>Score</th>
              <th>Recommendation</th>
              <th>Supporters</th>
              <th>Surveys</th>
              <th>Effort</th>
              <th>Decision</th>
              <th><span className="fm-sr-only">Details</span></th>
            </tr>
          </thead>
          <tbody>
            {priorityRows.map((row, i) => (
              <PrioRow
                key={row.id}
                row={row}
                open={whyId === row.id}
                pulse={i === 0 && !touched.prioritize}
                onToggle={() => {
                  setWhyId(whyId === row.id ? null : row.id);
                  touch("prioritize");
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
      <p className="fm-pv-muted fm-pv-note">
        Scores come from FIDMAP&apos;s scoring engine (v1). In this demo the evidence is fixed.
        Missing signals are left out and shown as a wider range.
      </p>
    </div>
  );

  const renderDecide = () => (
    <div className="fm-pv-page">
      <button type="button" className="fm-pv-back" onClick={() => go(2)}>← All priorities</button>
      <PageHead title={mc.title} lede={`Feature requests · status ${FEEDBACK_STATUS[statusOf("multicurrency")].label}`} />
      <div className="fm-pv-panel">
        <div className="fm-pv-panel-head">
          <h4>Recommendation</h4>
          <div>
            <RecommendationBadge value={mcResult.recommendation} />{" "}
            <ConfidenceTag value={mcResult.confidence} />
          </div>
        </div>
        <ScoreCell result={mcResult} />
        <ScoreBreakdown result={mcResult} />
      </div>

      <div className="fm-pv-panel">
        <h4>Evidence</h4>
        <ul className="fm-pv-facts">
          <li><strong>{mc.evidence.supporters}</strong> distinct supporters (author, voters, commenters)</li>
          <li><strong>0</strong> survey responses</li>
        </ul>
        <p className="fm-pv-muted">
          No survey is linked and no duplicates were merged into this request. Link a survey to
          this request to add structured evidence.
        </p>
      </div>

      <div className="fm-pv-panel">
        <h4>Your team&apos;s inputs</h4>
        <p className="fm-pv-muted">
          Optional. Leave a rating empty if you do not know. It is then left out of the score
          rather than guessed.
        </p>
        <div className="fm-pv-fields">
          <RatingField
            id="pv-urgency"
            label="Urgency"
            hint="1 = can wait, 5 = customers are blocked"
            value={ratings.urgency}
            pulse={!touched.decide}
            onChange={(v) => { setRatings((r) => ({ ...r, urgency: v })); setAction(null); }}
          />
          <RatingField
            id="pv-strategic"
            label="Strategic fit"
            hint="1 = off-strategy, 5 = core to the plan"
            value={ratings.strategic}
            onChange={(v) => { setRatings((r) => ({ ...r, strategic: v })); setAction(null); }}
          />
          <div className="fm-pv-field">
            <label htmlFor="pv-effort">Effort</label>
            <select id="pv-effort" value="3" disabled>
              <option value="3">3</option>
            </select>
            <span className="fm-pv-muted">Shown beside the score, not in it.</span>
          </div>
        </div>
        {!lookup && <p className="fm-pv-muted">Loading scores…</p>}
      </div>

      <form className="fm-pv-panel" onSubmit={record} noValidate>
        <h4>Record a decision</h4>
        {decision && (
          <div className="fm-pv-done fm-pv-inline-done" role="status">
            <Check size={16} aria-hidden="true" />
            <div>
              <strong>Decision recorded: {RECOMMENDATION[decision.action].label}.</strong>{" "}
              Saved with score {decision.score} ({decision.confidence.toLowerCase()} confidence, scoring v1)
              {decision.roadmapItemId ? " and linked to the roadmap." : "."}
              {decision.rationale && <em> “{decision.rationale}”</em>}
            </div>
          </div>
        )}
        <div className="fm-pv-field">
          <label htmlFor="pv-action">Decision</label>
          <select id="pv-action" value={chosen} onChange={(e) => { setAction(e.target.value); setFormError(""); }}>
            {Object.entries(RECOMMENDATION).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}{key === recommended ? " (recommended)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="fm-pv-field">
          <label htmlFor="pv-why">Rationale{needsReason ? " (required)" : " (optional)"}</label>
          <textarea
            id="pv-why"
            rows={2}
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            placeholder={overriding ? "Why are you overriding the recommendation?" : "Anything the team should remember about this call"}
            aria-invalid={Boolean(formError)}
            aria-describedby={formError ? "pv-err" : undefined}
          />
          {formError && <span id="pv-err" className="fm-pv-error" role="alert">{formError}</span>}
        </div>
        {canRoadmap && (
          <fieldset className="fm-pv-fieldset">
            <legend>Roadmap</legend>
            <label><input type="radio" name="pv-rm" checked={rmMode === "none"} onChange={() => setRmMode("none")} /> Don&apos;t add to the roadmap yet</label>
            <label><input type="radio" name="pv-rm" checked={rmMode === "new"} onChange={() => setRmMode("new")} /> Create a roadmap item from this request</label>
            {rmMode === "new" && (
              <div className="fm-pv-fields">
                <div className="fm-pv-field">
                  <label htmlFor="pv-rm-title">Item title</label>
                  <input id="pv-rm-title" value={rmTitle} onChange={(e) => setRmTitle(e.target.value)} />
                </div>
                <div className="fm-pv-field">
                  <label htmlFor="pv-rm-date">Target date (optional)</label>
                  <input id="pv-rm-date" type="date" value={rmDate} onChange={(e) => setRmDate(e.target.value)} />
                </div>
              </div>
            )}
            <label><input type="radio" name="pv-rm" checked={rmMode === "existing"} onChange={() => setRmMode("existing")} /> Link to an existing roadmap item</label>
            {rmMode === "existing" && (
              <select aria-label="Existing roadmap item" value={rmExisting} onChange={(e) => setRmExisting(e.target.value)}>
                <option value="">Choose an item…</option>
                {roadmap.filter((i) => i.id !== "rm-new").map((i) => (
                  <option key={i.id} value={i.id}>{i.title}</option>
                ))}
              </select>
            )}
          </fieldset>
        )}
        <button type="submit" className="fm-pv-btn fm-pv-btn-primary">Record decision</button>
      </form>
    </div>
  );

  const renderPlan = () => (
    <div className="fm-pv-page">
      <PageHead title="Roadmap" lede={`${roadmap.length} / 100 roadmap items used.`} />
      <div className="fm-pv-roadmap">
        {ROADMAP_ORDER.map((status) => {
          const items = roadmap.filter((i) => i.status === status);
          const meta = ROADMAP_STATUS[status];
          return (
            <section className="fm-pv-col" key={status} aria-label={meta.label}>
              <header>
                <span className="fm-pv-dot" style={{ background: meta.color }} aria-hidden="true" />
                <strong>{meta.label}</strong>
                <span className="fm-pv-count">{items.length}</span>
              </header>
              {items.length === 0 && <div className="fm-pv-muted">Nothing here yet.</div>}
              {items.map((item, i) => (
                <article
                  className={`fm-pv-rm${item.id === "rm-new" || (i === 0 && !touched.plan && status === "PLANNED") ? " fm-pv-pulse" : ""}`}
                  key={item.id}
                >
                  <h5>{item.title}</h5>
                  {item.targetDate && <div className="fm-pv-muted">Target: {item.targetDate}</div>}
                  <label className="fm-sr-only" htmlFor={`pv-st-${item.id}`}>Status of {item.title}</label>
                  <select
                    id={`pv-st-${item.id}`}
                    value={item.status}
                    onChange={(e) => setRoadmapStatus(item.id, e.target.value)}
                  >
                    {ROADMAP_ORDER.map((s) => (
                      <option key={s} value={s}>{ROADMAP_STATUS[s].label}</option>
                    ))}
                  </select>
                </article>
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );

  const renderTell = () => (
    <div className="fm-pv-page">
      <PageHead title="Tell the people who asked" lede={`“${tellPost.title}” has ${followers} people following it.`} />
      <div className="fm-pv-tell">
        <div className="fm-pv-panel">
          <h4>Change a status</h4>
          <div className="fm-pv-field">
            <label htmlFor="pv-tell-post">Request status</label>
            <select id="pv-tell-post" value={tellPost.status} onChange={(e) => changePostStatus(e.target.value)}>
              {Object.entries(FEEDBACK_STATUS).map(([k, m]) => (
                <option key={k} value={k}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="fm-pv-field">
            <label htmlFor="pv-tell-item">Roadmap item status ({tellItem.title})</label>
            <select id="pv-tell-item" value={tellItem.status} onChange={(e) => changeItemStatus(e.target.value)}>
              {ROADMAP_ORDER.map((s) => (
                <option key={s} value={s}>{ROADMAP_STATUS[s].label}</option>
              ))}
            </select>
          </div>
          <p className="fm-pv-muted">
            Anyone who posted, voted or commented on a request follows it automatically.
          </p>
        </div>
        <div className="fm-pv-panel fm-pv-mail" aria-live="polite">
          <div className="fm-pv-eyebrow">Email to followers</div>
          {!email && <p className="fm-pv-muted">Change a status to see the email FIDMAP queues.</p>}
          {email?.none && <p className="fm-pv-muted">{email.none}</p>}
          {email?.duplicate && <p className="fm-pv-muted">Not sent again: this update was already emailed once.</p>}
          {email?.subject && (
            <div className="fm-pv-mailcard">
              <div className="fm-pv-mailsubject"><span>Subject</span>{email.subject}</div>
              <h5>{email.headline}</h5>
              <p>You are receiving this because you took part in this request.</p>
              <small>Stop receiving updates about this request</small>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const views = [renderCollect, renderOrganize, renderPrioritize, renderDecide, renderPlan, renderTell];
  const current = STEPS[step];
  const activeNav = current.nav;

  return (
    <div className="fm-pv" aria-label="Interactive preview of FIDMAP">
      <ol className="fm-pv-steps">
        {STEPS.map((s, i) => (
          <li key={s.key}>
            <button
              type="button"
              className={i === step ? "active" : i < step ? "done" : ""}
              aria-current={i === step ? "step" : undefined}
              onClick={() => go(i)}
            >
              <span className="fm-pv-stepnum">{i < step ? <Check size={12} aria-hidden="true" /> : i + 1}</span>
              {s.label}
            </button>
          </li>
        ))}
      </ol>

      <div className="fm-pv-layout">
        <aside className="fm-pv-guide">
          <div className="fm-pv-eyebrow">Step {step + 1} of {STEPS.length}</div>
          <h3>{current.title}</h3>
          <p>{current.text}</p>
          <div className={`fm-pv-try${touched[current.key] ? " is-done" : ""}`}>
            <span aria-hidden="true" className="fm-pv-try-dot" />
            <span>{touched[current.key] ? "Nice. That's how it works in FIDMAP." : `Try it: ${current.hint}`}</span>
          </div>
          <div className="fm-pv-guide-actions">
            <button type="button" className="fm-pv-btn" onClick={() => go(step - 1)} disabled={step === 0}>
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button type="button" className="fm-pv-btn fm-pv-btn-primary" onClick={() => go(step + 1)}>
                Next: {STEPS[step + 1].label} <ChevronRight size={14} aria-hidden="true" />
              </button>
            ) : (
              <a className="fm-pv-btn fm-pv-btn-primary" href="/help">
                Read the Help center <ArrowRight size={14} aria-hidden="true" />
              </a>
            )}
          </div>
        </aside>

        <div className="fm-pv-window" role="region" aria-label="Demo of the FIDMAP app">
          <div className="fm-pv-chrome">
            <div className="fm-pv-brand">
              <img src="/logo.svg" alt="" width="22" height="22" />
              <strong>fidmap</strong>
            </div>
            <nav className="fm-pv-nav" aria-label="Demo navigation">
              {NAV.map((n) => (
                <span key={n} className={n === activeNav ? "active" : ""}>{n}</span>
              ))}
            </nav>
            <span className="fm-pv-demo-pill">Demo: {DEMO_WORKSPACE.name}, sample data</span>
          </div>
          <div className="fm-pv-body">{views[step]()}</div>
        </div>
      </div>

      <p className="fm-pv-caption">
        This is an interactive preview of FIDMAP, with sample data from a fictional workspace. No
        signup required.
      </p>
      <div className="fm-sr-only" aria-live="polite">{live}</div>
    </div>
  );
};

/* ------------------------------ small parts ------------------------------ */

const VoteBox = ({ votes, on, onToggle }) => (
  <button
    type="button"
    className={`fm-pv-vote${on ? " on" : ""}`}
    aria-pressed={Boolean(on)}
    aria-label={on ? "Remove vote" : "Vote for this idea"}
    onClick={(e) => {
      e.stopPropagation();
      onToggle();
    }}
  >
    <Triangle size={13} fill={on ? "currentColor" : "none"} aria-hidden="true" />
    <span>{votes}</span>
  </button>
);

const PageHead = ({ title, lede }) => (
  <header className="fm-pv-pagehead">
    <h3>{title}</h3>
    <p className="fm-pv-muted">{lede}</p>
  </header>
);

const SubNav = ({ active }) => (
  <div className="fm-pv-subnav" aria-hidden="true">
    {["Priorities", "Duplicates", "Insights", "Surveys"].map((l) => (
      <span key={l} className={l === active ? "active" : ""}>{l}</span>
    ))}
  </div>
);

const DupBox = ({ label, id, title, text, meta, checked, onPick, pulse }) => (
  <label className={`fm-pv-dupbox${checked ? " on" : ""}${pulse ? " fm-pv-pulse" : ""}`}>
    <span className="fm-pv-muted">{label}</span>
    <strong>{title}</strong>
    <span>{text}</span>
    <span className="fm-pv-muted">{meta}</span>
    <span className="fm-pv-radio">
      <input type="radio" name="pv-keep" value={id} checked={checked} onChange={onPick} />
      Keep this one
    </span>
  </label>
);

const RatingField = ({ id, label, hint, value, onChange, pulse }) => (
  <div className="fm-pv-field">
    <label htmlFor={id}>{label}</label>
    <select
      id={id}
      className={pulse ? "fm-pv-pulse" : ""}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))}
    >
      <option value="">Not rated</option>
      {SCALE.map((n) => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
    <span className="fm-pv-muted">{hint}</span>
  </div>
);

const PrioRow = ({ row, open, onToggle, pulse }) => (
  <>
    <tr>
      <td data-label="Request">
        <strong>{row.title}</strong>
        <div className="fm-pv-muted">{row.board}</div>
      </td>
      <td data-label="Score"><ScoreCell result={row.result} /></td>
      <td data-label="Recommendation">
        <RecommendationBadge value={row.result.recommendation} />
        <div><ConfidenceTag value={row.result.confidence} /></div>
      </td>
      <td data-label="Supporters">{row.supporters}</td>
      <td data-label="Surveys">{row.surveys}</td>
      <td data-label="Effort">{row.effort ? `${row.effort}/5` : "—"}</td>
      <td data-label="Decision">
        {row.decided ? RECOMMENDATION[row.decided].label : "Not decided"}
        {row.onRoadmap && <div className="fm-pv-muted">On roadmap</div>}
      </td>
      <td>
        <button
          type="button"
          className={`fm-pv-btn${pulse ? " fm-pv-pulse" : ""}`}
          aria-expanded={open}
          onClick={onToggle}
        >
          {open ? "Hide why" : "Why?"}
        </button>
      </td>
    </tr>
    {open && (
      <tr className="fm-pv-why">
        <td colSpan={8}>
          <ScoreBreakdown result={row.result} />
        </td>
      </tr>
    )}
  </>
);

const IdentityPrompt = ({ onSubmit, onCancel }) => {
  const [name, setName] = useState("");
  const [mail, setMail] = useState("");
  const valid = name.trim() && /\S+@\S+\.\S+/.test(mail);
  return (
    <div className="fm-pv-modal" role="dialog" aria-modal="true" aria-label="Who are you?">
      <div className="fm-pv-modalcard">
        <div className="fm-pv-modalhead">
          <strong>Who are you?</strong>
          <button type="button" className="fm-pv-close" onClick={onCancel} aria-label="Close">
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        <p className="fm-pv-muted">Just so we know who to credit — no account needed.</p>
        <div className="fm-pv-fields">
          <div className="fm-pv-field">
            <label htmlFor="pv-id-name">Name</label>
            <input id="pv-id-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoFocus />
          </div>
          <div className="fm-pv-field">
            <label htmlFor="pv-id-mail">Email</label>
            <input id="pv-id-mail" value={mail} onChange={(e) => setMail(e.target.value)} placeholder="you@example.com" />
          </div>
        </div>
        <p className="fm-pv-muted">Demo only: nothing you type here is sent or stored.</p>
        <button
          type="button"
          className="fm-pv-btn fm-pv-btn-primary fm-pv-wide"
          disabled={!valid}
          onClick={() => onSubmit({ name: name.trim(), email: mail.trim() })}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

const NewIdea = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  return (
    <div className="fm-pv-modal" role="dialog" aria-modal="true" aria-label="New idea">
      <form
        className="fm-pv-modalcard"
        onSubmit={(e) => {
          e.preventDefault();
          if (title.trim()) onSubmit(title.trim(), details.trim());
        }}
      >
        <div className="fm-pv-modalhead">
          <strong>New idea</strong>
          <button type="button" className="fm-pv-close" onClick={onCancel} aria-label="Close">
            <X size={16} aria-hidden="true" />
          </button>
        </div>
        <div className="fm-pv-field">
          <label htmlFor="pv-ni-title">Title</label>
          <input id="pv-ni-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What should we build?" autoFocus />
        </div>
        <div className="fm-pv-field">
          <label htmlFor="pv-ni-body">Details</label>
          <textarea id="pv-ni-body" rows={3} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="What problem does this solve, and for whom?" />
        </div>
        <button type="submit" className="fm-pv-btn fm-pv-btn-primary fm-pv-wide" disabled={!title.trim()}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default ProductPreview;

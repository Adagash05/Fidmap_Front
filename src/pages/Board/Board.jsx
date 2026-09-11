import { useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Search, Plus } from "lucide-react";

import Header from "../../Header";
import ErrorBanner from "../ErrorBanner";
import Sidebar from "../SideBar";
import IdeaContext from "../../context/IdeaContext";
import IdentityContext from "../../context/IdentityContext";
import { useAuth } from "../../hooks/useAuth";
import {
  boards as boardsApi,
  feedback as feedbackApi,
  votes as votesApi,
} from "../../components/Api";

/* ----------------------------------------- board ------------------------------------------ */
/*
 * A single board's full feedback view: search, status filters, sorting,
 * submitting a new idea, voting, opening detail, and commenting. The board
 * is whichever :boardId the route points at — no default/hardcoded board.
 * Built on the same IdeaContext/IdentityContext primitives every other
 * feedback surface in the app uses, so behaviour is identical everywhere.
 */

const Board = () => {
  const { boardId } = useParams();

  const { IdeaCard, IdeaDetail, NewIdeaModal, useVisitor } =
    useContext(IdeaContext);
  const { IdentityModal } = useContext(IdentityContext);
  const { isStaff } = useAuth();

  const [visitor, setVisitor] = useVisitor(boardId);

  /* ------------------------------------- data state -------------------------------------- */

  const [board, setBoard] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [boardError, setBoardError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  /* -------------------------------------- ui state ---------------------------------------- */

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState([]);
  const [sort, setSort] = useState("Top");

  const [showNew, setShowNew] = useState(false);
  const [openIdea, setOpenIdea] = useState(null);
  const [votingId, setVotingId] = useState(null);
  const [identityRequest, setIdentityRequest] = useState(null);

  /* --------------------------------------- loading ----------------------------------------- */

  useEffect(() => {
    let cancelled = false;

    const loadBoard = async () => {
      try {
        const result = await boardsApi.get(boardId);

        if (!cancelled) {
          setBoard(result);
          setBoardError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setBoard(null);
          setBoardError(e);
        }
      }
    };

    loadBoard();

    return () => {
      cancelled = true;
    };
  }, [boardId]);

  useEffect(() => {
    let cancelled = false;

    const fetchIdeas = async () => {
      setLoading(true);

      try {
        const [list, voteStatuses] = await Promise.all([
          feedbackApi.list(boardId),
          // Bulk vote status for this board in one request — only once we
          // know who's asking. Falls back to [] (unvoted) for anonymous
          // visitors who haven't identified themselves yet.
          visitor?.email
            ? votesApi.boardStatus(boardId, visitor.email).catch(() => [])
            : Promise.resolve([]),
        ]);

        if (!cancelled) {
          const statusByPostId = new Map(
            (voteStatuses || []).map((v) => [String(v.feedbackPostId), v]),
          );

          setIdeas(
            (list || []).map((idea) => {
              const status = statusByPostId.get(String(idea.id));

              return {
                ...idea,
                voteCount: status?.voteCount ?? idea.voteCount,
                _voted: status?.votedByCurrentEndUser ?? false,
              };
            }),
          );

          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e);
          setIdeas([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchIdeas();

    return () => {
      cancelled = true;
    };
  }, [boardId, reloadKey, visitor?.email]);

  const reload = () => setReloadKey((value) => value + 1);

  /* -------------------------------------- identity ----------------------------------------- */

  const requestIdentity = (callback) => {
    setIdentityRequest(() => callback);
  };

  const handleIdentitySubmit = (name, email) => {
    const callback = identityRequest;

    setVisitor(name, email);
    setIdentityRequest(null);

    callback?.({ name, email });
  };

  /* ------------------------------------- filtering ------------------------------------------ */

  const filtered = useMemo(() => {
    let list = ideas.filter((idea) => {
      const normalizedSearch = search.trim().toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        (idea.title || "").toLowerCase().includes(normalizedSearch) ||
        (idea.description || "").toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter.length === 0 || statusFilter.includes(idea.status);

      return matchesSearch && matchesStatus;
    });

    if (sort === "Top") {
      list = [...list].sort((a, b) => (b.voteCount ?? 0) - (a.voteCount ?? 0));
    }
    // else: "New" keeps the backend's returned order. FeedbackPost.id is a
    // UUID (not a sequential Long), so it carries no recency signal to
    // sort by, and FeedbackDto has no createdAt — see
    // docs/backend-api-requirements.md.

    return list;
  }, [ideas, search, statusFilter, sort]);

  /* ---------------------------------------- voting ------------------------------------------- */

  const doVote = async (idea, identity = visitor) => {
    if (!identity) {
      requestIdentity((newIdentity) => doVote(idea, newIdentity));
      return;
    }

    setVotingId(idea.id);
    setError(null);

    try {
      const updated = await votesApi.toggle(idea.id, identity);
      const voted = updated?.votedByCurrentEndUser;

      setIdeas((previous) =>
        previous.map((item) => {
          if (item.id !== idea.id) return item;

          return {
            ...item,
            voteCount: updated?.voteCount ?? item.voteCount,
            _voted: voted ?? !item._voted,
          };
        }),
      );

      setOpenIdea((previous) => {
        if (!previous || previous.id !== idea.id) return previous;

        return {
          ...previous,
          voteCount: updated?.voteCount ?? previous.voteCount,
          _voted: voted ?? !previous._voted,
        };
      });
    } catch (e) {
      setError(e);
    } finally {
      setVotingId(null);
    }
  };

  /* ------------------------------------- create idea ----------------------------------------- */

  const submitIdea = async ({ title, description }) => {
    if (!visitor) return;

    await feedbackApi.create(
      {
        title,
        description,
        name: visitor.name,
        email: visitor.email,
      },
      boardId,
    );

    setShowNew(false);
    reload();
  };

  const openNewIdea = () => {
    if (visitor) {
      setShowNew(true);
    } else {
      requestIdentity(() => setShowNew(true));
    }
  };

  /* ------------------------------------ change status ----------------------------------------- */

  const changeStatus = async (idea, status) => {
    try {
      const updated = await feedbackApi.setStatus(idea.id, status, boardId);
      const nextStatus = updated?.status ?? status;

      setIdeas((previous) =>
        previous.map((item) =>
          item.id === idea.id ? { ...item, status: nextStatus } : item,
        ),
      );

      setOpenIdea((previous) =>
        previous && previous.id === idea.id
          ? { ...previous, status: nextStatus }
          : previous,
      );
    } catch (e) {
      setError(e);
    }
  };

  /* ----------------------------------------- render ------------------------------------------- */

  return (
    <>
      <Header />

      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "20px 28px 0",
        }}
      >
        <div className="fm-dash-eyebrow fm-mono">Feedback board</div>

        <h1
          className="fm-display"
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            margin: "0 0 4px",
          }}
        >
          {board?.name || "Feature requests"}
        </h1>

        {board?.description && (
          <p
            style={{
              fontSize: 13.5,
              color: "var(--ink-soft)",
              maxWidth: 620,
              lineHeight: 1.5,
              margin: "0 0 4px",
            }}
          >
            {board.description}
          </p>
        )}

        <ErrorBanner error={boardError} />
      </div>

      <div className="fm-body">
        <Sidebar
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <main className="fm-main">
          <div className="fm-searchrow">
            <div className="fm-search">
              <Search size={15} color="#5B6270" />

              <input
                placeholder="Search requests"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="fm-sort fm-mono"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option>Top</option>
              <option>New</option>
            </select>
          </div>

          <ErrorBanner error={error} onRetry={reload} />

          {loading && <div className="fm-loading">Loading requests…</div>}

          {!loading && filtered.length === 0 && !error && (
            <div className="fm-empty">
              {ideas.length === 0
                ? "No requests yet — be the first to drop a pin."
                : "No requests match these filters yet."}
            </div>
          )}

          {!loading &&
            filtered.map((idea) => (
              <IdeaCard
                key={idea.id}
                idea={idea}
                onOpen={setOpenIdea}
                onVote={doVote}
                votingId={votingId}
              />
            ))}
        </main>
      </div>

      <button
        type="button"
        className="fm-btn-primary"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 30,
        }}
        onClick={openNewIdea}
      >
        <Plus size={15} />
        New idea
      </button>

      {showNew && visitor && (
        <NewIdeaModal
          visitor={visitor}
          onClose={() => setShowNew(false)}
          onSubmit={submitIdea}
        />
      )}

      {openIdea && (
        <IdeaDetail
          idea={openIdea}
          visitor={visitor}
          isStaff={isStaff}
          onClose={() => setOpenIdea(null)}
          onVote={doVote}
          votingId={votingId}
          onStatusChange={changeStatus}
        />
      )}

      {identityRequest && (
        <IdentityModal
          onClose={() => setIdentityRequest(null)}
          onSubmit={handleIdentitySubmit}
        />
      )}
    </>
  );
};

export default Board;

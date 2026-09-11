import { createContext, useState, useEffect } from "react";
import { FEEDBACK_STATUS } from "../constants/STATUS";
import ErrorBanner from "../pages/ErrorBanner";
import VoteMarker from "../pages/VoteMarker";
import StatusBadge from "../pages/StatusBadge";
import { MessageCircle, Flag, X } from "lucide-react";
import { comments as commentsApi } from "../components/Api";

const IdeaContext = createContext();

export const IdeaProvider = ({ children }) => {
  /* ---------------------------------- idea card ----------------------------------- */

  function IdeaCard({ idea, onOpen, onVote, votingId }) {
    return (
      <div className="fm-card" onClick={() => onOpen(idea)}>
        <VoteMarker
          votes={idea.voteCount}
          voted={idea._voted}
          busy={votingId === idea.id}
          onToggle={() => onVote(idea)}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="fm-card-title fm-display">{idea.title}</div>

          <div className="fm-card-body">{idea.description}</div>

          <div className="fm-card-meta">
            <StatusBadge status={idea.status} map={FEEDBACK_STATUS} />

            {idea.endUserName && (
              <span className="fm-tag">by {idea.endUserName}</span>
            )}

            <span className="fm-comments-count">
              <MessageCircle size={13} />
              {idea._commentCount ?? "—"}
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* --------------------------------- new idea modal -------------------------------- */

  function NewIdeaModal({ visitor, onClose, onSubmit }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(null);

    const submit = async () => {
      if (!title.trim() || busy) return;

      setBusy(true);
      setError(null);

      try {
        await onSubmit({
          title: title.trim(),
          description: description.trim(),
        });
      } catch (e) {
        setError(e);
        setBusy(false);
      }
    };

    return (
      <div className="fm-overlay" onClick={onClose}>
        <div className="fm-modal" onClick={(e) => e.stopPropagation()}>
          <div className="fm-modal-head">
            <div>
              <div
                className="fm-display"
                style={{
                  fontWeight: 700,
                  fontSize: 17,
                }}
              >
                Drop a pin
              </div>

              <div
                style={{
                  fontSize: 12.5,
                  color: "var(--ink-soft)",
                  marginTop: 2,
                }}
              >
                Chart a new request on the board, as {visitor.name}.
              </div>
            </div>

            <button className="fm-close" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <ErrorBanner error={error} />

          <div className="fm-field">
            <label htmlFor="ni-title">Title</label>

            <input
              id="ni-title"
              placeholder="What should we build?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="fm-field">
            <label htmlFor="ni-body">Details</label>

            <textarea
              id="ni-body"
              placeholder="What problem does this solve, and for whom?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            className="fm-btn-primary"
            style={{
              width: "100%",
              justifyContent: "center",
            }}
            disabled={!title.trim() || busy}
            onClick={submit}
          >
            <Flag size={14} />
            {busy ? "Placing pin…" : "Place pin"}
          </button>
        </div>
      </div>
    );
  }

  /* ----------------------------------- idea detail ---------------------------------- */

  function IdeaDetail({
    idea,
    visitor,
    isStaff,
    onClose,
    onVote,
    votingId,
    onStatusChange,
  }) {
    const [commentList, setCommentList] = useState([]);
    const [commentLoading, setCommentLoading] = useState(true);
    const [commentError, setCommentError] = useState(null);
    const [text, setText] = useState("");
    const [posting, setPosting] = useState(false);
    const [reloadComments, setReloadComments] = useState(0);

    useEffect(() => {
      let cancelled = false;

      const fetchComments = async () => {
        setCommentLoading(true);

        try {
          const list = await commentsApi.list(idea.id);

          if (!cancelled) {
            setCommentList(list || []);
            setCommentError(null);
          }
        } catch (e) {
          if (!cancelled) {
            setCommentError(e);
            setCommentList([]);
          }
        } finally {
          if (!cancelled) {
            setCommentLoading(false);
          }
        }
      };

      fetchComments();

      return () => {
        cancelled = true;
      };
    }, [idea.id, reloadComments]);

    const retryComments = () => {
      setReloadComments((value) => value + 1);
    };

    const post = async () => {
      if (!text.trim() || !visitor || posting) return;

      setPosting(true);
      setCommentError(null);

      try {
        await commentsApi.create(idea.id, {
          message: text.trim(),
          name: visitor.name,
          email: visitor.email,
        });

        setText("");
        setReloadComments((value) => value + 1);
      } catch (e) {
        setCommentError(e);
      } finally {
        setPosting(false);
      }
    };

    return (
      <div className="fm-overlay" onClick={onClose}>
        <div
          className="fm-modal fm-modal-wide"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="fm-modal-head">
            {isStaff ? (
              <select
                className="fm-status-select"
                value={idea.status}
                onChange={(e) => onStatusChange(idea, e.target.value)}
              >
                {Object.entries(FEEDBACK_STATUS).map(([key, s]) => (
                  <option key={key} value={key}>
                    {s.label}
                  </option>
                ))}
              </select>
            ) : (
              <StatusBadge status={idea.status} map={FEEDBACK_STATUS} />
            )}

            <button className="fm-close" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>

          <div
            style={{
              display: "flex",
              gap: 14,
              marginBottom: 18,
            }}
          >
            <VoteMarker
              votes={idea.voteCount}
              voted={idea._voted}
              busy={votingId === idea.id}
              onToggle={() => onVote(idea)}
            />

            <div>
              <div
                className="fm-display"
                style={{
                  fontWeight: 700,
                  fontSize: 19,
                  marginBottom: 6,
                }}
              >
                {idea.title}
              </div>

              <div
                style={{
                  fontSize: 13.5,
                  color: "var(--ink-soft)",
                  lineHeight: 1.6,
                }}
              >
                {idea.description}
              </div>

              {idea.endUserName && (
                <div style={{ marginTop: 10 }}>
                  <span className="fm-tag">
                    submitted by {idea.endUserName}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--ink-soft)",
              marginBottom: 4,
            }}
          >
            Comments {commentLoading ? "" : `· ${commentList.length}`}
          </div>

          <ErrorBanner error={commentError} onRetry={retryComments} />

          {commentLoading && (
            <div className="fm-loading">Loading comments…</div>
          )}

          {!commentLoading && commentList.length === 0 && !commentError && (
            <div
              style={{
                fontSize: 13,
                color: "var(--ink-soft)",
                padding: "10px 0",
              }}
            >
              No comments yet — be the first to weigh in.
            </div>
          )}

          {!commentLoading &&
            commentList.map((c) => (
              <div className="fm-comment" key={c.id}>
                <div className="fm-avatar">
                  {(c.endUserName || "?").slice(0, 1).toUpperCase()}
                </div>

                <div>
                  <div className="fm-comment-meta">
                    <span className="fm-comment-name">
                      {c.endUserName || "Someone"}
                    </span>

                    {c.createdAt && (
                      <span className="fm-comment-date fm-mono">
                        {new Date(c.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </div>

                  <div className="fm-comment-text">{c.message}</div>
                </div>
              </div>
            ))}

          {visitor ? (
            <div
              style={{
                display: "flex",
                gap: 8,
                marginTop: 14,
              }}
            >
              <input
                style={{
                  flex: 1,
                  border: "1px solid var(--line)",
                  borderRadius: 8,
                  padding: "9px 11px",
                  fontSize: 13.5,
                  fontFamily: "inherit",
                }}
                placeholder="Add a comment"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    post();
                  }
                }}
              />

              <button
                className="fm-btn-primary"
                disabled={!text.trim() || posting}
                onClick={post}
              >
                {posting ? "Posting…" : "Post"}
              </button>
            </div>
          ) : (
            <div
              style={{
                fontSize: 12.5,
                color: "var(--ink-soft)",
                marginTop: 14,
              }}
            >
              Tell us who you are via the vote or new-idea flow to comment.
            </div>
          )}
        </div>
      </div>
    );
  }

  // Visitor identity is scoped per board (a board always belongs to one
  // workspace), not one global key shared across every workspace's boards
  // — otherwise identifying yourself on Workspace A's board would make you
  // appear as the same person on Workspace B's board. `scopeKey` is
  // typically the boardId. Falls back to a global "default" scope when
  // none is given, for any future caller that doesn't have a board in
  // context.
  function useVisitor(scopeKey = "default") {
    const nameKey = `fidmap.visitor_name.${scopeKey}`;
    const emailKey = `fidmap.visitor_email.${scopeKey}`;

    const readStored = () => {
      const name = localStorage.getItem(nameKey);
      const email = localStorage.getItem(emailKey);
      return name && email ? { name, email } : null;
    };

    const [visitor, setVisitor] = useState(readStored);

    // Router doesn't remount this component when only the :boardId param
    // changes (navigating board -> board reuses the same element), so the
    // useState initializer above won't re-run — re-read explicitly.
    useEffect(() => {
      setVisitor(readStored());
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scopeKey]);

    const save = (name, email) => {
      localStorage.setItem(nameKey, name);
      localStorage.setItem(emailKey, email);

      setVisitor({ name, email });
    };

    return [visitor, save];
  }

  return (
    <IdeaContext.Provider
      value={{
        IdeaDetail,
        IdeaCard,
        NewIdeaModal,
        useVisitor,
      }}
    >
      {children}
    </IdeaContext.Provider>
  );
};

export default IdeaContext;

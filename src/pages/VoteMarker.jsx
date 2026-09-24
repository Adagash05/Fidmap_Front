import { Triangle } from "lucide-react";

function VoteMarker({ votes, voted, busy, onToggle }) {
  return (
    <button
      className={`fm-vote${voted ? " on" : ""}`}
      disabled={busy}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-pressed={voted}
      aria-label={voted ? "Remove vote" : "Vote for this idea"}
    >
      <Triangle
        size={13}
        fill={voted ? "var(--fidmap-blue)" : "none"}
        color={voted ? "var(--fidmap-blue)" : "var(--fm-muted)"}
      />

      <span className="count">{votes ?? 0}</span>
    </button>
  );
}

export default VoteMarker;

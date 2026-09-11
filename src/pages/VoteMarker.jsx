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
        fill={voted ? "#B98A3D" : "none"}
        color={voted ? "#B98A3D" : "#5B6270"}
      />

      <span className="count">{votes ?? 0}</span>
    </button>
  );
}

export default VoteMarker;

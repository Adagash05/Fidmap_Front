function StatusBadge({ status, map }) {
  const s = map[status] || {
    label: status || "Unknown",
    color: "var(--slate)",
  };

  return (
    <span className="fm-badge" style={{ background: s.color }}>
      {s.label}
    </span>
  );
}

export default StatusBadge;

/*
 * Reusable empty-state block: a message plus an optional action. Used
 * anywhere a list can legitimately be empty (no boards yet, no feedback
 * yet, nothing published yet) — never left as a blank screen.
 */
const EmptyState = ({ title, description, action }) => (
  <div className="fm-empty-state">
    <div className="fm-empty-state-title">{title}</div>
    {description && (
      <div className="fm-empty-state-desc">{description}</div>
    )}
    {action && <div className="fm-empty-state-action">{action}</div>}
  </div>
);

export default EmptyState;

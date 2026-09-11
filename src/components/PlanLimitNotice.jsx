import { Link } from "react-router-dom";

/*
 * Small inline notice shown next to a "New X" action once the workspace's
 * current plan limit for that resource is reached (or a feature isn't on
 * the current plan at all, e.g. private boards). Links into the existing
 * Settings → Subscription tab rather than a new pricing route — Settings
 * reads `location.state.tab` to land directly on it.
 */
const PlanLimitNotice = ({ message, showUpgrade = true }) => (
  <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 6 }}>
    {message}
    {showUpgrade && (
      <>
        {" "}
        <Link
          to="/settings"
          state={{ tab: "subscription" }}
          style={{ color: "var(--brass)", fontWeight: 600 }}
        >
          Upgrade to Business
        </Link>
      </>
    )}
  </div>
);

export default PlanLimitNotice;

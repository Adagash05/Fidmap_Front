import { Link } from "react-router-dom";
import { TriangleAlert } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import { useEntitlements } from "../hooks/useEntitlements";

/*
 * Persistent notice for a workspace whose trial/subscription is no longer
 * active. The state comes from the backend (GET /api/billing/entitlements:
 * accessActive / accessReason), which is also what enforces it on every write
 * endpoint (HTTP 402), so this banner never decides access itself.
 *
 * Lifetime and active plans report accessActive = true and never see it.
 * Recovery stays reachable: Settings → Subscription is not blocked.
 */
const COPY = {
  TRIAL_EXPIRED: "Your free trial has ended.",
  PERIOD_ENDED: "Your subscription has expired.",
  SUBSCRIPTION_EXPIRED: "Your subscription has expired.",
  SUBSCRIPTION_CANCELED: "Your subscription was cancelled.",
  PAYMENT_PAST_DUE: "Your last payment failed.",
  SUBSCRIPTION_PAUSED: "Your subscription is paused.",
  NO_SUBSCRIPTION: "This workspace does not have an active plan.",
};

const SubscriptionBanner = () => {
  const { isStaff, currentUser } = useAuth();
  const { entitlements } = useEntitlements(isStaff ? currentUser?.workspaceId : null);

  if (!isStaff || !entitlements || entitlements.accessActive !== false) {
    return null;
  }

  const headline = COPY[entitlements.accessReason] || "Your subscription is not active.";
  const isOwner = currentUser?.role === "OWNER";
  const action = entitlements.accessReason === "TRIAL_EXPIRED" || entitlements.accessReason === "NO_SUBSCRIPTION"
    ? "Choose a plan"
    : "Renew subscription";

  return (
    <div className="fm-sub-banner" role="alert">
      <TriangleAlert size={18} aria-hidden="true" />
      <div>
        <strong>{headline}</strong>{" "}
        Your workspace is read-only until it has an active plan: you can still view your data, but
        creating or changing anything is paused.
      </div>
      {isOwner ? (
        <Link to="/settings" state={{ tab: "subscription" }} className="fm-btn-primary">
          {action}
        </Link>
      ) : (
        <span>Ask your workspace owner to renew.</span>
      )}
    </div>
  );
};

export default SubscriptionBanner;

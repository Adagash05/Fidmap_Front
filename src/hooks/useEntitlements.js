import { useCallback, useEffect, useState } from "react";

import { billing as billingApi } from "../components/Api";
import { planKeyFromBillingPlan } from "../constants/pricing";

/*
 * Single frontend abstraction for plan entitlements. The backend
 * (PlanEntitlementService / PlanDataInitializer) is the actual source of
 * truth for every number and feature flag below — this hook fetches
 * GET /api/billing/entitlements and hands it back mostly as-is, so there
 * is nothing here to keep in sync by hand when a limit changes server
 * side. A trial workspace's subscription plan is STARTUP_MONTHLY, so this
 * naturally returns Startup entitlements during a trial too — no separate
 * "trial" branch needed.
 *
 * `null` on any maxX field means "unlimited" (matches the backend's
 * Integer semantics), which the helpers below treat accordingly.
 */
export function useEntitlements(workspaceId) {
  const [entitlements, setEntitlements] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Pulled out into its own useCallback (mirrors BoardContext's
  // loadBoards) rather than calling setState directly in the effect body.
  const load = useCallback(async () => {
    if (!workspaceId) {
      setEntitlements(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await billingApi.getEntitlements(workspaceId);
      setEntitlements(result);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(() => {
      if (!cancelled) load();
    });

    return () => {
      cancelled = true;
    };
  }, [load, reloadKey]);

  const refresh = useCallback(() => setReloadKey((v) => v + 1), []);

  return { entitlements, loading, error, refresh };
}

// Backend semantics: a finite limit is reached once currentCount >= limit.
// A null/undefined limit means unlimited, so it's never reached.
export function isAtLimit(currentCount, limit) {
  return typeof limit === "number" && currentCount >= limit;
}

// "8 / 10" for a finite limit, "Unlimited" otherwise — for inline usage
// displays next to existing "New X" actions.
export function formatUsage(currentCount, limit) {
  return typeof limit === "number" ? `${currentCount} / ${limit}` : "Unlimited";
}

// Factual copy for a reached limit — pairs with <PlanLimitNotice>, which
// adds the actual "Upgrade to Business" link (only Startup has somewhere
// to upgrade TO; Business/Lifetime are already the top entitlement tier).
export function limitReachedMessage(limit, resourceLabel) {
  return `Your current plan allows a maximum of ${limit} ${resourceLabel}.`;
}

export function isStartupTier(entitlements) {
  return planKeyFromBillingPlan(entitlements?.billingPlan) === "STARTUP";
}

import { useEffect, useState, useRef } from "react";

import ErrorBanner from "../ErrorBanner";
import ConfirmDialog from "../../components/ConfirmDialog";
import { billing as billingApi } from "../../components/Api";
import { openPaddleCheckout } from "../../utils/paddle";
import {
  PLAN_LABEL,
  PLANS,
  yearlySavings,
  resolveBillingPlan,
  planKeyFromBillingPlan,
  intervalFromBillingPlan,
} from "../../constants/pricing";

const STATUS_COPY = {
  TRIALING: { label: "Trialing", color: "var(--teal)" },
  ACTIVE: { label: "Active", color: "var(--moss)" },
  PAST_DUE: { label: "Payment issue", color: "var(--brick)" },
  PAUSED: { label: "Paused", color: "var(--slate)" },
  CANCELED: { label: "Canceled", color: "var(--slate)" },
  EXPIRED: { label: "Expired", color: "var(--brick)" },
};

const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

/*
 * Paddle checkout/subscription changes are asynchronous.
 *
 * The frontend mutation can complete before the corresponding Paddle
 * webhook has updated the backend database.
 *
 * Therefore, after a billing mutation, poll the backend for a short,
 * bounded period until the expected subscription state is visible.
 *
 * Returns a status string rather than the subscription itself, so a
 * caller can tell the difference between "confirmed", "gave up waiting
 * (but the mutation itself still succeeded)", and "the component
 * unmounted mid-poll" — the last of which must never touch React state.
 */
const SYNC_INTERVAL_MS = 1000;
const SYNC_TIMEOUT_MS = 15000;

const waitForSubscriptionSync = async (
  getSubscription,
  setSubscription,
  matchesExpectedState,
  isMountedRef,
) => {
  const startedAt = Date.now();

  while (Date.now() - startedAt < SYNC_TIMEOUT_MS) {
    if (!isMountedRef.current) return "unmounted";

    try {
      const updatedSubscription = await getSubscription();

      if (!isMountedRef.current) return "unmounted";

      setSubscription(updatedSubscription);

      if (matchesExpectedState(updatedSubscription)) {
        return "matched";
      }
    } catch {
      /*
       * A temporary GET failure should not immediately fail the billing
       * operation. Continue polling until the synchronization timeout.
       */
    }

    if (!isMountedRef.current) return "unmounted";

    await new Promise((resolve) => setTimeout(resolve, SYNC_INTERVAL_MS));
  }

  return isMountedRef.current ? "timeout" : "unmounted";
};

const SettingsSubscription = ({ workspaceId }) => {
  const [subscription, setSubscription] = useState(null);
  const [trialDays, setTrialDays] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [interval, setInterval_] = useState("monthly");
  const [checkoutPlan, setCheckoutPlan] = useState(null);
  const [checkoutError, setCheckoutError] = useState(null);
  const [changingPlan, setChangingPlan] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const [planChangeError, setPlanChangeError] = useState(null);

  // Set when a mutation itself succeeded (PATCH/checkout/cancel all
  // returned OK) but the bounded poll above gave up before the backend
  // reflected it — i.e. the webhook just hasn't arrived yet. This is
  // deliberately NOT routed through checkoutError/planChangeError: the
  // request didn't fail, so showing it as a red error would be wrong
  // (see "no incorrect error banner after a successful change").
  const [syncNotice, setSyncNotice] = useState(null);

  const [showCancel, setShowCancel] = useState(false);

  /*
   * Prevent multiple billing mutations from being triggered by rapid
   * clicks before React has committed the disabled state.
   */
  const mutationInFlightRef = useRef(false);

  // Tracks whether this component instance is still mounted, so a
  // long-running waitForSubscriptionSync poll (up to SYNC_TIMEOUT_MS)
  // started before the user navigates away never calls a state setter
  // afterward.
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!workspaceId) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);

      try {
        const [sub, days] = await Promise.all([
          billingApi.getSubscription(workspaceId),
          billingApi.getTrialDaysRemaining(workspaceId),
        ]);

        if (!cancelled) {
          setSubscription(sub);
          setTrialDays(days);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [workspaceId, reloadKey]);

  const retry = () => {
    setReloadKey((v) => v + 1);
  };

  const startCheckout = async (plan) => {
    const billingPlan = resolveBillingPlan(plan, interval);

    if (mutationInFlightRef.current) return;

    mutationInFlightRef.current = true;

    setCheckoutPlan(billingPlan);
    setCheckoutError(null);
    setSyncNotice(null);

    try {
      const checkout = await billingApi.createCheckout(
        workspaceId,
        billingPlan,
      );

      await openPaddleCheckout({
        paddlePriceId: checkout.paddlePriceId,
        paddleClientToken: checkout.paddleClientToken,
        environment: checkout.environment,
        workspaceId,
      });

      /*
       * Checkout completion does not guarantee that the webhook has already
       * updated the backend. Wait until the backend reflects the expected
       * plan and status.
       */
      const syncResult = await waitForSubscriptionSync(
        () => billingApi.getSubscription(workspaceId),
        setSubscription,
        (updatedSubscription) =>
          updatedSubscription?.plan === billingPlan &&
          ["ACTIVE", "TRIALING"].includes(updatedSubscription?.status),
        isMountedRef,
      );

      if (syncResult === "timeout" && isMountedRef.current) {
        setSyncNotice(
          "Your payment went through and is being confirmed. This can take a minute — refresh if your plan doesn't update shortly.",
        );
      }
    } catch (e) {
      if (isMountedRef.current) setCheckoutError(e);
    } finally {
      if (isMountedRef.current) setCheckoutPlan(null);
      mutationInFlightRef.current = false;
    }
  };

  /*
   * Changes an existing ACTIVE recurring subscription to another recurring
   * plan/interval.
   *
   * The frontend does NOT optimistically change subscription.plan.
   * Paddle/webhook/backend remain the source of truth.
   */
  const changePlan = async (billingPlan) => {
    if (mutationInFlightRef.current) return;

    mutationInFlightRef.current = true;

    setChangingPlan(billingPlan);
    setPlanChangeError(null);
    setSyncNotice(null);

    try {
      /*
       * Exactly one PATCH request per click.
       */
      await billingApi.changePlan(workspaceId, billingPlan);

      /*
       * Wait for Paddle's webhook to update the backend.
       *
       * Once the backend returns the new plan, setSubscription() updates
       * React state and the page immediately reflects the new plan without
       * requiring a browser reload.
       */
      const syncResult = await waitForSubscriptionSync(
        () => billingApi.getSubscription(workspaceId),
        setSubscription,
        (updatedSubscription) =>
          updatedSubscription?.plan === billingPlan &&
          updatedSubscription?.status === "ACTIVE",
        isMountedRef,
      );

      if (syncResult === "timeout" && isMountedRef.current) {
        setSyncNotice(
          "Your plan change was submitted and is being confirmed by Paddle. This can take a minute — refresh if it doesn't update shortly.",
        );
      }
    } catch (e) {
      if (isMountedRef.current) setPlanChangeError(e);
    } finally {
      if (isMountedRef.current) setChangingPlan(null);
      mutationInFlightRef.current = false;
    }
  };

  const handleCancel = async () => {
    if (mutationInFlightRef.current) return;

    mutationInFlightRef.current = true;
    setCancelling(true);
    setSyncNotice(null);

    try {
      await billingApi.cancelSubscription(workspaceId);

      if (isMountedRef.current) setShowCancel(false);

      /*
       * Wait for the backend to reflect cancellation rather than doing
       * only one immediate GET.
       */
      const syncResult = await waitForSubscriptionSync(
        () => billingApi.getSubscription(workspaceId),
        setSubscription,
        (updatedSubscription) =>
          updatedSubscription?.cancelAtPeriodEnd === true ||
          updatedSubscription?.status === "CANCELED",
        isMountedRef,
      );

      if (syncResult === "timeout" && isMountedRef.current) {
        setSyncNotice(
          "Your cancellation was submitted and is being confirmed. This can take a minute — refresh if it doesn't update shortly.",
        );
      }
    } finally {
      if (isMountedRef.current) setCancelling(false);
      mutationInFlightRef.current = false;
    }
  };

  const busy = checkoutPlan !== null || changingPlan !== null || cancelling;

  if (loading) {
    return <div className="fm-loading">Loading your subscription…</div>;
  }

  const status = subscription?.status;

  const statusCopy = STATUS_COPY[status] || {
    label: status,
    color: "var(--slate)",
  };

  const isTrialing = status === "TRIALING";
  const isExpired = status === "EXPIRED";

  const currentPlanKey = planKeyFromBillingPlan(subscription?.plan);
  const currentInterval = intervalFromBillingPlan(subscription?.plan);

  const isLifetime = currentPlanKey === "LIFETIME";
  const canCancel = status === "ACTIVE" && !isLifetime;

  return (
    <div>
      <ErrorBanner error={error} onRetry={retry} />

      {!error && (
        <>
          {/* --------------------------- current subscription --------------------------- */}

          <section className="fm-stat-card" style={{ marginBottom: 20 }}>
            <div style={{ width: "100%" }}>
              <div className="fm-stat-label" style={{ marginBottom: 8 }}>
                Your subscription
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 6,
                }}
              >
                <div className="fm-stat-value" style={{ fontSize: 18 }}>
                  {PLAN_LABEL[currentPlanKey] || subscription?.plan}

                  {currentInterval && (
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: "var(--ink-soft)",
                        marginLeft: 6,
                      }}
                    >
                      · {currentInterval === "yearly" ? "Yearly" : "Monthly"}
                    </span>
                  )}
                </div>

                <span
                  className="fm-visibility-tag"
                  style={{
                    background: `${statusCopy.color}22`,
                    color: statusCopy.color,
                  }}
                >
                  {statusCopy.label}
                </span>
              </div>

              {isTrialing && (
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--ink-soft)",
                  }}
                >
                  You're on your 7-day free trial — {trialDays}{" "}
                  {trialDays === 1 ? "day" : "days"} remaining.
                  {subscription?.trialEndsAt && (
                    <> Trial ends {formatDate(subscription.trialEndsAt)}.</>
                  )}
                </div>
              )}

              {isExpired && (
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--brick)",
                  }}
                >
                  Your free trial has ended. Choose a plan below to continue
                  using fidmap.
                </div>
              )}

              {status === "ACTIVE" && !isLifetime && (
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--ink-soft)",
                  }}
                >
                  {subscription.currentPeriodEnd &&
                    (subscription.cancelAtPeriodEnd
                      ? `Access ends ${formatDate(
                          subscription.currentPeriodEnd,
                        )} — not renewing.`
                      : `Next billing date: ${formatDate(
                          subscription.currentPeriodEnd,
                        )}`)}
                </div>
              )}

              {isLifetime && status === "ACTIVE" && (
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--ink-soft)",
                  }}
                >
                  You have lifetime access — no recurring billing.
                </div>
              )}

              {status === "PAST_DUE" && (
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--brick)",
                  }}
                >
                  There's a problem with your last payment. Please update your
                  payment method to keep your subscription active.
                </div>
              )}

              {status === "PAUSED" && (
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--ink-soft)",
                  }}
                >
                  Your subscription is currently paused.
                </div>
              )}

              {status === "CANCELED" && (
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--ink-soft)",
                  }}
                >
                  {subscription?.currentPeriodEnd
                    ? `Your access remains until ${formatDate(
                        subscription.currentPeriodEnd,
                      )}.`
                    : "This subscription has been canceled."}
                </div>
              )}

              {canCancel && (
                <button
                  type="button"
                  className="fm-btn-ghost"
                  style={{ marginTop: 14 }}
                  onClick={() => setShowCancel(true)}
                  disabled={subscription?.cancelAtPeriodEnd || busy}
                >
                  {subscription?.cancelAtPeriodEnd
                    ? "Cancellation scheduled"
                    : "Cancel subscription"}
                </button>
              )}
            </div>
          </section>

          {/* -------------------------------- plans -------------------------------- */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <div className="fm-stat-label">Plans</div>

            <div
              style={{
                display: "flex",
                gap: 4,
                background: "var(--paper-soft)",
                borderRadius: 8,
                padding: 3,
              }}
            >
              <button
                type="button"
                className="fm-tab"
                style={{
                  background: interval === "monthly" ? "#fff" : "transparent",
                  borderRadius: 6,
                }}
                onClick={() => setInterval_("monthly")}
                disabled={busy}
              >
                Monthly
              </button>

              <button
                type="button"
                className="fm-tab"
                style={{
                  background: interval === "yearly" ? "#fff" : "transparent",
                  borderRadius: 6,
                }}
                onClick={() => setInterval_("yearly")}
                disabled={busy}
              >
                Yearly
              </button>
            </div>
          </div>

          <ErrorBanner error={checkoutError || planChangeError} />

          {syncNotice && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                fontSize: 13,
                color: "var(--ink-soft)",
                background: "var(--paper-soft)",
                border: "1px solid var(--line)",
                borderRadius: 8,
                padding: "10px 12px",
                marginBottom: 14,
              }}
            >
              <span>{syncNotice}</span>

              <button
                type="button"
                className="fm-btn-ghost"
                style={{ flexShrink: 0 }}
                onClick={() => {
                  setSyncNotice(null);
                  retry();
                }}
              >
                Refresh
              </button>
            </div>
          )}

          <div className="fm-board-grid">
            {PLANS.map((plan) => {
              const isCurrent =
                currentPlanKey === plan.key &&
                status === "ACTIVE" &&
                (plan.key === "LIFETIME" || currentInterval === interval);

              const savings =
                interval === "yearly" ? yearlySavings(plan) : null;

              const billingPlan = resolveBillingPlan(plan, interval);

              const canChangePlan =
                status === "ACTIVE" &&
                !isLifetime &&
                plan.key !== "LIFETIME" &&
                !isCurrent;

              return (
                <div className="fm-board-card" key={plan.key}>
                  <div className="fm-board-card-top">
                    <div>
                      <div className="fm-board-card-name fm-display">
                        {plan.name}
                      </div>

                      <div
                        style={{
                          fontSize: 22,
                          fontWeight: 700,
                          marginTop: 6,
                        }}
                      >
                        {plan.key === "LIFETIME" ? (
                          <>
                            ${plan.price}
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: "var(--ink-soft)",
                              }}
                            >
                              {" "}
                              one-time
                            </span>
                          </>
                        ) : (
                          <>
                            $
                            {interval === "yearly" ? plan.yearly : plan.monthly}
                            <span
                              style={{
                                fontSize: 13,
                                fontWeight: 500,
                                color: "var(--ink-soft)",
                              }}
                            >
                              {" "}
                              {interval === "yearly" ? "/year" : "/month"}
                            </span>
                          </>
                        )}
                      </div>

                      {savings && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--moss)",
                            marginTop: 2,
                          }}
                        >
                          Save ${savings.amountSaved}/year
                        </div>
                      )}
                    </div>
                  </div>

                  {isCurrent ? (
                    <div
                      className="fm-visibility-tag"
                      style={{
                        background: "var(--moss)22",
                        color: "var(--moss)",
                      }}
                    >
                      Current plan
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="fm-btn-primary"
                      style={{
                        width: "100%",
                        justifyContent: "center",
                      }}
                      onClick={() =>
                        canChangePlan
                          ? changePlan(billingPlan)
                          : startCheckout(plan)
                      }
                      disabled={busy}
                    >
                      {changingPlan === billingPlan
                        ? "Changing plan…"
                        : checkoutPlan === billingPlan
                          ? "Opening checkout…"
                          : canChangePlan
                            ? "Change plan"
                            : "Choose plan"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {showCancel && (
        <ConfirmDialog
          title="Cancel subscription"
          message={
            subscription?.currentPeriodEnd
              ? `Your subscription will remain active until ${formatDate(
                  subscription.currentPeriodEnd,
                )}. You won't be charged again after that.`
              : "Your subscription will remain active until the end of the current billing period. You won't be charged again after that."
          }
          confirmLabel="Cancel subscription"
          onClose={() => setShowCancel(false)}
          onConfirm={handleCancel}
        />
      )}
    </div>
  );
};

export default SettingsSubscription;

/*
 * A billing mutation (checkout, plan change, cancellation) completing on
 * the FIDMAP backend does not mean the payment provider's webhook has
 * already updated the backend's subscription record.
 *
 * Therefore, after a billing mutation, poll the backend for a short,
 * bounded period until the expected subscription state is visible.
 *
 * Returns a status string rather than the subscription itself, so a
 * caller can tell the difference between "confirmed", "gave up waiting
 * (but the mutation itself still succeeded)", and "the component
 * unmounted mid-poll" — the last of which must never touch React state.
 *
 * Originally lived only in SettingsSubscription.jsx; extracted unchanged
 * so MultiStepForm.jsx's registration-time checkout can use the same
 * confirmed-payment check (needed to fire a GA4 `purchase` event only
 * once the backend actually reflects the paid plan, not merely once
 * checkout closes).
 */
const SYNC_INTERVAL_MS = 1000;
const SYNC_TIMEOUT_MS = 15000;

export const waitForSubscriptionSync = async (
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

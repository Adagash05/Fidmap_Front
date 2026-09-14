import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";

/*
 * The FIDMAP backend (POST /api/billing/checkout) creates the actual
 * checkout session with Polar server-side and hands back a hosted
 * checkout URL — CheckoutResponse.checkoutUrl, verified directly against
 * the backend's payment/billing/CheckoutResponse.java. The frontend never
 * talks to Polar's API directly and never sees provider credentials.
 *
 * This opens that session as Polar's official Embedded Checkout
 * (@polar-sh/checkout — https://docs.polar.sh/features/checkout/embed)
 * inline, as an overlay on the current page, instead of redirecting the
 * browser away to a separate hosted Polar page. Always forced to the
 * "light" theme, per Polar's documented `theme` option.
 *
 * For an embedded checkout to work against a dynamically-created
 * Checkout Session URL (rather than a static Checkout Link), Polar
 * requires the session to have been created with a matching
 * `embed_origin` — this is set server-side in PolarService.createCheckout
 * (the one backend change this required).
 *
 * Checkout completion is never inferred from the embed closing or
 * succeeding; the payment provider's webhook is what actually updates
 * the backend's subscription record. Callers should still re-fetch
 * billing.getSubscription() afterward rather than assume anything.
 *
 * Returns a handle: { done, close }.
 * - `done` resolves once the checkout is finished, either because it
 *   succeeded or because the visitor closed it — both should be treated
 *   the same way a closed Paddle overlay used to be (just carry on; the
 *   webhook is authoritative regardless).
 * - `close()` lets a caller force-close the embed, e.g. from a component
 *   unmount cleanup, mirroring Polar's own documented React example.
 */
export function openEmbeddedCheckout(checkoutUrl) {
  if (!checkoutUrl) {
    return {
      done: Promise.reject(
        new Error("No checkout URL was returned by the backend."),
      ),
      close: () => {},
    };
  }

  let checkoutInstance = null;

  const done = new Promise((resolve, reject) => {
    PolarEmbedCheckout.create(checkoutUrl, { theme: "light" })
      .then((checkout) => {
        checkoutInstance = checkout;

        checkout.addEventListener("success", () => {
          resolve({ succeeded: true });
        });

        checkout.addEventListener("close", () => {
          resolve({ succeeded: false });
        });
      })
      .catch(reject);
  });

  return {
    done,
    close: () => checkoutInstance?.close(),
  };
}

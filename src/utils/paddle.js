// Loads Paddle.js (Paddle Billing v2) once and opens Checkout using the
// backend-provided price id / client token / environment (from
// billing.createCheckout — see Api.js). The client token is safe to use
// in the browser by design (Paddle's own docs); the API key and webhook
// secret never leave the backend.

let paddleLoadPromise = null;

function loadPaddleScript() {
  if (window.Paddle) return Promise.resolve(window.Paddle);

  if (!paddleLoadPromise) {
    paddleLoadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
      script.async = true;
      script.onload = () => resolve(window.Paddle);
      script.onerror = () => reject(new Error("Failed to load Paddle.js"));
      document.head.appendChild(script);
    });
  }

  return paddleLoadPromise;
}

/*
 * Opens Paddle Checkout for a single price. Resolves when the checkout
 * overlay closes — it does NOT mean payment succeeded. The subscription
 * only becomes ACTIVE once Paddle's webhook reaches the backend, so the
 * caller should re-fetch billing.getSubscription() afterward rather than
 * assuming success.
 */
export async function openPaddleCheckout({
  paddlePriceId,
  paddleClientToken,
  environment,
  workspaceId,
  successUrl = window.location.href,
}) {
  const Paddle = await loadPaddleScript();

  if (environment === "sandbox") {
    Paddle.Environment.set("sandbox");
  }

  Paddle.Initialize({ token: paddleClientToken });

  return new Promise((resolve) => {
    Paddle.Checkout.open({
      items: [{ priceId: paddlePriceId, quantity: 1 }],
      customData: {
        workspace_id: workspaceId,
      },
      settings: {
        successUrl,
      },
      eventCallback: (event) => {
        if (
          event?.name === "checkout.closed" ||
          event?.name === "checkout.completed"
        ) {
          resolve(event);
        }
      },
    });
  });
}

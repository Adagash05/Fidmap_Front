import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/*
 * Where the browser lands after a Polar-hosted checkout redirect
 * (POST /api/billing/checkout — see Api.js/utils/checkout.js). This
 * route didn't exist before this migration: the old Paddle integration
 * opened an in-page overlay and never actually navigated the browser
 * away, so there was nothing to "return" to. A full-page redirect does
 * navigate away, so the backend's checkout session is configured to send
 * the browser back here on success.
 *
 * This page intentionally does no billing API calls of its own —
 * reaching this URL is not proof that payment succeeded (the provider's
 * webhook updating the backend is the actual source of truth). It just
 * routes the user back into Settings, whose Subscription tab already
 * fetches live subscription state from the backend on mount.
 */
const BillingSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Confirming subscription | FIDMAP";

    const timer = setTimeout(() => {
      navigate("/settings?tab=subscription", { replace: true });
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fm-loading">
      Finishing up — taking you back to your subscription settings…
    </div>
  );
};

export default BillingSuccess;

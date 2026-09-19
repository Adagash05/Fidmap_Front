import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import UserForm from "./UserForm";
import WorkspaceForm from "./WorkspaceForm";
import { useAuth } from "../../hooks/useAuth";
import { billing as billingApi } from "../../components/Api";
import { openEmbeddedCheckout } from "../../utils/checkout";
import { waitForSubscriptionSync } from "../../utils/billingSync";
import { trackEvent } from "../../utils/analytics";
import {
  planKeyFromBillingPlan,
  intervalFromBillingPlan,
} from "../../constants/pricing";
import Seo from "../../components/Seo";

// The ?plan= URL param uses the same simple keys as MarketingPricing
// (plan.key.toLowerCase() — "startup" | "business" | "lifetime"), and for
// recurring plans an ?interval= of "monthly" | "yearly" — not the
// backend's full BillingPlan enum values.
//
// Startup never triggers checkout here, regardless of interval — a new
// Startup signup keeps the backend-created local Startup trial and goes
// straight to the dashboard. Business/Lifetime resolve to the actual
// BillingPlan enum value the checkout endpoint expects, defaulting a
// missing/unrecognized interval to monthly. Missing/unrecognized plan
// falls back to normal registration (no checkout) — this param only
// selects which checkout to trigger after signup, it never grants
// anything by itself (the backend remains the authority).
const resolveCheckoutPlan = (plan, interval) => {
  if (plan === "business") {
    return interval === "yearly" ? "BUSINESS_YEARLY" : "BUSINESS_MONTHLY";
  }

  if (plan === "lifetime") {
    return "LIFETIME";
  }

  return null;
};

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { register } = useAuth();
  const [searchParams] = useSearchParams();

  const requestedPlan = searchParams.get("plan");
  const requestedInterval = searchParams.get("interval");
  const planForCheckout = resolveCheckoutPlan(requestedPlan, requestedInterval);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    name: "",
  });

  const handleSubmit = async (e, currentFormData) => {
    e.preventDefault();

    if (busy) return;

    setBusy(true);
    setError(null);

    try {
      const requestData = {
        firstUser: {
          fullName: currentFormData.fullName,
          email: currentFormData.email,
          password: currentFormData.password,
        },
        dto: {
          name: currentFormData.name,
        },
      };

      const result = await register(requestData);

      // Registration succeeded regardless of what happens next — a
      // checkout failure here must not strand the user outside the app.
      if (planForCheckout && result?.workspaceId) {
        try {
          const checkout = await billingApi.createCheckout(
            result.workspaceId,
            planForCheckout,
          );

          // Checkout session created — genuinely starting now, not
          // merely "form submitted".
          trackEvent("checkout_started", {
            plan: planKeyFromBillingPlan(planForCheckout),
            billing_period:
              intervalFromBillingPlan(planForCheckout) || "one_time",
          });

          // Embedded (in-page) checkout — stays on this screen instead of
          // navigating away. Whether the visitor completes payment or
          // just closes it, either way we continue into the app the same
          // way a closed Paddle overlay used to just fall through
          // afterward; the webhook is the real source of truth regardless.
          const checkoutHandle = openEmbeddedCheckout(checkout.checkoutUrl);
          await checkoutHandle.done;

          // Confirm the purchase in the background rather than making
          // the user wait here — this component navigates to /dashboard
          // right after this block regardless (unchanged timing), and
          // this poll has no UI state to protect from an unmount, so it
          // isn't tied to isMountedRef the way SettingsSubscription.jsx's
          // is; it just keeps checking until the backend confirms the
          // paid plan (or gives up after the same bounded timeout) and
          // fires `purchase` only then — never merely because the embed
          // closed or reported success client-side.
          waitForSubscriptionSync(
            () => billingApi.getSubscription(result.workspaceId),
            () => {},
            (updatedSubscription) =>
              updatedSubscription?.plan === planForCheckout &&
              ["ACTIVE", "TRIALING"].includes(updatedSubscription?.status),
            { current: true },
          ).then((syncResult) => {
            if (syncResult === "matched") {
              trackEvent("purchase", {
                plan: planKeyFromBillingPlan(planForCheckout),
                billing_period:
                  intervalFromBillingPlan(planForCheckout) || "one_time",
              });
            }
          });
        } catch {
          // The provider's webhook is the real source of truth
          // regardless — if checkout couldn't be created/opened, the
          // workspace is still on its normal trial and the owner can
          // start checkout again from Settings.
        }
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err);
      setBusy(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const nextStep = () => setStep((s) => s + 1);
  const previousStep = () => setStep((s) => s - 1);

  return (
    <>
      <Seo
        title="Register"
        description="Create your FIDMAP workspace."
        path="/register"
        noIndex
      />
      {step === 1 && (
        <UserForm
          formData={formData}
          handleChange={handleChange}
          nextStep={nextStep}
        />
      )}

      {step === 2 && (
        <WorkspaceForm
          formData={formData}
          handleChange={handleChange}
          previousStep={previousStep}
          handleSubmit={handleSubmit}
          busy={busy}
          error={error}
        />
      )}
    </>
  );
};

export default MultiStepForm;

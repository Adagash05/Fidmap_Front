import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import UserForm from "./UserForm";
import WorkspaceForm from "./WorkspaceForm";
import { useAuth } from "../../hooks/useAuth";
import { billing as billingApi } from "../../components/Api";
import { openPaddleCheckout } from "../../utils/paddle";

// The ?plan= URL param uses the same simple keys as MarketingPricing
// (plan.key.toLowerCase() — "startup" | "business" | "lifetime"), and for
// recurring plans an ?interval= of "monthly" | "yearly" — not the
// backend's full BillingPlan enum values.
//
// Startup never triggers Paddle checkout here, regardless of interval —
// a new Startup signup keeps the backend-created local Startup trial and
// goes straight to the dashboard. Business/Lifetime resolve to the actual
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

          await openPaddleCheckout({
            paddlePriceId: checkout.paddlePriceId,
            paddleClientToken: checkout.paddleClientToken,
            environment: checkout.environment,
            workspaceId: result.workspaceId,
            successUrl: `${window.location.origin}/dashboard`,
          });
        } catch {
          // Paddle's webhook is the real source of truth regardless — if
          // checkout couldn't open, the workspace is still on its normal
          // trial and the owner can start checkout again from Settings.
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

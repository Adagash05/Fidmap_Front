import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";

import { PLANS, TRIAL_DAYS, yearlySavings } from "../constants/pricing";

/*
 * Public pricing section for the Marketing page.
 *
 * The selected plan (and, for recurring plans, billing interval) is
 * passed through the registration URL.
 *
 * Startup  -> /register?plan=startup&interval=monthly|yearly
 * Business -> /register?plan=business&interval=monthly|yearly
 * Lifetime -> /register?plan=lifetime
 *
 * MultiStepForm reads plan + interval after signup:
 * - Startup: keep the backend-created Startup trial, no Paddle checkout
 * - Business: open Paddle checkout for BUSINESS_MONTHLY/BUSINESS_YEARLY
 * - Lifetime: open Paddle Lifetime checkout
 */
const MarketingPricing = ({ id }) => {
  const [interval, setIntervalValue] = useState("monthly");

  return (
    <section className="fm-mkt-pricing" id={id}>
      <h2 className="fm-display fm-mkt-h2">Simple, transparent pricing</h2>

      <p className="fm-mkt-sub" style={{ marginBottom: 8 }}>
        Start with a {TRIAL_DAYS}-day free trial on Startup. No card required.
      </p>

      <div className="fm-mkt-pricing-toggle">
        <button
          type="button"
          className={`fm-mkt-toggle-btn${
            interval === "monthly" ? " active" : ""
          }`}
          onClick={() => setIntervalValue("monthly")}
        >
          Monthly
        </button>

        <button
          type="button"
          className={`fm-mkt-toggle-btn${
            interval === "yearly" ? " active" : ""
          }`}
          onClick={() => setIntervalValue("yearly")}
        >
          Yearly <span className="fm-mkt-toggle-save">Save 17%</span>
        </button>
      </div>

      <div className="fm-mkt-pricing-grid">
        {PLANS.map((plan) => {
          const savings = yearlySavings(plan);
          const isOneTime = plan.key === "LIFETIME";
          const isBusiness = plan.key === "BUSINESS";

          const priceLabel = isOneTime
            ? `$${plan.price}`
            : `$${interval === "yearly" ? plan.yearly : plan.monthly}`;

          const periodLabel = isOneTime
            ? "one-time"
            : interval === "yearly"
              ? "/year"
              : "/month";

          const registerUrl =
            plan.key === "LIFETIME"
              ? `/register?plan=${plan.key.toLowerCase()}`
              : `/register?plan=${plan.key.toLowerCase()}&interval=${interval}`;

          return (
            <div
              className={`fm-mkt-plan-card${
                plan.recommended ? " recommended" : ""
              }`}
              key={plan.key}
            >
              {plan.recommended && (
                <div className="fm-mkt-plan-badge">Recommended</div>
              )}

              <div className="fm-mkt-plan-name fm-display">{plan.name}</div>

              <p className="fm-mkt-plan-tagline">{plan.tagline}</p>

              <div className="fm-mkt-plan-price">
                {priceLabel}

                <span className="fm-mkt-plan-period">{periodLabel}</span>
              </div>

              {!isOneTime && interval === "yearly" && savings && (
                <div className="fm-mkt-plan-savings">
                  Save ${savings.amountSaved}/year
                </div>
              )}

              <ul className="fm-mkt-plan-features">
                {plan.features.map((f) => (
                  <li key={f}>
                    <Check size={14} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to={registerUrl} className="fm-btn-primary fm-mkt-plan-cta">
                {isOneTime
                  ? "Get lifetime access"
                  : isBusiness
                    ? "Get Business"
                    : "Start free trial"}

                <ArrowRight size={14} />
              </Link>
            </div>
          );
        })}
      </div>

      <p className="fm-mkt-pricing-note">
        Start with the {TRIAL_DAYS}-day Startup trial, then upgrade to Business
        or Lifetime whenever you're ready.
      </p>
    </section>
  );
};

export default MarketingPricing;

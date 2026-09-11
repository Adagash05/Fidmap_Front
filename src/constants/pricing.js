// Single source of truth for FIDMAP's pricing, used by both the public
// Marketing page and the authenticated Settings → Subscription page.
//
// The backend's BillingPlan enum has 5 values — monthly/yearly are
// distinct plans server-side, not a separate interval parameter:
// STARTUP_MONTHLY, STARTUP_YEARLY, BUSINESS_MONTHLY, BUSINESS_YEARLY,
// LIFETIME. The UI keeps the simpler STARTUP/BUSINESS/LIFETIME keys for
// cards and comparisons, but every checkout call must resolve to one of
// the 5 real enum values via monthlyPlan/yearlyPlan/plan below — never
// send "STARTUP" or "BUSINESS" directly to the backend.

export const PLAN_LABEL = {
  STARTUP: "Startup",
  BUSINESS: "Business",
  LIFETIME: "Lifetime",
};

export const PLANS = [
  {
    key: "STARTUP",
    name: "Startup",

    // Display prices
    monthly: 19,
    yearly: 190,

    // Actual backend BillingPlan values
    monthlyPlan: "STARTUP_MONTHLY",
    yearlyPlan: "STARTUP_YEARLY",

    tagline: "For teams just getting started with customer feedback.",

    features: [
      "Up to 3 team members",
      "Up to 10 feedback boards",
      "Up to 1,000 feedback posts",
      "Up to 5,000 end users",
      "Up to 100 roadmap items",
      "Up to 100 changelog entries",
    ],
  },

  {
    key: "BUSINESS",
    name: "Business",

    // Display prices
    monthly: 39,
    yearly: 390,

    // Actual backend BillingPlan values
    monthlyPlan: "BUSINESS_MONTHLY",
    yearlyPlan: "BUSINESS_YEARLY",

    tagline: "For growing teams that need a full team workflow.",

    features: [
      "Everything in Startup, plus",
      "Up to 10 team members",
      "Unlimited boards",
      "Up to 10,000 feedback posts",
      "Up to 25,000 end users",
      "Unlimited roadmap items",
      "Unlimited changelog entries",
      "Private boards",
      "Priority support",
    ],

    recommended: true,
  },

  {
    key: "LIFETIME",
    name: "Lifetime",

    // Lifetime is a one-time purchase.
    monthly: null,
    yearly: null,
    price: 99,

    // Actual backend BillingPlan value
    plan: "LIFETIME",

    tagline: "One-time payment. No recurring subscription.",

    features: ["Everything in Business", "No recurring billing, ever"],
  },
];

export const TRIAL_DAYS = 7;

// Resolves a UI plan card + chosen interval to the actual BillingPlan
// enum value the backend/checkout endpoint expects.
export function resolveBillingPlan(plan, interval) {
  if (plan.key === "LIFETIME") return plan.plan;
  return interval === "yearly" ? plan.yearlyPlan : plan.monthlyPlan;
}

// Backend plan values are like "STARTUP_MONTHLY" / "STARTUP_YEARLY" —
// normalize back to the UI's simpler card key ("STARTUP") for comparisons
// like "is this the customer's current plan". Do not compare
// subscription.plan === plan.key directly; they use different vocabularies.
export function planKeyFromBillingPlan(billingPlan) {
  if (!billingPlan) return null;
  if (billingPlan === "LIFETIME") return "LIFETIME";
  if (billingPlan.startsWith("STARTUP")) return "STARTUP";
  if (billingPlan.startsWith("BUSINESS")) return "BUSINESS";
  return null;
}

// The interval implied by a backend plan value, for display
// ("Startup" + "Monthly"/"Yearly"). Lifetime has no interval.
export function intervalFromBillingPlan(billingPlan) {
  if (!billingPlan || billingPlan === "LIFETIME") return null;
  return billingPlan.endsWith("YEARLY") ? "yearly" : "monthly";
}

// Whole-dollar yearly savings vs paying monthly for 12 months, and that
// as a rounded percentage — computed here so Marketing and Subscription
// never show different numbers for the same plan.
export function yearlySavings(plan) {
  if (!plan.monthly || !plan.yearly) return null;

  const fullYearAtMonthlyRate = plan.monthly * 12;
  const amountSaved = fullYearAtMonthlyRate - plan.yearly;
  const percent = Math.round((amountSaved / fullYearAtMonthlyRate) * 100);

  return { amountSaved, percent };
}

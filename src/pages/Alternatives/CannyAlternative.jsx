import ComparisonPage from "./ComparisonPage";

/* Facts: docs/COMPETITOR_RESEARCH.md §1 (canny.io/pricing, checked 2026-10-14). */
const CannyAlternative = () => (
  <ComparisonPage
    slug="canny"
    name="Canny"
    pricingUrl="https://canny.io/pricing"
    intro="Both tools collect feedback, run voting, and keep a public roadmap. They differ in how pricing works and in what each puts first."
    whatTheyAre="Canny (canny.io) is a customer feedback platform where customers post and vote on requests and your team organizes them. Its pricing page describes an AI layer called Autopilot (feedback discovery, deduplication, comment summaries, smart replies) and a long list of integrations, including Intercom, Zendesk, Slack, Jira, Linear, GitHub, HubSpot and Salesforce."
    pricing={
      <>
        <p>
          Canny prices by <strong>tracked users</strong>. Its page lists a Free
          plan (25 tracked users, 5 managers), Pro at $79 per month billed
          yearly (100+ tracked users, 10 managers) and a custom Business plan
          (5,000+ tracked users). It says that without a spending limit,
          passing a tier can upgrade the plan with a prorated charge.
        </p>
        <p>
          FIDMAP prices by <strong>plan tier</strong>, with limits on team
          members, boards, posts and end users rather than a tracked-user
          count. The two limits are not the same thing, so do not compare the
          numbers one to one.
        </p>
      </>
    }
    rows={[
      ["Public feedback boards and voting", "Yes", "Yes"],
      ["Public roadmap", "Yes", "Listed in help center; per-plan details not confirmed"],
      ["Explained priority score and decision brief", "Yes: score, range, confidence, rationale on record", "Not seen on the pricing page we checked"],
      ["Surveys", "Yes, linkable to a request as evidence", "Not mentioned on the pricing page we checked"],
      ["Duplicate handling", "Suggested pairs you review and merge", "AI deduplication, stated as included in all plans"],
      ["Integrations", "Not a focus today", "Broad list named on its pricing page"],
      ["Free plan", "No (7-day trial)", "Yes, limited to 25 tracked users"],
    ]}
    fidmapStrengths={[
      "A decision workflow: an explained score with a visible range and confidence, then a recorded decision and reason that stays linked to the roadmap item.",
      "Surveys you can link to a request, so a decision can rest on more than votes.",
      "Tier pricing with no tracked-user count that can move you into a higher plan.",
    ]}
    theirStrengths={[
      "A free plan for very small audiences.",
      "A much longer list of named integrations, plus AI-assisted discovery from other tools.",
      "Unlimited boards and contributors on the plans listed.",
    ]}
    whoPrefersWhich="Teams that need deep integrations with support and sales tools, or that want a free starting plan, may prefer Canny. Teams that mainly want to turn feedback into decisions they can explain, with a simple tier-based price, may prefer FIDMAP."
  />
);

export default CannyAlternative;

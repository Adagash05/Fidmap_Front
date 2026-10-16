import ComparisonPage from "./ComparisonPage";

/* Facts: docs/COMPETITOR_RESEARCH.md §3 (uservoice.com/pricing, checked 2026-10-14). */
const UserVoiceAlternative = () => (
  <ComparisonPage
    slug="uservoice"
    name="UserVoice"
    pricingUrl="https://www.uservoice.com/pricing"
    intro="UserVoice is sales-led; FIDMAP is self-serve. This page sticks to what UserVoice states publicly."
    whatTheyAre="UserVoice (uservoice.com) is a product feedback platform. Its pricing page says it de-duplicates ideas and aggregates feedback, and lets product managers segment and weigh an idea's impact using customer data."
    pricing={
      <>
        <p>
          UserVoice does not list plan names or prices. Its page says plans
          are based on feedback volume, tools and integrations, never by seat,
          points visitors to &quot;Talk to an Expert&quot;, and mentions a 30-day trial
          after booking a demo.
        </p>
        <p>
          FIDMAP publishes its prices and starts a trial without a demo. We
          cannot say which is cheaper, because UserVoice&apos;s prices are not
          public.
        </p>
      </>
    }
    rows={[
      ["Prices shown publicly", "Yes", "Not on the page we checked"],
      ["How to start", "Self-serve, 7-day trial", "Talk to an expert; 30-day trial after a demo"],
      ["Duplicate handling", "Suggested pairs you review and merge", "States it de-duplicates ideas"],
      ["Impact weighting", "Explained score from votes, surveys, recency and your ratings", "States it weighs an idea's impact with customer data"],
      ["Surveys, roadmap, changelog", "Yes", "Not confirmed on the page we checked"],
    ]}
    fidmapStrengths={[
      "Transparent, self-serve pricing and an instant trial.",
      "A score whose every component you can read, with a recorded decision and reason.",
    ]}
    theirStrengths={[
      "Positioned for larger organizations, with usage-based plans that are not per seat.",
      "A guided, sales-led onboarding for teams that want one.",
    ]}
    whoPrefersWhich="Larger organizations that want a sales-led relationship and usage-based plans may prefer UserVoice. Teams that want to see prices up front and start the same day may prefer FIDMAP."
  />
);

export default UserVoiceAlternative;

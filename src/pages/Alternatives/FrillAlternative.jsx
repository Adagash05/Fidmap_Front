import ComparisonPage from "./ComparisonPage";

/* Facts: docs/COMPETITOR_RESEARCH.md §2 (frill.co/pricing, checked 2026-10-14). */
const FrillAlternative = () => (
  <ComparisonPage
    slug="frill"
    name="Frill"
    pricingUrl="https://frill.co/pricing"
    intro="Frill and FIDMAP both cover feedback, a roadmap and announcements. Frill also lists a priority matrix and surveys, so the difference is less about having these and more about how decisions are made and recorded."
    whatTheyAre="Frill (frill.co) is a feedback platform with ideas boards, a roadmap and announcements. Its pricing page lists similar-idea detection and smart merge, customizable priority factors, a priority matrix, and surveys (NPS, CSAT, open feedback, quick poll, idea poll)."
    pricing={
      <>
        <p>
          Frill lists flat monthly plans: Startup $25, Business $49 and Growth
          $149 per month, an Enterprise plan marked &quot;Talk to sales&quot;,
          and a 14-day free trial with no credit card required. It lists
          unlimited teammates and tracked users on all plans, with limits on
          active ideas (50 on Startup) and surveys (1 on Startup, 3 on
          Business). We could not see its yearly prices.
        </p>
        <p>
          FIDMAP prices by plan tier, with limits on team members, boards, posts
          and end users. &quot;Active ideas&quot; and FIDMAP &quot;posts&quot;
          are not the same unit, so compare features and your own volumes rather
          than the raw numbers. Frill&apos;s unlimited seats are more generous
          than FIDMAP&apos;s team-member caps.
        </p>
      </>
    }
    rows={[
      ["Public boards, voting and roadmap", "Yes", "Yes"],
      [
        "Prioritization",
        "Evidence-based score with breakdown, range, confidence",
        "Priority factors and a priority matrix",
      ],
      [
        "Decision on record with rationale",
        "Yes, including overrides of the recommendation",
        "Not listed on the page we checked",
      ],
      [
        "Surveys",
        "Yes, linkable to a request",
        "Yes, several types; counts limited by plan",
      ],
      [
        "Duplicates",
        "Suggested pairs you review and merge",
        "Similar-idea detection and smart merge",
      ],
      ["Seats", "Capped per plan", "Unlimited teammates listed"],
      [
        "Free trial",
        "7 days, 14 days, no credit card",
        "14 days, no credit card",
      ],
    ]}
    fidmapStrengths={[
      "Every score explains itself and shows how uncertain it is when evidence is missing, and the final human decision is recorded next to it.",
      "One step from a decision to a roadmap item with a target date, with the request staying linked to it.",
    ]}
    theirStrengths={[
      "Lower listed entry price and a longer no-card trial.",
      "Unlimited teammates and tracked users on every plan.",
      "More survey types listed.",
    ]}
    whoPrefersWhich="Teams with many seats or that want the lowest entry price and more survey types may prefer Frill. Teams that want each prioritisation call to be explained and recorded may prefer FIDMAP."
  />
);

export default FrillAlternative;

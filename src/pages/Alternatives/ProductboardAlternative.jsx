import ComparisonPage from "./ComparisonPage";

/* Facts: docs/COMPETITOR_RESEARCH.md §4 (productboard.com/pricing, checked 2026-10-14). */
const ProductboardAlternative = () => (
  <ComparisonPage
    slug="productboard"
    name="Productboard"
    pricingUrl="https://www.productboard.com/pricing/"
    intro="Productboard is a broad product-management suite; FIDMAP is a focused feedback-to-decision tool. They are not the same size of product."
    whatTheyAre="Productboard (productboard.com) is a product management platform. Its pricing page lists roadmaps and release planning, custom prioritization formulas, AI features, an API, and more than 25 native integrations such as Jira, Salesforce, Slack and Zendesk."
    pricing={
      <>
        <p>
          Productboard prices per <strong>maker</strong> with a minimum of 5
          makers on both plans. Plan prices are not shown (&quot;Request demo&quot; and
          &quot;Contact sales&quot;), and the page shows a Save 21% option for annual
          billing. AI usage uses credits per maker.
        </p>
        <p>
          FIDMAP publishes tier prices. We cannot compare dollar amounts,
          because Productboard&apos;s are not public.
        </p>
      </>
    }
    rows={[
      ["Prices shown publicly", "Yes", "Not on the page we checked"],
      ["Pricing model", "Plan tiers with usage limits", "Per maker, 5-maker minimum"],
      ["Prioritization", "Fixed, explained score plus your ratings", "Custom prioritization formulas"],
      ["Roadmaps and release planning", "Public roadmap with target dates", "Roadmaps and release planning listed"],
      ["Integrations", "Not a focus today", "25+ native integrations listed"],
      ["Enterprise SSO", "Not available today", "SAML SSO listed as Enterprise only"],
    ]}
    fidmapStrengths={[
      "Much smaller scope: a small team can start in minutes, and see the price first.",
      "A built-in customer-facing portal, roadmap and status emails for the people who asked.",
    ]}
    theirStrengths={[
      "Far broader product-management features, including custom formulas and release planning.",
      "A large set of native integrations and an API.",
      "Enterprise security options such as SAML SSO.",
    ]}
    whoPrefersWhich="Larger product organizations that need a full planning suite and many integrations may prefer Productboard. Small and mid-size teams that want a lighter tool for turning customer feedback into explained decisions may prefer FIDMAP."
  />
);

export default ProductboardAlternative;

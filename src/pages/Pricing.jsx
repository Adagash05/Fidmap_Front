import MarketingLayout from "../layouts/MarketingLayout";
import Seo from "../components/Seo";
import MarketingPricing from "../components/MarketingPricing";
import { TRIAL_DAYS } from "../constants/pricing";

/*
 * A dedicated, linkable/indexable /pricing route. The homepage already
 * has a #pricing anchor section using the same <MarketingPricing />
 * component — this doesn't duplicate that pricing logic/markup, it just
 * gives pricing its own crawlable URL and metadata, which the homepage
 * anchor can't have on its own.
 */
const Pricing = () => (
  <MarketingLayout>
    <Seo
      title="Pricing"
      description={`FIDMAP pricing: a ${TRIAL_DAYS}-day free trial on Startup, Startup and Business monthly/yearly plans, and a one-time Lifetime plan.`}
      path="/pricing"
    />

    <section className="fm-mkt-hero" style={{ paddingBottom: 0 }}>
      <div className="fm-mkt-eyebrow fm-mono">Pricing</div>
      <h1 className="fm-display fm-mkt-h1">Simple pricing, no surprises</h1>
    </section>

    <MarketingPricing />
  </MarketingLayout>
);

export default Pricing;

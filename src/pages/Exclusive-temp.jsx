import MarketingLayout from "../layouts/MarketingLayout";
import Seo from "../components/Seo";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { APP_URL } from "../constants/pricing";
import { withReferralParam } from "../utils/referral";

const ExclusiveDeal = () => {
  const registerUrl = withReferralParam(`${APP_URL}/register?plan=lifetime`);

  const features = [
    "Everything in Business",
    "Lifetime access to FIDMAP",
    "All future improvements",
    "No recurring billing, ever",
    "Founding customer price: $49",
  ];

  return (
    <MarketingLayout>
      <Seo
        title="FIDMAP Lifetime Deal — Pay $49 Once"
        description="Get everything in FIDMAP Business for life with one payment of $49. Includes all future improvements and no recurring billing."
        path="/exclusive-deal"
      />

      <section
        className="fm-mkt-hero"
        style={{
          textAlign: "center",
          padding: "5rem 1.25rem 3rem",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div
          className="fm-mkt-eyebrow fm-mono"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <Sparkles size={15} />
          EXCLUSIVE FOUNDING CUSTOMER OFFER
        </div>

        <h1 className="fm-display fm-mkt-h1" style={{ marginTop: "1.25rem" }}>
          Everything in Business.
          <br />
          Yours for life.
        </h1>

        <p
          style={{
            maxWidth: "580px",
            margin: "1.25rem auto",
            fontSize: "1.05rem",
          }}
        >
          Stop paying monthly to manage customer feedback. Get FIDMAP for one
          payment and focus on building what your customers actually want.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginTop: "1.75rem",
          }}
        >
          <a
            href={registerUrl}
            className="fm-btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.6rem",
              padding: "1rem 1.5rem",
              textDecoration: "none",
            }}
          >
            Claim My Lifetime Deal
            <ArrowRight size={17} />
          </a>
        </div>

        <p
          className="fm-mono"
          style={{ fontSize: "0.78rem", marginTop: "1rem" }}
        >
          PAY ONCE · KEEP FIDMAP FOR LIFE · NO RECURRING BILLING
        </p>
      </section>

      <section
        className="fm-mkt-pricing"
        id="lifetime-deal"
        style={{ padding: "1rem 1.25rem 4rem" }}
      >
        <div className="fm-mkt-pricing-grid">
          <div
            className="fm-mkt-plan-card recommended"
            style={{
              maxWidth: "480px",
              width: "100%",
              margin: "0 auto",
            }}
          >
            <div className="fm-mkt-plan-badge">Founding Customer Offer</div>

            <div className="fm-mkt-plan-name fm-display">FIDMAP Lifetime</div>

            <p className="fm-mkt-plan-tagline">
              Everything you need to collect feedback, organize feature
              requests, and prioritize what to build next.
            </p>

            <div className="fm-mkt-plan-price">
              $49
              <span className="fm-mkt-plan-period"> one-time</span>
            </div>

            <p style={{ fontSize: "0.9rem" }}>
              Lock in the founding price before it increases.
            </p>

            <ul className="fm-mkt-plan-features" style={{ margin: "1.5rem 0" }}>
              {features.map((feature) => (
                <li key={feature}>
                  <Check size={16} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href={registerUrl}
              className="fm-btn-primary fm-mkt-plan-cta"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.6rem",
                padding: "1rem",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Get Lifetime Access for $49
              <ArrowRight size={17} />
            </a>

            <p
              style={{
                textAlign: "center",
                fontSize: "0.85rem",
                marginTop: "1rem",
              }}
            >
              One payment. No monthly or yearly fees. Ever.
            </p>
          </div>
        </div>
      </section>

      <section
        className="fm-mkt-hero"
        style={{
          textAlign: "center",
          padding: "1rem 1.25rem 4rem",
          maxWidth: "720px",
          margin: "0 auto",
        }}
      >
        <h2 className="fm-display fm-mkt-h2">Build what matters. Pay once.</h2>

        <p style={{ margin: "1rem auto 1.5rem" }}>
          Give customer feedback a home, make smarter product decisions, and
          keep every future improvement included in your lifetime deal.
        </p>

        <a
          href={registerUrl}
          className="fm-btn-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.6rem",
            padding: "1rem 1.5rem",
            textDecoration: "none",
          }}
        >
          Secure My $49 Founding Price
          <ArrowRight size={17} />
        </a>
      </section>
    </MarketingLayout>
  );
};

export default ExclusiveDeal;

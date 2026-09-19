import MarketingLayout from "../layouts/MarketingLayout";
import Seo from "../components/Seo";
import { SUPPORT_EMAIL } from "../constants/legal";

/*
 * Reuses the SUPPORT_EMAIL already established in constants/legal.js for
 * the Terms/Privacy/Refund pages, rather than inventing a second contact
 * address. No phone number or physical address exists anywhere in this
 * project, so none is shown here (see constants/legal.js's own note).
 */
const Contact = () => (
  <MarketingLayout>
    <Seo
      title="Contact FIDMAP"
      description="Get in touch with the FIDMAP team."
      path="/contact"
    />

    <section className="fm-mkt-hero" style={{ paddingBottom: 48 }}>
      <div className="fm-mkt-eyebrow fm-mono">Contact</div>
      <h1 className="fm-display fm-mkt-h1">Get in touch</h1>
      <p className="fm-mkt-sub">
        Questions about FIDMAP, pricing, or your account — reach us at{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </section>
  </MarketingLayout>
);

export default Contact;

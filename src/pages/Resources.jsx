import { Link } from "react-router-dom";

import MarketingLayout from "../layouts/MarketingLayout";
import Seo from "../components/Seo";

const Resources = () => (
  <MarketingLayout>
    <Seo
      title="Resources"
      description="Guides, product pages, and comparisons to help you choose and set up customer feedback software."
      path="/resources"
    />

    <section className="fm-mkt-hero" style={{ paddingBottom: 24 }}>
      <div className="fm-mkt-eyebrow fm-mono">Resources</div>
      <h1 className="fm-display fm-mkt-h1">Guides &amp; resources</h1>
    </section>

    <section className="fm-legal" style={{ maxWidth: 760 }}>
      <h2>Guides</h2>
      <ul>
        <li>
          <Link to="/blog">Blog — feedback &amp; roadmap guides</Link>
        </li>
      </ul>

      <h2>Product</h2>
      <ul>
        <li>
          <Link to="/customer-feedback">Customer feedback management</Link>
        </li>
        <li>
          <Link to="/feature-request-management">
            Feature request management
          </Link>
        </li>
        <li>
          <Link to="/feedback-board">Public feedback boards</Link>
        </li>
      </ul>

      <h2>Comparisons</h2>
      <ul>
        <li>
          <Link to="/alternatives/canny">FIDMAP vs. Canny</Link>
        </li>
        <li>
          <Link to="/alternatives/frill">FIDMAP vs. Frill</Link>
        </li>
      </ul>
    </section>
  </MarketingLayout>
);

export default Resources;

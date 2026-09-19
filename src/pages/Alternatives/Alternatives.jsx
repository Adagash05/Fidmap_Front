import { Link } from "react-router-dom";

import MarketingLayout from "../../layouts/MarketingLayout";
import Seo from "../../components/Seo";

const Alternatives = () => (
  <MarketingLayout>
    <Seo
      title="FIDMAP Alternatives Comparisons"
      description="See how FIDMAP compares to other customer feedback and feature request tools like Canny and Frill."
      path="/alternatives"
    />

    <section className="fm-mkt-hero">
      <div className="fm-mkt-eyebrow fm-mono">Compare</div>
      <h1 className="fm-display fm-mkt-h1">FIDMAP vs. other feedback tools</h1>
      <p className="fm-mkt-sub">
        Honest comparisons to help you pick the right feedback tool for your
        team.
      </p>
    </section>

    <section className="fm-legal" style={{ maxWidth: 760 }}>
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

export default Alternatives;

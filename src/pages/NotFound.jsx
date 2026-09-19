import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import Seo from "../components/Seo";

/*
 * Catch-all for unmatched routes. Previously there was no "*" route in
 * any of the three App.jsx trees, so an unmatched path (a typo, an old
 * bookmarked/indexed URL) rendered a blank page — this fixes that
 * directly, independent of SEO.
 */
const NotFound = () => (
  <div className="fm-marketing">
    <Seo
      title="Page not found"
      description="The page you're looking for doesn't exist or may have moved."
      path="/404"
      noIndex
    />

    <header className="fm-mkt-nav">
      <Link to="/" className="fm-brand" style={{ textDecoration: "none" }}>
        <div className="fm-brand-mark">
          <img src="/logo.svg" alt="FIDMAP" />
        </div>
        <div className="fm-brand-name fm-display">fidmap</div>
      </Link>
    </header>

    <section
      className="fm-mkt-hero"
      style={{ textAlign: "center", paddingTop: 64, paddingBottom: 64 }}
    >
      <div className="fm-mkt-eyebrow fm-mono">404</div>

      <h1 className="fm-display fm-mkt-h1">Page not found</h1>

      <p className="fm-mkt-sub" style={{ margin: "0 auto 28px" }}>
        The page you're looking for doesn't exist, or may have moved.
      </p>

      <div
        className="fm-mkt-cta-row"
        style={{ justifyContent: "center", flexWrap: "wrap" }}
      >
        <Link to="/" className="fm-btn-primary">
          <ArrowRight size={14} />
          Back to homepage
        </Link>
        <Link to="/customer-feedback" className="fm-btn-ghost">
          Customer feedback management
        </Link>
        <Link to="/blog" className="fm-btn-ghost">
          Blog
        </Link>
      </div>
    </section>
  </div>
);

export default NotFound;

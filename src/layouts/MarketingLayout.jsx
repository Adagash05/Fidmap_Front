import { Link } from "react-router-dom";

import { APP_URL } from "../constants/pricing";

/*
 * Shared marketing-site chrome (header nav + footer), used by every public
 * content page (product pages, /pricing, /about, /blog, /alternatives/*)
 * added for SEO. Marketing.jsx (the homepage) and Legal/LegalPage.jsx each
 * already had their own copy of a near-identical header/footer; rather
 * than add a fourth/fifth/sixth copy for each new page, this is the one
 * shared version new pages use. Marketing.jsx and LegalPage.jsx are left
 * as-is (not refactored to use this) since they already work and
 * touching them isn't required for this task.
 *
 * /sign-in and /register are real cross-origin links to app.fidmap.co
 * (see MarketingPricing.jsx for why a same-origin <Link> would break
 * here) — everything else here is a same-origin route that exists on
 * this same marketing domain.
 */
const MarketingLayout = ({ children }) => (
  <div className="fm-marketing">
    <header className="fm-mkt-nav">
      <Link to="/" className="fm-brand" style={{ textDecoration: "none" }}>
        <div className="fm-brand-mark">
          <img src="/logo.svg" alt="FIDMAP" />
        </div>
        <div className="fm-brand-name fm-display">fidmap</div>
      </Link>

      <nav className="fm-mkt-nav-links">
        <Link to="/customer-feedback">Product</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/alternatives">Compare</Link>
        <a href={`${APP_URL}/sign-in`}>Sign in</a>
        <a href={`${APP_URL}/register`} className="fm-btn-primary">
          Get started
        </a>
      </nav>
    </header>

    {children}

    <footer className="fm-mkt-footer fm-mkt-footer-expanded">
      <div className="fm-mkt-footer-grid">
        <div>
          <div className="fm-mkt-footer-heading fm-mono">Product</div>
          <Link to="/customer-feedback">Customer Feedback</Link>
          <Link to="/feature-request-management">Feature Requests</Link>
          <Link to="/feedback-board">Feedback Board</Link>
          <Link to="/pricing">Pricing</Link>
        </div>

        <div>
          <div className="fm-mkt-footer-heading fm-mono">Support</div>
          <Link to="/resources">Resources</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/about">About</Link>
        </div>

        <div>
          <div className="fm-mkt-footer-heading fm-mono">Switch</div>
          <Link to="/alternatives/canny">Canny Alternative</Link>
          <Link to="/alternatives/frill">Frill Alternative</Link>
        </div>

        <div>
          <div className="fm-mkt-footer-heading fm-mono">Legal</div>
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/refund-policy">Refund Policy</Link>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div className="fm-brand">
          <div className="fm-brand-mark">
            <img src="/logo.svg" alt="FIDMAP" />
          </div>
          <div className="fm-brand-name fm-display">fidmap</div>
        </div>

        <div className="fm-mkt-footer-copy fm-mono">
          © {new Date().getFullYear()} fidmap
        </div>
      </div>
    </footer>
  </div>
);

export default MarketingLayout;

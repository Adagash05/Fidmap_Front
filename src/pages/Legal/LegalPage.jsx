import { useEffect } from "react";
import { Link } from "react-router-dom";

import { LEGAL_LAST_UPDATED } from "../../constants/legal";
import { APP_URL } from "../../constants/pricing";

/*
 * Shared layout for the three public legal pages (Terms/Privacy/Refund),
 * registered on BOTH the marketing domain (fidmap.co/terms) and the app
 * domain (app.fidmap.co/terms) — see App.jsx. "/" and the other legal
 * routes exist identically on both domains, so those stay same-origin
 * <Link>s, but /sign-in and /register only exist on app.fidmap.co, so
 * those must be real cross-origin links (see MarketingPricing.jsx for
 * the same reasoning) so they still work when this page is reached via
 * fidmap.co.
 *
 * Reuses Marketing.jsx's header/footer markup and the existing
 * .fm-marketing / .fm-mkt-nav / .fm-mkt-footer classes so these pages
 * look like part of the same site rather than a bolted-on doc viewer.
 * The actual reading column is a small new class (.fm-legal, .fm-legal
 * h2/p/ul — see Style.css) since nothing existing covers long-form
 * article content, but it reuses the same design tokens (--ink,
 * --ink-soft, --line, fm-display/fm-mono) as everything else.
 */
const LegalPage = ({ title, pageTitle, children }) => {
  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return (
    <div className="fm-marketing">
      <header className="fm-mkt-nav">
        <Link to="/" className="fm-brand" style={{ textDecoration: "none" }}>
          <div className="fm-brand-mark">
            <img src="/logo.svg" alt="FIDMAP" />
          </div>
          <div className="fm-brand-name fm-display">fidmap</div>
        </Link>

        <nav className="fm-mkt-nav-links">
          <Link to="/">Home</Link>
          <a href={`${APP_URL}/sign-in`}>Sign in</a>
          <a href={`${APP_URL}/register`} className="fm-btn-primary">
            Get started
          </a>
        </nav>
      </header>

      <article className="fm-legal">
        <h1 className="fm-display fm-legal-title">{title}</h1>
        <p className="fm-legal-updated fm-mono">
          Last updated: {LEGAL_LAST_UPDATED}
        </p>

        {children}
      </article>

      <footer className="fm-mkt-footer">
        <div className="fm-brand">
          <div className="fm-brand-mark">
            <img src="/logo.svg" alt="FIDMAP" />
          </div>
          <div className="fm-brand-name fm-display">fidmap</div>
        </div>

        <nav className="fm-mkt-footer-links">
          <Link to="/terms">Terms of Service</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/refund-policy">Refund Policy</Link>
        </nav>

        <div className="fm-mkt-footer-copy fm-mono">
          © {new Date().getFullYear()} fidmap
        </div>
      </footer>
    </div>
  );
};

export default LegalPage;

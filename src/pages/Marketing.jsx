import { Link } from "react-router-dom";
import {
  Compass,
  MessageSquare,
  ThumbsUp,
  Map,
  Megaphone,
  Globe,
  ArrowRight,
} from "lucide-react";

import MarketingPricing from "../components/MarketingPricing";

/*
 * The real FIDMAP marketing landing page — / no longer renders a board,
 * workspace, or feedback data of any kind. Staff board management moved to
 * /boards (protected); public workspace content lives at /p/:workspaceSlug.
 */
const Marketing = () => {
  return (
    <div className="fm-marketing">
      <header className="fm-mkt-nav">
        <div className="fm-brand">
          <div className="fm-brand-mark">
            <Compass size={18} />
          </div>
          <div className="fm-brand-name fm-display">fidmap</div>
        </div>

        <nav className="fm-mkt-nav-links">
          <a href="#pricing">Pricing</a>
          <Link to="/sign-in">Sign in</Link>
          <Link to="/register" className="fm-btn-primary">
            Get started
          </Link>
        </nav>
      </header>

      <section className="fm-mkt-hero">
        <div className="fm-mkt-eyebrow fm-mono">Customer feedback, organized</div>

        <h1 className="fm-display fm-mkt-h1">
          Turn customer feedback into your product roadmap.
        </h1>

        <p className="fm-mkt-sub">
          Collect feature requests, let customers vote on what matters, plan
          it on a public roadmap, and announce what shipped — all in one
          place, under your own feedback portal.
        </p>

        <div className="fm-mkt-cta-row">
          <Link to="/register" className="fm-btn-primary">
            Get started <ArrowRight size={14} />
          </Link>
          <Link to="/sign-in" className="fm-btn-ghost">
            Sign in
          </Link>
        </div>
      </section>

      <section className="fm-mkt-flow">
        {[
          { icon: MessageSquare, label: "Collect feedback" },
          { icon: ThumbsUp, label: "Customers vote" },
          { icon: Map, label: "Plan the roadmap" },
          { icon: Megaphone, label: "Announce updates" },
        ].map((step, i) => (
          <div className="fm-mkt-flow-step" key={step.label}>
            <div className="fm-mkt-flow-icon">
              <step.icon size={18} />
            </div>
            <div className="fm-mkt-flow-label">{step.label}</div>
            {i < 3 && <ArrowRight size={16} className="fm-mkt-flow-arrow" />}
          </div>
        ))}
      </section>

      <section className="fm-mkt-features">
        <h2 className="fm-display fm-mkt-h2">Everything a feedback loop needs</h2>

        <div className="fm-mkt-feature-grid">
          <div className="fm-mkt-feature">
            <MessageSquare size={18} />
            <h3>Feedback boards</h3>
            <p>
              Create as many boards as you need — feature requests, bug
              reports, general feedback — each with its own feed.
            </p>
          </div>

          <div className="fm-mkt-feature">
            <ThumbsUp size={18} />
            <h3>Voting</h3>
            <p>
              Customers vote on the ideas that matter to them, so you know
              what to prioritize without guessing.
            </p>
          </div>

          <div className="fm-mkt-feature">
            <MessageSquare size={18} />
            <h3>Comments</h3>
            <p>
              Every feedback post has a conversation attached, so context
              never gets lost.
            </p>
          </div>

          <div className="fm-mkt-feature">
            <Map size={18} />
            <h3>Roadmap</h3>
            <p>
              A public roadmap that shows what's planned, in progress, and
              shipped — built from real customer requests.
            </p>
          </div>

          <div className="fm-mkt-feature">
            <Megaphone size={18} />
            <h3>Changelog</h3>
            <p>
              Announce what you've shipped, so customers can see their
              feedback turn into real product changes.
            </p>
          </div>

          <div className="fm-mkt-feature">
            <Globe size={18} />
            <h3>Your own portal</h3>
            <p>
              Every workspace gets a public feedback portal you can share
              directly with your customers.
            </p>
          </div>
        </div>
      </section>

      <MarketingPricing id="pricing" />

      <section className="fm-mkt-final-cta">
        <h2 className="fm-display fm-mkt-h2">Start collecting feedback today</h2>
        <p className="fm-mkt-sub">Set up your workspace in a couple of minutes.</p>
        <Link to="/register" className="fm-btn-primary">
          Get started <ArrowRight size={14} />
        </Link>
      </section>

      <footer className="fm-mkt-footer">
        <div className="fm-brand">
          <div className="fm-brand-mark">
            <Compass size={16} />
          </div>
          <div className="fm-brand-name fm-display">fidmap</div>
        </div>

        <nav className="fm-mkt-footer-links">
          <Link to="/register">Get started</Link>
          <Link to="/sign-in">Sign in</Link>
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

export default Marketing;

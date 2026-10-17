import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Globe,
  LayoutDashboard,
  Lightbulb,
  Map,
  MessageSquare,
  Megaphone,
  Play,
  Sparkles,
  ThumbsUp,
  Users,
} from "lucide-react";

import MarketingPricing from "../components/MarketingPricing";
import ResourcesMenu from "../components/ResourcesMenu";
import ProductPreview from "../components/ProductPreview";
import Seo, { SITE_URL } from "../components/Seo";
import { withReferralParam } from "../utils/referral";

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FIDMAP",
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FIDMAP",
    url: SITE_URL,
  },
];

const Marketing = () => {
  return (
    <div className="fm-marketing">
      <Seo
        title="FIDMAP — Know what to build next | Customer feedback to decisions"
        description="FIDMAP turns customer feedback, votes and surveys into explained priority scores and decision briefs, then moves the winners onto a public roadmap and tells the customers who asked."
        path="/"
        jsonLd={jsonLd}
      />

      {/* NAVIGATION */}
      <header className="fm-mkt-nav">
        <Link to="/" className="fm-brand">
          <div className="fm-brand-mark">
            <img src="/logo.svg" alt="FIDMAP" />
          </div>
          <div className="fm-brand-name fm-display">fidmap</div>
        </Link>

        <nav className="fm-mkt-nav-links">
          <Link to="/customer-feedback">Product</Link>
          <ResourcesMenu />
          <Link to="/pricing">Pricing</Link>
          {/* <a href="#pricing">Pricing</a> */}
          <a href="https://app.fidmap.co/sign-in">Sign in</a>

          <a
            href={withReferralParam("https://app.fidmap.co/register")}
            className="fm-btn-primary fm-nav-cta"
          >
            Start your free trial
          </a>
        </nav>
      </header>

      {/* HERO */}
      <main>
        <section className="fm-mkt-hero fm-hero-new">
          <div className="fm-hero-badge">
            <span className="fm-live-dot" />
            From customer feedback to a decision you can defend
          </div>

          <h1 className="fm-display fm-mkt-h1">
            Know what
            <span> to build next.</span>
          </h1>

          <p className="fm-mkt-sub fm-hero-description">
            FIDMAP turns customer requests, votes and survey answers into an
            explained priority score and a decision brief, then puts what you
            choose on a public roadmap and tells the customers who asked.
          </p>

          <div className="fm-mkt-cta-row">
            <a
              href={withReferralParam("https://app.fidmap.co/register")}
              className="fm-btn-primary fm-btn-large"
            >
              Start your free trial
              <ArrowRight size={16} />
            </a>

            <a href="#how-it-works" className="fm-btn-ghost fm-btn-large">
              See how it works
              <ChevronRight size={16} />
            </a>
          </div>

          <div className="fm-hero-note">
            <Check size={14} />
            7-day free trial
            <span>·</span>
            No credit card required
          </div>
        </section>

        {/* PRODUCT DEMO */}
        <section id="product-demo" className="fm-product-demo-section">
          <div className="fm-section-eyebrow">
            <Sparkles size={14} />
            See FIDMAP in action
          </div>

          <h2 className="fm-display fm-mkt-h2">
            Turn scattered feedback into
            <span className="fm-blue-text"> decisions you can explain.</span>
          </h2>

          <p className="fm-section-description">
            Give customers one place to submit ideas, vote on requests, follow
            progress, and see what's coming next.
          </p>

          <ProductPreview />
        </section>

        {/* OPTIONAL VIDEO */}
        {/* <section className="fm-video-section">
          <div className="fm-video-copy">
            <div className="fm-section-eyebrow">
              <Play size={14} />
              Product walkthrough
            </div>

            <h2 className="fm-display fm-mkt-h2">
              See what your team can do with FIDMAP.
            </h2>

            <p>
              From collecting the first request to announcing the feature you
              shipped, FIDMAP keeps the entire feedback loop in one place.
            </p>
          </div>

          <div className="fm-video-wrapper">
            <video controls preload="metadata" poster="/fidmap-demo-poster.png">
              <source src="/fidmap-demo.mp4" type="video/mp4" />
              Your browser does not support video playback.
            </video>

            <div className="fm-video-overlay-label">
              <Play size={14} />
              FIDMAP product demo
            </div>
          </div>
        </section> */}

        {/* VALUE PROPOSITION */}
        <section id="how-it-works" className="fm-value-section">
          <div className="fm-section-eyebrow">
            <Lightbulb size={14} />
            How FIDMAP helps you decide
          </div>

          <h2 className="fm-display fm-mkt-h2">
            Evidence in. An explained recommendation out.
          </h2>

          <p className="fm-section-description">
            Counting votes is not a decision. FIDMAP combines distinct
            supporters, linked survey answers, recent activity and your own
            urgency and strategic-fit ratings into a score, and shows you
            exactly why a request scored the way it did.
          </p>

          <div className="fm-value-grid">
            <ValueCard
              icon={<ThumbsUp />}
              title="Score with evidence"
              text="Every request gets a score with a visible range and a confidence level. Signals you have not provided are left out, not guessed."
            />

            <ValueCard
              icon={<Lightbulb />}
              title="Decision briefs"
              text="See the evidence, the score breakdown and the recommendation in one place, then record your decision and your reason. Overrides are kept on record."
            />

            <ValueCard
              icon={<MessageSquare />}
              title="Surveys as evidence"
              text="Ask customers directly and link the answers to a request, so a decision rests on more than votes."
            />

            <ValueCard
              icon={<Sparkles />}
              title="Merge duplicates"
              text="FIDMAP suggests likely duplicates for you to review. Merging moves the votes without counting anyone twice."
            />

            <ValueCard
              icon={<Map />}
              title="One step to the roadmap"
              text="Turn a decision into a roadmap item with a target date. The request stays linked to it."
            />

            <ValueCard
              icon={<Megaphone />}
              title="Tell the people who asked"
              text="Supporters can get an email when a request or its roadmap item changes status, with a one-click unsubscribe."
            />
          </div>
        </section>

        <section className="fm-value-section">
          <div className="fm-section-eyebrow">
            <Lightbulb size={14} />
            Everything in one place
          </div>

          <h2 className="fm-display fm-mkt-h2">
            Stop losing valuable customer feedback.
          </h2>

          <p className="fm-section-description">
            Replace scattered requests across email, support tickets, Slack,
            spreadsheets, and Discord with one organized feedback system.
          </p>

          <div className="fm-value-grid">
            <ValueCard
              icon={<MessageSquare />}
              title="Collect feedback"
              text="Give customers a simple place to submit ideas, requests, and problems."
            />

            <ValueCard
              icon={<ThumbsUp />}
              title="Prioritize with votes"
              text="See which requests customers actually care about instead of guessing."
            />

            <ValueCard
              icon={<Map />}
              title="Build your roadmap"
              text="Turn customer requests into a public roadmap your customers can follow."
            />

            <ValueCard
              icon={<Megaphone />}
              title="Close the feedback loop"
              text="Announce shipped features and show customers that their feedback mattered."
            />

            <ValueCard
              icon={<Globe />}
              title="Your own feedback portal"
              text="Give customers a branded portal they can visit and share with their team."
            />

            <ValueCard
              icon={<Users />}
              title="Keep customers involved"
              text="Let customers vote, comment, follow progress, and stay informed."
            />
          </div>
        </section>

        {/* SIMPLE EXPLANATION */}
        <section className="fm-process-section">
          <div className="fm-process-copy">
            <div className="fm-section-eyebrow">
              <LayoutDashboard size={14} />
              One feedback loop
            </div>

            <h2 className="fm-display fm-mkt-h2">
              From customer request to shipped feature.
            </h2>

            <p>
              FIDMAP connects the pieces that are usually scattered across
              different tools.
            </p>

            <div className="fm-process-list">
              <ProcessStep
                number="01"
                title="Customers submit"
                text="Customers tell you what they need."
              />

              <ProcessStep
                number="02"
                title="Customers vote"
                text="Your community tells you what matters most."
              />

              <ProcessStep
                number="03"
                title="You decide"
                text="Review the explained score, record your decision, and turn the strongest requests into roadmap items."
              />

              <ProcessStep
                number="04"
                title="You announce"
                text="Close the loop when the feature ships."
              />
            </div>
          </div>

          <div className="fm-process-visual">
            <div className="fm-visual-glow" />

            <div className="fm-visual-card fm-visual-card-main">
              <div className="fm-visual-card-header">
                <span>Customer feedback</span>
                <span className="fm-blue-pill">124 votes</span>
              </div>

              <h3>Dark mode</h3>

              <p>
                Give users the option to switch between light and dark mode.
              </p>

              <div className="fm-visual-progress">
                <div />
              </div>

              <div className="fm-visual-footer">
                <span>Improvement</span>
                <strong>Planned</strong>
              </div>
            </div>

            <div className="fm-floating-card fm-floating-one">
              <ThumbsUp size={15} />
              <span>+124 votes</span>
            </div>

            <div className="fm-floating-card fm-floating-two">
              <Check size={15} />
              <span>Added to roadmap</span>
            </div>
          </div>
        </section>

        {/* PRICING */}
        {/* <MarketingPricing id="pricing" /> */}

        {/* FINAL CTA */}
        <section className="fm-mkt-final-cta">
          <div className="fm-final-glow" />

          <div className="fm-section-eyebrow">
            <Sparkles size={14} />
            Start building with your customers
          </div>

          <h2 className="fm-display fm-mkt-h2">
            Build what your customers actually want.
          </h2>

          <p className="fm-mkt-sub">
            Set up your feedback portal in minutes and start turning customer
            feedback into product decisions.
          </p>

          <a
            href={withReferralParam("https://app.fidmap.co/register")}
            className="fm-btn-primary fm-btn-large"
          >
            Start free trial
            <ArrowRight size={16} />
          </a>

          <div className="fm-hero-note">
            <Check size={14} />
            7-day free trial
            <span>·</span>
            No credit card required
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="fm-mkt-footer fm-mkt-footer-expanded">
        <div className="fm-mkt-footer-grid">
          <div className="fm-footer-brand-column">
            <Link to="/" className="fm-brand">
              <div className="fm-brand-mark">
                <img src="/logo.svg" alt="FIDMAP" />
              </div>

              <div className="fm-brand-name fm-display">fidmap</div>
            </Link>
            <div className="fm-mkt-footer-copy fm-mono">
              © {new Date().getFullYear()} FIDMAP
            </div>

            <p>
              Customer feedback and feature request software for SaaS teams.
            </p>
          </div>

          <div>
            <div className="fm-mkt-footer-heading fm-mono">Product</div>
            <Link to="/customer-feedback">Customer Feedback</Link>
            <Link to="/feature-request-management">Feature Requests</Link>
            <Link to="/feedback-board">Feedback Board</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/exclusive-deal">Exclusive Deal</Link>
          </div>

          <div>
            <div className="fm-mkt-footer-heading fm-mono">Support</div>
            <Link to="/help">Help center</Link>
            <Link to="/resources">Resources</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/about">About</Link>
          </div>

          <div>
            <div className="fm-mkt-footer-heading fm-mono">Compare</div>
            <Link to="/alternatives/canny">Canny Alternative</Link>
            <Link to="/alternatives/frill">Frill Alternative</Link>
            <Link to="/alternatives/productboard">
              Productboard Alternative
            </Link>
            <Link to="/alternatives/uservoice">UserVoice Alternative</Link>
          </div>

          <div>
            <div className="fm-mkt-footer-heading fm-mono">Legal</div>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/refund-policy">Refund Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

const DemoRoadmapCard = ({ item }) => (
  <div className="fm-roadmap-card">
    <span className={`fm-status ${item.statusClass}`}>{item.status}</span>
    <h4>{item.title}</h4>
    <p>{item.description}</p>
  </div>
);

const ValueCard = ({ icon, title, text }) => (
  <div className="fm-value-card">
    <div className="fm-value-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{text}</p>
  </div>
);

const ProcessStep = ({ number, title, text }) => (
  <div className="fm-process-step">
    <span>{number}</span>

    <div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  </div>
);

export default Marketing;

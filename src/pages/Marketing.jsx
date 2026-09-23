import { useState } from "react";
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
  X,
} from "lucide-react";

import MarketingPricing from "../components/MarketingPricing";
import Seo, { SITE_URL } from "../components/Seo";

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

const demoFeedback = [
  {
    id: 1,
    votes: 124,
    title: "Dark mode",
    description: "Give users the option to switch between light and dark mode.",
    status: "Planned",
    statusClass: "planned",
    category: "Improvement",
  },
  {
    id: 2,
    votes: 87,
    title: "Slack integration",
    description: "Get notifications when customers submit new feedback.",
    status: "In progress",
    statusClass: "progress",
    category: "Integration",
  },
  {
    id: 3,
    votes: 64,
    title: "Mobile application",
    description: "Access FIDMAP from iOS and Android devices.",
    status: "Considering",
    statusClass: "considering",
    category: "Mobile",
  },
];

const demoRoadmap = [
  {
    title: "Slack integration",
    description: "Get notified about new customer feedback.",
    status: "In progress",
    statusClass: "progress",
  },
  {
    title: "Dark mode",
    description: "Give users a comfortable dark interface.",
    status: "Planned",
    statusClass: "planned",
  },
  {
    title: "Mobile application",
    description: "Take your feedback portal on the go.",
    status: "Considering",
    statusClass: "considering",
  },
];

const demoUpdates = [
  {
    title: "Slack integration is coming",
    date: "Sep 18, 2026",
    description:
      "You'll soon be able to receive FIDMAP feedback notifications directly in Slack.",
  },
  {
    title: "Public roadmap improvements",
    date: "Sep 12, 2026",
    description: "Roadmaps are now easier for customers to browse and follow.",
  },
];

const Marketing = () => {
  const [demoTab, setDemoTab] = useState("feedback");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [voted, setVoted] = useState([]);

  const handleVote = (id) => {
    setVoted((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  return (
    <div className="fm-marketing">
      <Seo
        title="FIDMAP — Customer Feedback & Feature Request Software"
        description="Collect customer feedback, let customers vote on feature requests, prioritize what matters, and share your product roadmap."
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
          <Link to="/blog">Blog</Link>
          <a href="#pricing">Pricing</a>
          <a href="https://app.fidmap.co/sign-in">Sign in</a>

          <a
            href="https://app.fidmap.co/register"
            className="fm-btn-primary fm-nav-cta"
          >
            Start free trial
          </a>
        </nav>
      </header>

      {/* HERO */}
      <main>
        <section className="fm-mkt-hero fm-hero-new">
          <div className="fm-hero-badge">
            <span className="fm-live-dot" />
            Customer feedback, finally organized
          </div>

          <h1 className="fm-display fm-mkt-h1">
            Your customers tell you
            <span> what to build.</span>
          </h1>

          <p className="fm-mkt-sub fm-hero-description">
            FIDMAP helps SaaS teams collect customer feedback, manage feature
            requests, prioritize what matters, and share their product roadmap
            with customers.
          </p>

          <div className="fm-mkt-cta-row">
            <a
              href="https://app.fidmap.co/register"
              className="fm-btn-primary fm-btn-large"
            >
              Start free trial
              <ArrowRight size={16} />
            </a>

            <a href="#product-demo" className="fm-btn-ghost fm-btn-large">
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
            <span className="fm-blue-text"> a clear product roadmap.</span>
          </h2>

          <p className="fm-section-description">
            Give customers one place to submit ideas, vote on requests, follow
            progress, and see what's coming next.
          </p>

          <div className="fm-demo-window">
            {/* DEMO HEADER */}
            <div className="fm-demo-topbar">
              <div className="fm-demo-brand">
                <div className="fm-demo-logo">
                  <img src="/logo.svg" alt="" />
                </div>

                <div>
                  <strong>Acme Product</strong>
                  <span>Customer feedback</span>
                </div>
              </div>

              <div className="fm-demo-tabs">
                <button
                  className={demoTab === "feedback" ? "active" : ""}
                  onClick={() => {
                    setDemoTab("feedback");
                    setSelectedFeedback(null);
                  }}
                >
                  Feedback
                </button>

                <button
                  className={demoTab === "roadmap" ? "active" : ""}
                  onClick={() => {
                    setDemoTab("roadmap");
                    setSelectedFeedback(null);
                  }}
                >
                  Roadmap
                </button>

                <button
                  className={demoTab === "updates" ? "active" : ""}
                  onClick={() => {
                    setDemoTab("updates");
                    setSelectedFeedback(null);
                  }}
                >
                  Updates
                </button>
              </div>

              <button className="fm-demo-submit">+ Submit feedback</button>
            </div>

            {/* DEMO CONTENT */}
            <div className="fm-demo-body">
              {demoTab === "feedback" && !selectedFeedback && (
                <>
                  <div className="fm-demo-heading">
                    <div>
                      <span className="fm-demo-kicker">Feedback</span>
                      <h3>What should we build next?</h3>
                    </div>

                    <button className="fm-demo-filter">
                      Popular
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  <div className="fm-feedback-list">
                    {demoFeedback.map((item) => {
                      const hasVoted = voted.includes(item.id);

                      return (
                        <div
                          className="fm-feedback-card"
                          key={item.id}
                          onClick={() => setSelectedFeedback(item)}
                        >
                          <button
                            className={`fm-vote ${hasVoted ? "voted" : ""}`}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleVote(item.id);
                            }}
                          >
                            <ThumbsUp size={14} />
                            <strong>{item.votes + (hasVoted ? 1 : 0)}</strong>
                          </button>

                          <div className="fm-feedback-main">
                            <h4>{item.title}</h4>

                            <p>{item.description}</p>

                            <div className="fm-feedback-meta">
                              <span>{item.category}</span>
                              <span className={`fm-status ${item.statusClass}`}>
                                {item.status}
                              </span>
                            </div>
                          </div>

                          <ChevronRight
                            size={18}
                            className="fm-feedback-arrow"
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {demoTab === "feedback" && selectedFeedback && (
                <div className="fm-demo-detail">
                  <button
                    className="fm-back-button"
                    onClick={() => setSelectedFeedback(null)}
                  >
                    ← Back to feedback
                  </button>

                  <div className="fm-detail-layout">
                    <div className="fm-detail-vote">
                      <ThumbsUp size={18} />
                      <strong>
                        {selectedFeedback.votes +
                          (voted.includes(selectedFeedback.id) ? 1 : 0)}
                      </strong>

                      <button
                        className={
                          voted.includes(selectedFeedback.id) ? "active" : ""
                        }
                        onClick={() => handleVote(selectedFeedback.id)}
                      >
                        {voted.includes(selectedFeedback.id) ? "Voted" : "Vote"}
                      </button>
                    </div>

                    <div>
                      <span className="fm-demo-kicker">
                        {selectedFeedback.category}
                      </span>

                      <h3>{selectedFeedback.title}</h3>

                      <p className="fm-detail-description">
                        {selectedFeedback.description}
                      </p>

                      <div className="fm-detail-status">
                        <span
                          className={`fm-status ${selectedFeedback.statusClass}`}
                        >
                          {selectedFeedback.status}
                        </span>
                      </div>

                      <div className="fm-demo-comment-box">
                        <MessageSquare size={16} />
                        <span>12 comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {demoTab === "roadmap" && (
                <>
                  <div className="fm-demo-heading">
                    <div>
                      <span className="fm-demo-kicker">Roadmap</span>
                      <h3>Here's what we're building</h3>
                    </div>
                  </div>

                  <div className="fm-roadmap-columns">
                    <div className="fm-roadmap-column">
                      <div className="fm-roadmap-column-title">
                        <span className="fm-roadmap-dot considering" />
                        Considering
                      </div>

                      {demoRoadmap
                        .filter((item) => item.status === "Considering")
                        .map((item) => (
                          <DemoRoadmapCard key={item.title} item={item} />
                        ))}
                    </div>

                    <div className="fm-roadmap-column">
                      <div className="fm-roadmap-column-title">
                        <span className="fm-roadmap-dot progress" />
                        In progress
                      </div>

                      {demoRoadmap
                        .filter((item) => item.status === "In progress")
                        .map((item) => (
                          <DemoRoadmapCard key={item.title} item={item} />
                        ))}
                    </div>

                    <div className="fm-roadmap-column">
                      <div className="fm-roadmap-column-title">
                        <span className="fm-roadmap-dot planned" />
                        Planned
                      </div>

                      {demoRoadmap
                        .filter((item) => item.status === "Planned")
                        .map((item) => (
                          <DemoRoadmapCard key={item.title} item={item} />
                        ))}
                    </div>
                  </div>
                </>
              )}

              {demoTab === "updates" && (
                <>
                  <div className="fm-demo-heading">
                    <div>
                      <span className="fm-demo-kicker">Changelog</span>
                      <h3>What's new</h3>
                    </div>
                  </div>

                  <div className="fm-update-list">
                    {demoUpdates.map((update) => (
                      <article className="fm-update-card" key={update.title}>
                        <div className="fm-update-icon">
                          <Megaphone size={16} />
                        </div>

                        <div>
                          <span>{update.date}</span>
                          <h4>{update.title}</h4>
                          <p>{update.description}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <p className="fm-demo-caption">
            This is an interactive preview of FIDMAP — no signup required.
          </p>
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
                title="You prioritize"
                text="Turn the strongest requests into roadmap items."
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
        <MarketingPricing id="pricing" />

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
            href="https://app.fidmap.co/register"
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
          </div>

          <div>
            <div className="fm-mkt-footer-heading fm-mono">Support</div>
            <Link to="/resources">Resources</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/about">About</Link>
          </div>

          <div>
            <div className="fm-mkt-footer-heading fm-mono">Compare</div>
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

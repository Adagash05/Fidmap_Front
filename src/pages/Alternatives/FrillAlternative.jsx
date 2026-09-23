import { ArrowRight } from "lucide-react";

import MarketingLayout from "../../layouts/MarketingLayout";
import Seo from "../../components/Seo";
import { APP_URL } from "../../constants/pricing";

/*
 * Frill's pricing/plan details below were verified via live web search
 * (not training-data recall) at the time this page was written. Sources
 * disagreed slightly on exact figures, so numbers are given as
 * approximate ("around") with a link to Frill's own pricing page —
 * treat this the same way as the Canny page: don't assume it stays
 * accurate indefinitely.
 */
const FrillAlternative = () => (
  <MarketingLayout>
    <Seo
      title="FIDMAP vs. Frill: Customer Feedback Software Comparison"
      description="A factual comparison of FIDMAP and Frill for collecting customer feedback, running a public roadmap, and announcing releases."
      path="/alternatives/frill"
    />

    <section className="fm-mkt-hero">
      <div className="fm-mkt-eyebrow fm-mono">Frill alternative</div>
      <h1 className="fm-display fm-mkt-h1">FIDMAP vs. Frill</h1>
      <p className="fm-mkt-sub">
        FIDMAP and Frill both cover the core feedback-to-roadmap-to- changelog
        workflow. Here's how they actually differ.
      </p>
    </section>

    <article className="fm-legal" style={{ maxWidth: 760 }}>
      <h2>What Frill is</h2>
      <p>
        Frill (frill.co) is a feedback platform built around three connected
        pieces: Ideas (a feedback board customers vote and comment on), a public
        Roadmap, and Announcements (a changelog widget teams can embed to tell
        users what shipped). Frill also offers NPS/CSAT survey add-ons and a
        widget for embedding announcements directly in a product.
      </p>

      <h2>What FIDMAP is</h2>
      <p>
        FIDMAP covers the same core loop — feedback boards, voting, comments, a
        public roadmap, and a changelog — under your own workspace portal.
        FIDMAP does not currently offer built-in NPS or CSAT surveys.
      </p>

      <h2>How pricing works</h2>
      <p>
        As of this writing, Frill's paid plans start at around $25/month for
        smaller teams, with higher tiers around $49/month and $149/month as team
        size and feature needs grow, and a 14-day free trial with no credit card
        required. Check{" "}
        <a href="https://frill.co/pricing" target="_blank" rel="noreferrer">
          Frill's pricing page
        </a>{" "}
        for current numbers, since pricing pages change.
      </p>
      <p>
        FIDMAP's plans are priced by tier (Startup, Business) with limits on
        team members, boards, feedback posts, and end users, plus a one-time
        Lifetime option — see{" "}
        <a href={`${APP_URL}/register`}>FIDMAP's own pricing</a> for exact
        current numbers.
      </p>

      <h2>Where they overlap</h2>
      <ul>
        <li>Public feedback boards ("Ideas" in Frill) customers vote on</li>
        <li>A public roadmap</li>
        <li>A changelog/announcements feature for shipped updates</li>
      </ul>

      <h2>Where they differ</h2>
      <ul>
        <li>
          Frill includes optional NPS/CSAT survey add-ons; FIDMAP is focused on
          the feedback-board-to-roadmap-to-changelog workflow without built-in
          surveys.
        </li>
        <li>
          FIDMAP offers a one-time Lifetime plan; Frill's plans are
          subscription-based.
        </li>
      </ul>

      <h2>Who might prefer each</h2>
      <p>
        Teams that also want NPS/CSAT surveys alongside feedback management may
        prefer Frill. Teams that want a focused feedback-to-roadmap-to-changelog
        tool, including a one-time Lifetime pricing option, may prefer FIDMAP.
      </p>
    </article>

    <section className="fm-mkt-final-cta">
      <h2 className="fm-display fm-mkt-h2">
        Try FIDMAP free for 7 days – No credit card required
      </h2>
      <a href={`${APP_URL}/register`} className="fm-btn-primary">
        Start free trial <ArrowRight size={14} />
      </a>
    </section>
  </MarketingLayout>
);

export default FrillAlternative;

import { ArrowRight } from "lucide-react";

import MarketingLayout from "../../layouts/MarketingLayout";
import Seo from "../../components/Seo";
import { APP_URL } from "../../constants/pricing";

/*
 * Canny's pricing/plan details below were verified via live web search
 * (not training-data recall) at the time this page was written — Canny
 * has changed its pricing structure more than once. Framed with "at the
 * time of writing" and a link to Canny's own pricing page since these
 * numbers can change; do not treat them as permanently accurate.
 */
const CannyAlternative = () => (
  <MarketingLayout>
    <Seo
      title="FIDMAP vs. Canny: Customer Feedback Software Comparison"
      description="A factual comparison of FIDMAP and Canny for collecting customer feedback and managing feature requests."
      path="/alternatives/canny"
    />

    <section className="fm-mkt-hero">
      <div className="fm-mkt-eyebrow fm-mono">Canny alternative</div>
      <h1 className="fm-display fm-mkt-h1">FIDMAP vs. Canny</h1>
      <p className="fm-mkt-sub">
        Both FIDMAP and Canny help teams collect customer feedback, run
        voting, and maintain a public roadmap and changelog. Here's how
        they actually differ.
      </p>
    </section>

    <article className="fm-legal" style={{ maxWidth: 760 }}>
      <h2>What Canny is</h2>
      <p>
        Canny (canny.io) is an established customer feedback platform.
        Customers post feature requests to a board, vote and comment on
        them, and your team triages requests, links them to a roadmap, and
        announces releases through a changelog. Canny also has an
        AI-assisted layer ("Autopilot") that pulls feedback out of
        connected tools like support tickets and sales calls, along with a
        broad set of integrations (Slack, Jira, Intercom, Zendesk, and
        others).
      </p>

      <h2>What FIDMAP is</h2>
      <p>
        FIDMAP covers the same core workflow — feedback boards, voting,
        comments, a public roadmap, and a changelog, all under your own
        workspace portal — without the AI-automation or integration layer
        Canny has built around that workflow.
      </p>

      <h2>How pricing works</h2>
      <p>
        This is the most concrete structural difference between the two.
        Canny prices by <strong>tracked users</strong> — anyone who posts,
        votes, or comments in your account counts toward your plan's
        limit, and moving up a tier (or past a tier's user cap) increases
        the price. As of this writing, Canny's paid plans start at
        roughly $79/month (billed annually) for a limited number of
        tracked users, scaling upward from there; a custom-priced
        Business plan exists above that. Check{" "}
        <a href="https://canny.io/pricing" target="_blank" rel="noreferrer">
          Canny's pricing page
        </a>{" "}
        for current numbers.
      </p>
      <p>
        FIDMAP prices by <strong>plan tier</strong>, with limits on team
        members, boards, feedback posts, and end users rather than a
        per-tracked-user metric — see{" "}
        <a href={`${APP_URL}/register`}>FIDMAP's own pricing</a> for exact
        current numbers.
      </p>

      <h2>Where they overlap</h2>
      <ul>
        <li>Public feedback boards customers submit ideas to</li>
        <li>Voting to surface demand instead of guessing</li>
        <li>A public roadmap</li>
        <li>A changelog for announcing what shipped</li>
      </ul>

      <h2>Where they differ</h2>
      <ul>
        <li>
          Canny has a broader integration ecosystem and an AI-automation
          layer (Autopilot) that pulls feedback from other tools
          automatically; FIDMAP does not currently offer this.
        </li>
        <li>
          Canny bills by tracked users; FIDMAP bills by plan tier with
          usage limits attached.
        </li>
        <li>
          Canny has been in the category since 2017 with a larger
          integration surface; FIDMAP is a more recent, more focused
          product built around the core feedback-to-roadmap-to-changelog
          loop.
        </li>
      </ul>

      <h2>Who might prefer each</h2>
      <p>
        Teams that need deep integrations with existing support/sales
        tools and are comfortable with usage-based pricing that scales
        with engagement may prefer Canny. Teams that want the core
        feedback-board-to-roadmap-to-changelog workflow at a predictable,
        tier-based price may prefer FIDMAP.
      </p>
    </article>

    <section className="fm-mkt-final-cta">
      <h2 className="fm-display fm-mkt-h2">Try FIDMAP free for 7 days</h2>
      <a href={`${APP_URL}/register`} className="fm-btn-primary">
        Start free trial <ArrowRight size={14} />
      </a>
    </section>
  </MarketingLayout>
);

export default CannyAlternative;

import { ArrowRight } from "lucide-react";

import MarketingLayout from "../layouts/MarketingLayout";
import Seo from "../components/Seo";
import { APP_URL } from "../constants/pricing";

/*
 * Deliberately does NOT invent a founding story, team bios, customer
 * count, or funding history — none of that exists in this codebase, and
 * PHASE 4/34 explicitly prohibit fabricating it. This describes what
 * FIDMAP actually is and why it exists, which is the honest version of
 * an "About" page available here.
 */
const About = () => (
  <MarketingLayout>
    <Seo
      title="About FIDMAP"
      description="FIDMAP is customer feedback and feature request software for SaaS teams — built to replace scattered feedback with one shared, votable board."
      path="/about"
    />

    <section className="fm-mkt-hero">
      <div className="fm-mkt-eyebrow fm-mono">About</div>
      <h1 className="fm-display fm-mkt-h1">
        Built to give customer feedback a home
      </h1>
      <p className="fm-mkt-sub">
        FIDMAP exists to solve one specific problem: customer feedback that
        gets scattered across email, tickets, and calls, with no shared
        place for a team to see what customers actually want.
      </p>
    </section>

    <article className="fm-legal" style={{ maxWidth: 760 }}>
      <h2>What FIDMAP does</h2>
      <p>
        FIDMAP gives a team public feedback boards where customers submit
        ideas, vote on the ones that matter to them, and comment with
        context. Teams turn the requests they prioritize into a public
        roadmap, and announce what ships in a changelog — so the loop
        between "a customer asked for this" and "we built it" is visible
        to everyone involved.
      </p>

      <h2>Who FIDMAP is for</h2>
      <p>
        FIDMAP is built for SaaS teams — product managers, founders, and
        support teams — who want one shared place to collect and act on
        customer feedback instead of piecing it together from scattered
        channels.
      </p>

      <h2>How we think about the product</h2>
      <p>
        The features in FIDMAP are the ones that directly support that
        loop: boards for collecting feedback, voting for surfacing demand,
        comments for keeping context attached to a request, and a roadmap
        and changelog for closing the loop with customers. We'd rather
        build that loop well than add features that don't serve it.
      </p>
    </article>

    <section className="fm-mkt-final-cta">
      <h2 className="fm-display fm-mkt-h2">See it for yourself</h2>
      <a href={`${APP_URL}/register`} className="fm-btn-primary">
        Start free trial <ArrowRight size={14} />
      </a>
    </section>
  </MarketingLayout>
);

export default About;

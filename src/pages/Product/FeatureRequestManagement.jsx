import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import MarketingLayout from "../../layouts/MarketingLayout";
import Seo from "../../components/Seo";
import { APP_URL } from "../../constants/pricing";

const FAQS = [
  {
    q: "What is feature request management?",
    a: "Feature request management is the process of collecting feature requests from customers, organizing and prioritizing them, and communicating back to customers about what's being built and when.",
  },
  {
    q: "How is this different from a general support inbox?",
    a: "A support inbox is built for one-to-one conversations. Feature request management is built for many-to-one: many customers pointing at the same underlying request, which needs to be visible as one thing, not many separate tickets.",
  },
  {
    q: "How does voting help with prioritization?",
    a: "Vote counts give you a signal for demand that doesn't depend on who happens to email you that week. A request with 40 votes from real customers is a stronger prioritization signal than a single loud request, even if the single request came from your newest customer.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const FeatureRequestManagement = () => (
  <MarketingLayout>
    <Seo
      title="Feature Request Management Software"
      description="Collect, organize, and prioritize feature requests with voting and a public roadmap. See how FIDMAP handles feature request management for SaaS teams."
      path="/feature-request-management"
      jsonLd={faqJsonLd}
    />

    <section className="fm-mkt-hero">
      <div className="fm-mkt-eyebrow fm-mono">Feature requests</div>
      <h1 className="fm-display fm-mkt-h1">
        Feature request management that scales past the first ten requests
      </h1>
      <p className="fm-mkt-sub">
        Email threads and spreadsheets work fine for the first ten feature
        requests. FIDMAP is built for when there are hundreds — collected,
        voted on, and prioritized in one place.
      </p>
      <div className="fm-mkt-cta-row">
        <a href={`${APP_URL}/register`} className="fm-btn-primary">
          <ArrowRight size={14} />
          Start free trial
        </a>
      </div>
    </section>

    <article className="fm-legal" style={{ maxWidth: 760 }}>
      <h2>The problem with email, spreadsheets, and support tickets</h2>
      <p>
        These tools weren't built to manage feature requests, so they don't
        do the two things that matter most: they don't merge duplicate
        requests into one, and they don't make demand visible. A
        spreadsheet row doesn't accumulate votes. A support ticket doesn't
        show whether five other customers asked for the same thing last
        month.
      </p>

      <h2>Collecting requests</h2>
      <p>
        In FIDMAP, customers submit feature requests directly to a public
        board — either through your workspace's feedback portal, or a
        specific board you've shared with them. Each submission becomes a
        single post that other customers can find and vote on, rather than
        a new, disconnected entry.
      </p>

      <h2>Organizing requests</h2>
      <p>
        Requests live on boards you define — separate boards for different
        products, feature areas, or customer segments if that's useful to
        you. Every post carries a title, description, vote count, and
        comment thread, so the full context of a request is attached to
        it, not spread across whichever channel it originally came in on.
      </p>

      <h2>Voting and prioritization</h2>
      <p>
        Customers vote on requests instead of re-submitting them. That
        turns scattered mentions of the same idea into one number your
        team can actually compare across requests — a much more concrete
        starting point for prioritization than "a few people have asked
        about this."
      </p>

      <h2>Closing the loop</h2>
      <p>
        Once you've decided what to build, FIDMAP's roadmap shows customers
        what's planned, in progress, and shipped — built from the requests
        they voted on. When something ships, a changelog entry announces
        it, so the customers who asked actually see their feedback turn
        into a real product change.
      </p>

      <p>
        Related reading:{" "}
        <Link to="/feedback-board">what a public feedback board looks like</Link>{" "}
        and <Link to="/customer-feedback">customer feedback management</Link>.
      </p>
    </article>

    <section
      className="fm-legal"
      style={{ maxWidth: 760, borderTop: "1px solid var(--line)", paddingTop: 32 }}
    >
      <h2>Frequently asked questions</h2>
      {FAQS.map((f) => (
        <div key={f.q} style={{ marginBottom: 20 }}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}
    </section>

    <section className="fm-mkt-final-cta">
      <h2 className="fm-display fm-mkt-h2">
        Turn feature requests into a roadmap
      </h2>
      <a href={`${APP_URL}/register`} className="fm-btn-primary">
        Start free trial <ArrowRight size={14} />
      </a>
    </section>
  </MarketingLayout>
);

export default FeatureRequestManagement;

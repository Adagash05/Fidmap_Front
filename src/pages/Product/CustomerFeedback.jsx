import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import MarketingLayout from "../../layouts/MarketingLayout";
import Seo from "../../components/Seo";
import { APP_URL } from "../../constants/pricing";

const FAQS = [
  {
    q: "What is customer feedback management?",
    a: "Customer feedback management is the practice of collecting feedback and feature requests from customers, organizing it in one place, and using it to inform product decisions — instead of letting it get lost across email, support tickets, calls, and spreadsheets.",
  },
  {
    q: "Why does customer feedback get scattered in the first place?",
    a: "Feedback usually comes in through whatever channel a customer happens to be using — a support ticket, a sales call, a Slack message, an email. Without one place to collect it, the same request gets logged nowhere, logged twice, or forgotten entirely.",
  },
  {
    q: "How does FIDMAP help centralize feedback?",
    a: "FIDMAP gives your team public feedback boards where customers submit requests directly, vote on existing ones, and comment. Every submission lives in one place your whole team can see, instead of being scattered across other tools.",
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

const CustomerFeedback = () => (
  <MarketingLayout>
    <Seo
      title="Customer Feedback Management Software"
      description="Collect, organize, and act on customer feedback in one place. FIDMAP centralizes feature requests, votes, and comments so nothing gets lost."
      path="/customer-feedback"
      jsonLd={faqJsonLd}
    />

    <section className="fm-mkt-hero">
      <div className="fm-mkt-eyebrow fm-mono">Customer feedback</div>
      <h1 className="fm-display fm-mkt-h1">
        Customer feedback management, without the spreadsheet
      </h1>
      <p className="fm-mkt-sub">
        Every customer request lives somewhere — a support ticket, an email
        thread, a sales call note. FIDMAP gives your team one place to
        collect it, organize it, and see what customers actually want.
      </p>
      <div className="fm-mkt-cta-row">
        <a href={`${APP_URL}/register`} className="fm-btn-primary">
          <ArrowRight size={14} />
          Start free trial
        </a>
      </div>
    </section>

    <article className="fm-legal" style={{ maxWidth: 760 }}>
      <h2>Why customer feedback gets scattered</h2>
      <p>
        Most teams don't lack customer feedback — they lack a place to put
        it. A customer mentions a missing feature on a call. Another emails
        support about the same thing. A third posts it in a shared Slack
        channel. Three signals for the same request, and none of them are
        connected, so nobody notices the pattern.
      </p>

      <h2>What centralizing feedback actually looks like</h2>
      <p>
        Centralizing feedback means giving customers (and your team) one
        place to submit and find requests, instead of many. In FIDMAP, that
        place is a feedback board: customers submit an idea once, and
        anyone else who wants the same thing votes on it instead of
        submitting a duplicate. Your team sees demand accumulate on a
        single post rather than guessing how many people asked for
        something.
      </p>

      <h2>How teams use FIDMAP to manage feedback</h2>
      <p>Once feedback is centralized, FIDMAP gives your team a few things to do with it:</p>
      <ul>
        <li>
          <strong>Boards</strong> — organize feedback into as many boards as
          you need (feature requests, bugs, general feedback), each with
          its own feed.
        </li>
        <li>
          <strong>Voting</strong> — customers vote on existing requests
          instead of creating duplicates, so demand is visible at a glance.
        </li>
        <li>
          <strong>Comments</strong> — every feedback post has a
          conversation attached, so the context behind a request isn't
          lost.
        </li>
        <li>
          <strong>Roadmap and changelog</strong> — turn the feedback you've
          prioritized into a public roadmap, then announce what shipped in
          a changelog, closing the loop with the customers who asked.
        </li>
      </ul>

      <h2>From feedback to product decisions</h2>
      <p>
        The point of collecting feedback isn't the collection itself — it's
        using it. Because every request in FIDMAP carries a vote count and
        a comment thread, prioritization is based on what you can actually
        see customers asking for, rather than whoever spoke up loudest or
        most recently.
      </p>

      <p>
        See how this plays out around a specific workflow:{" "}
        <Link to="/feature-request-management">feature request management</Link>{" "}
        and <Link to="/feedback-board">public feedback boards</Link>.
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
        Give customer feedback a home
      </h2>
      <a href={`${APP_URL}/register`} className="fm-btn-primary">
        Start free trial <ArrowRight size={14} />
      </a>
    </section>
  </MarketingLayout>
);

export default CustomerFeedback;

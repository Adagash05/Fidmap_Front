import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import MarketingLayout from "../../layouts/MarketingLayout";
import Seo from "../../components/Seo";
import { APP_URL } from "../../constants/pricing";

const FAQS = [
  {
    q: "What is a public feedback board?",
    a: "A public feedback board is a page where customers can submit ideas, vote on existing ones, and see what a company is planning to build. It replaces private, scattered feedback channels with one shared, visible place.",
  },
  {
    q: "Why make a feedback board public instead of internal-only?",
    a: "A public board lets customers see that their request already exists (so they vote instead of duplicating it) and see that it's being taken seriously, which encourages more useful feedback over time.",
  },
  {
    q: "Do customers need an account to use a feedback board?",
    a: "In FIDMAP, customers submit feedback, vote, and comment on a public board directly — without needing a staff account. Only your team needs to sign in to manage boards, the roadmap, and the changelog.",
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

const FeedbackBoard = () => (
  <MarketingLayout>
    <Seo
      title="Public Feedback Board Software"
      description="Give customers one place to submit ideas, vote, and see what's coming next. See how a FIDMAP public feedback board works."
      path="/feedback-board"
      jsonLd={faqJsonLd}
    />

    <section className="fm-mkt-hero">
      <div className="fm-mkt-eyebrow fm-mono">Feedback board</div>
      <h1 className="fm-display fm-mkt-h1">
        One public board, instead of a hundred private conversations
      </h1>
      <p className="fm-mkt-sub">
        A feedback board gives customers a place to submit ideas and vote
        on what matters to them — and gives your team a public, ordered
        view of demand instead of scattered mentions across other
        channels.
      </p>
      <div className="fm-mkt-cta-row">
        <a href={`${APP_URL}/register`} className="fm-btn-primary">
          <ArrowRight size={14} />
          Start free trial
        </a>
      </div>
    </section>

    <article className="fm-legal" style={{ maxWidth: 760 }}>
      <h2>Why companies use a feedback board</h2>
      <p>
        A feedback board makes the process of asking for something, and
        seeing whether other people want it too, public. That single
        change does most of the work: customers check the board before
        submitting, so duplicate requests turn into votes on an existing
        one, and your team gets a running, visible tally of what's most
        wanted.
      </p>

      <h2>How customers use a board</h2>
      <p>
        On a FIDMAP feedback board, a customer submits an idea with a
        title and description. Other visitors can vote on it or leave a
        comment — no staff account required, since the board is public.
        Over time, the board becomes a real record of what your customers
        are asking for, not just what your team happened to write down.
      </p>

      <h2>How your team manages a board</h2>
      <p>
        Your team creates and manages boards from the FIDMAP dashboard —
        one board per product area, feature category, or however you want
        to split things up. Every submitted post can be reviewed,
        commented on, and eventually linked to a roadmap item once you've
        decided to build it.
      </p>

      <h2>From board to roadmap to changelog</h2>
      <p>
        A feedback board on its own is useful, but it's most useful
        connected to what happens next: FIDMAP's roadmap shows which
        board-sourced requests are planned or in progress, and the
        changelog announces what's shipped — so customers who voted can
        see the outcome of their vote.
      </p>

      <p>
        See how this fits into a broader workflow:{" "}
        <Link to="/feature-request-management">feature request management</Link>{" "}
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
        Give your customers a place to be heard
      </h2>
      <a href={`${APP_URL}/register`} className="fm-btn-primary">
        Start free trial <ArrowRight size={14} />
      </a>
    </section>
  </MarketingLayout>
);

export default FeedbackBoard;

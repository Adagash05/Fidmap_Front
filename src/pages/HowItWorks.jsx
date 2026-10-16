import { ArrowRight } from "lucide-react";

import MarketingLayout from "../layouts/MarketingLayout";
import Seo from "../components/Seo";
import { APP_URL, TRIAL_DAYS } from "../constants/pricing";
import { withReferralParam } from "../utils/referral";

/*
 * /how-it-works — the connected decision workflow, described only in terms of
 * what the product does today. Stages: Collect -> Understand -> Prioritize ->
 * Decide -> Communicate.
 */
const STEPS = [
  {
    title: "1. Collect",
    text: "Customers submit requests and vote on a public board, and you can ask structured questions with surveys (single choice, multiple choice, rating, free text). Each person is identified by email, so one person is one supporter and one survey response.",
  },
  {
    title: "2. Understand",
    text: "FIDMAP suggests likely duplicate requests for you to review. Confirm a pair and the votes move to the request you keep, without counting anyone twice, and the other request stays on record. The Insights page shows recurring themes and weekly activity, each linked to the requests behind it.",
  },
  {
    title: "3. Prioritize",
    text: "Every open request gets a score from distinct supporters, linked survey answers, recent activity, and the urgency and strategic-fit ratings your team adds. You see the score range, a confidence level, and a line-by-line breakdown. Anything you have not provided is left out rather than guessed, and effort is shown next to the score, not hidden inside it.",
  },
  {
    title: "4. Decide",
    text: "Open a request to see its decision brief: the evidence, the breakdown, what is missing, and a recommendation (prioritize, consider, investigate, defer). Record your decision and reason. If you disagree with the recommendation, or reject a request, a reason is required and stays on record. One step turns the decision into a roadmap item with a target date.",
  },
  {
    title: "5. Communicate",
    text: "People who submitted, voted or commented follow the request. When its status or its roadmap item changes, they get an email once per change, with a one-click unsubscribe. Delivery is tracked and failures are retried, so you can see what was actually sent.",
  },
];

const HowItWorks = () => (
  <MarketingLayout>
    <Seo
      title="How FIDMAP Works: From Customer Feedback to a Decision"
      description="Collect, understand, prioritize, decide, communicate: how FIDMAP turns customer requests, votes and surveys into explained priorities and a roadmap."
      path="/how-it-works"
    />

    <section className="fm-mkt-hero">
      <div className="fm-mkt-eyebrow fm-mono">How it works</div>
      <h1 className="fm-display fm-mkt-h1">Know what to build next.</h1>
      <p className="fm-mkt-sub">
        Turn scattered customer feedback into clear product priorities.
        FIDMAP connects feature requests, surveys and customer demand to
        evidence-backed decisions and a roadmap your customers can follow.
      </p>
    </section>

    <article className="fm-legal" style={{ maxWidth: 760 }}>
      <ol className="fm-x-steps">
        {STEPS.map((s) => (
          <li key={s.title}>
            <strong>{s.title}</strong>
            {s.text}
          </li>
        ))}
      </ol>

      <h2>What the score is, and is not</h2>
      <p>
        The score is a transparent rule, not an opinion from an AI. The same
        evidence always produces the same score, and the rule is versioned.
        It helps you compare requests and see what is missing; it does not
        replace your judgement, which is why you can override it and record why.
      </p>
    </article>

    <section className="fm-mkt-final-cta">
      <h2 className="fm-display fm-mkt-h2">
        Try it free for {TRIAL_DAYS} days
      </h2>
      <a href={withReferralParam(`${APP_URL}/register`)} className="fm-btn-primary">
        Start your free trial <ArrowRight size={14} />
      </a>
    </section>
  </MarketingLayout>
);

export default HowItWorks;

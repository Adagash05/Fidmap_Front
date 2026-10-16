import { ArrowRight } from "lucide-react";

import MarketingLayout from "../../layouts/MarketingLayout";
import Seo, { SITE_URL } from "../../components/Seo";
import { APP_URL, TRIAL_DAYS } from "../../constants/pricing";
import { withReferralParam } from "../../utils/referral";

/*
 * Shared layout for the "FIDMAP vs X" pages. Every competitor statement passed in
 * must come from docs/COMPETITOR_RESEARCH.md ("What we can safely say") and carries
 * the date it was checked. Things we could not verify are written as "not listed on
 * the page we checked", never as "X does not have it".
 */
export const VERIFIED_ON = "October 14, 2026";

const ComparisonPage = ({
  slug,
  name,
  pricingUrl,
  intro,
  whatTheyAre,
  pricing,
  rows,
  fidmapStrengths,
  theirStrengths,
  whoPrefersWhich,
}) => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `FIDMAP vs. ${name}`,
    url: `${SITE_URL}/alternatives/${slug}`,
  };

  return (
    <MarketingLayout>
      <Seo
        title={`FIDMAP vs. ${name}: Feedback to Decision Comparison`}
        description={`A factual comparison of FIDMAP and ${name}: pricing model, surveys, duplicate handling, prioritization and roadmap. Competitor facts last checked ${VERIFIED_ON}.`}
        path={`/alternatives/${slug}`}
        jsonLd={jsonLd}
      />

      <section className="fm-mkt-hero">
        <div className="fm-mkt-eyebrow fm-mono">{name} alternative</div>
        <h1 className="fm-display fm-mkt-h1">FIDMAP vs. {name}</h1>
        <p className="fm-mkt-sub">{intro}</p>
      </section>

      <article className="fm-legal" style={{ maxWidth: 760 }}>
        <p>
          <em>
            Competitor details were read from {name}&apos;s own public pages on{" "}
            {VERIFIED_ON}. Pricing pages change, so check{" "}
            <a href={pricingUrl} target="_blank" rel="noreferrer">
              {name}&apos;s pricing page
            </a>{" "}
            before deciding. Where we could not confirm something, we say so
            instead of guessing.
          </em>
        </p>

        <h2>What {name} is</h2>
        <p>{whatTheyAre}</p>

        <h2>What FIDMAP is</h2>
        <p>
          FIDMAP is built around one question: what should we build next? It
          collects feedback, votes and survey answers, scores each request
          with an explanation you can read, lets you record a decision and
          your reasoning, then moves the request onto a public roadmap and
          emails the people who asked when it changes.
        </p>

        <h2>Pricing</h2>
        {pricing}
        <p>
          FIDMAP&apos;s prices are shown publicly on our{" "}
          <a href="/pricing">pricing page</a>, with a {TRIAL_DAYS}-day free
          trial.
        </p>

        <h2>Side by side</h2>
        <div className="fm-table-wrap">
          <table className="fm-table" style={{ whiteSpace: "normal" }}>
            <thead>
              <tr>
                <th>Topic</th>
                <th>FIDMAP</th>
                <th>{name}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([topic, fidmap, theirs]) => (
                <tr key={topic}>
                  <td>{topic}</td>
                  <td>{fidmap}</td>
                  <td>{theirs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Where FIDMAP is stronger</h2>
        <ul>
          {fidmapStrengths.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <h2>Where {name} is stronger</h2>
        <ul>
          {theirStrengths.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>

        <h2>Who might prefer each</h2>
        <p>{whoPrefersWhich}</p>
      </article>

      <section className="fm-mkt-final-cta">
        <h2 className="fm-display fm-mkt-h2">
          Try FIDMAP free for {TRIAL_DAYS} days
        </h2>
        <a href={withReferralParam(`${APP_URL}/register`)} className="fm-btn-primary">
          Start your free trial <ArrowRight size={14} />
        </a>
      </section>
    </MarketingLayout>
  );
};

export default ComparisonPage;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import MarketingLayout from "../layouts/MarketingLayout";
import Seo from "../components/Seo";
import { APP_URL } from "../constants/pricing";
import { Callout, Flow, Shot, Steps, WeightBar } from "../components/help/HelpParts";

/*
 * Help center (/help). Every statement here describes behaviour that exists
 * in the product today (checked against the backend and the React source).
 * Screenshots are renders of the real frontend, seeded with the fictional
 * "Tallyfox" demo workspace (public/help/*.webp). Nothing is described that
 * FIDMAP does not do; see "What FIDMAP does not do" below.
 */

const SECTIONS = [
  ["start", "Start here"],
  ["dashboard", "Dashboard"],
  ["boards", "Boards & feedback"],
  ["duplicates", "Duplicates"],
  ["surveys", "Surveys"],
  ["priorities", "Priorities & scoring"],
  ["decisions", "Decisions"],
  ["roadmap", "Roadmap & changelog"],
  ["notifications", "Notifications"],
  ["insights", "Insights"],
  ["team", "Team & workspace"],
  ["limits", "What FIDMAP does not do"],
  ["faq", "FAQ"],
];

const FAQ = [
  [
    "Do my customers need an account to vote?",
    "No. Anyone with the board link can vote, comment or post an idea. They are asked for a name and an email address. FIDMAP does not verify that the email is theirs, so treat it as a contact detail, not proof of identity.",
  ],
  [
    "Can I use the score without any survey or team ratings?",
    "Yes. Missing signals are left out and the remaining ones are re-weighted. The score then comes with a wider range and usually lower confidence, and the breakdown tells you what to add.",
  ],
  [
    "Does FIDMAP merge duplicates automatically?",
    "No. It suggests pairs; you decide. Merging is your call every time.",
  ],
  [
    "Is there AI in FIDMAP?",
    "No. Duplicate suggestions use word overlap, and the score is a fixed, documented formula (scoring v1). Neither involves a language model.",
  ],
  [
    "Does FIDMAP connect to Slack, Jira, Zendesk or similar?",
    "No. There are no third-party integrations and no single sign-on today.",
  ],
  [
    "Who gets an email when a status changes?",
    "People who posted, voted or commented on a request. Each has a one-click unsubscribe, and each status update is sent once.",
  ],
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const useActiveSection = () => {
  const [active, setActive] = useState(SECTIONS[0][0]);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const seen = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting ? e.boundingClientRect.top : null));
        const visible = [...seen.entries()].filter(([, t]) => t !== null).sort((a, b) => a[1] - b[1]);
        if (visible.length) setActive(visible[0][0]);
      },
      { rootMargin: "-90px 0px -60% 0px" },
    );
    SECTIONS.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return [active, setActive];
};

const Section = ({ id, eyebrow, title, children }) => (
  <section id={id} className="fm-help-section" aria-labelledby={`${id}-h`}>
    <div className="fm-mkt-eyebrow fm-mono">{eyebrow}</div>
    <h2 id={`${id}-h`} className="fm-display">{title}</h2>
    {children}
  </section>
);

const Help = () => {
  const [active, setActive] = useActiveSection();

  // Honour #hash on load (client routing does not scroll by itself).
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) setTimeout(() => document.getElementById(id)?.scrollIntoView(), 50);
  }, []);

  return (
    <MarketingLayout>
      <Seo
        title="Help center — how FIDMAP works"
        description="Step-by-step guides to FIDMAP: collect feedback on public boards, merge duplicates, run surveys, read explained priority scores, record decisions, plan a roadmap and notify customers."
        path="/help"
        jsonLd={jsonLd}
      />

      <section className="fm-mkt-hero fm-help-hero">
        <div className="fm-mkt-eyebrow fm-mono">Help center</div>
        <h1 className="fm-display fm-mkt-h1">How FIDMAP works</h1>
        <p className="fm-mkt-lede">
          Each guide describes what the product does today, with screenshots of the real app. All
          screenshots use sample data from a fictional workspace called Tallyfox.
        </p>
        <a className="fm-help-try" href="/#product-demo">Try the interactive preview →</a>
      </section>

      <div className="fm-help-layout">
        <nav className="fm-help-nav" aria-label="Help center sections">
          <ul>
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active === id ? "true" : undefined}
                  onClick={() => setActive(id)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <main className="fm-help-main" id="help-content">
          <Section id="start" eyebrow="Start here" title="From feedback to a decision, in six steps">
            <p>
              FIDMAP helps a small product team decide what to build from customer feedback. It
              follows one path, and each step feeds the next.
            </p>
            <Flow
              label="The FIDMAP workflow"
              nodes={[
                { title: "Collect", text: "Customers post, vote and comment on a public board.", where: "Boards" },
                { title: "Organize", text: "You merge duplicate requests.", where: "Priorities → Duplicates" },
                { title: "Gather evidence", text: "Surveys add structured answers.", where: "Priorities → Surveys" },
                { title: "Prioritize", text: "Each request gets an explained score.", where: "Priorities" },
                { title: "Decide", text: "You record a decision and why.", where: "Decision brief" },
                { title: "Plan & tell", text: "The roadmap moves; followers get an email.", where: "Roadmap" },
              ]}
            />
            <Steps
              items={[
                ["Create a board", "Boards → New board. Share its public link with customers."],
                ["Let feedback arrive", "Customers vote and post. Their votes, comments and posts are the demand signal."],
                ["Open Priorities", "See requests ranked by evidence, with a “Why?” for every score."],
                ["Record a decision", "Open a request, add your team's ratings, and record the decision. Create the roadmap item in the same step."],
                ["Keep people informed", "Change a status and FIDMAP emails the people who asked."],
              ]}
            />
            <Callout kind="tip" title="Learn it by clicking">
              The <a href="/#product-demo">interactive preview</a> on the home page walks through
              these steps with the same labels, statuses and wording as the app.
            </Callout>
          </Section>

          <Section id="dashboard" eyebrow="Overview" title="Dashboard">
            <p>
              The dashboard is the staff landing page. It shows counts by status, the latest
              feedback, shortcuts for creating a board, roadmap item or changelog entry, your boards,
              a roadmap summary and recent changelog entries. “What should we build next?” opens
              Priorities.
            </p>
            <Shot
              src="/help/dashboard.webp" w={1280} h={917} eager
              alt="FIDMAP dashboard showing feedback counts, recent feedback, quick actions, boards, roadmap overview and recent changelog."
              caption="The staff dashboard."
              marks={[
                { x: 918, y: 240, text: "Counts of all feedback by status." },
                { x: 686, y: 372, text: "Latest requests with status, author and votes." },
                { x: 1190, y: 378, text: "Quick actions to create a board, roadmap item or changelog entry." },
                { x: 842, y: 30, text: "Main navigation: Dashboard, Boards, Priorities, Roadmap, Changelog." },
              ]}
            />
          </Section>

          <Section id="boards" eyebrow="Collect" title="Boards & feedback">
            <p>
              A board is a public page where customers submit and vote on requests. Each board has
              its own link. Visitors can search, filter by status (Open, Planned, In progress,
              Completed, Rejected) and sort by Top or New.
            </p>
            <Shot
              src="/help/board-public.webp" w={1280} h={900}
              alt="A public FIDMAP feedback board listing requests with vote counts, status badges, a status filter, search and a New idea button."
              caption="What your customers see on a public board."
              marks={[
                { x: 58, y: 244, text: "Filter by status." },
                { x: 340, y: 301, text: "Vote count. Click to vote or remove your vote." },
                { x: 556, y: 338, text: "Status badge and author." },
                { x: 1034, y: 224, text: "Sort by Top or New." },
                { x: 1256, y: 840, text: "New idea opens the submission form." },
              ]}
            />
            <h3>How people take part</h3>
            <ul>
              <li>To vote, comment or post, a visitor enters a name and email once. No account is created.</li>
              <li>A request starts as <strong>Open</strong>. Staff move it through Planned, In progress, Completed or Rejected.</li>
              <li>Posting, voting or commenting makes that person a follower of the request (see Notifications).</li>
              <li>Each person counts once toward a request&apos;s supporters, however they took part.</li>
            </ul>
            <Callout kind="warn" title="Emails are not verified">
              FIDMAP takes the email as typed and does not confirm it. Public actions are
              rate-limited, but a determined person could still vote under several emails.
            </Callout>
          </Section>

          <Section id="duplicates" eyebrow="Organize" title="Duplicates">
            <p>
              Similar requests split votes and hide demand. <strong>Priorities → Duplicates → Scan
              for duplicates</strong> compares your open requests and lists likely pairs with a
              similarity percentage and the shared terms.
            </p>
            <Shot
              src="/help/duplicates.webp" w={1280} h={560}
              alt="The Duplicates page showing two similar recurring-invoice requests, 55% similar, with a Keep this one choice and Merge and Not a duplicate buttons."
              caption="Review a suggested pair, choose the request to keep, then merge."
              marks={[
                { x: 190, y: 257, text: "How similar the two requests are." },
                { x: 1196, y: 257, text: "The words they share." },
                { x: 84, y: 406, text: "Choose which request to keep." },
                { x: 180, y: 470, text: "Merge, or mark the pair Not a duplicate." },
              ]}
            />
            <h3>What merging does</h3>
            <ul>
              <li>The votes of the merged request move onto the one you keep. Someone who voted on both is counted once.</li>
              <li>Comments and history are kept, and followers stay subscribed.</li>
              <li>“Not a duplicate” dismisses the pair so it is not suggested again.</li>
            </ul>
            <Callout kind="note" title="How matching works">
              Suggestions are based on shared words in the title and description, not on meaning.
              Two requests that describe the same need in different words may not be paired, and
              two that share words may not be duplicates. That is why you always confirm.
            </Callout>
          </Section>

          <Section id="surveys" eyebrow="Gather evidence" title="Surveys">
            <p>
              A survey asks customers direct questions through a public link, without sign-in.
              Linking a survey to a request turns its answers into evidence for that request&apos;s
              score. Questions can be a 1–5 rating, a choice, or free text.
            </p>
            <Shot
              src="/help/surveys.webp" w={1280} h={420}
              alt="The Surveys page listing a published survey with 3 questions, 22 responses and buttons to copy the public link, close, view results or delete."
              caption="Surveys list: publish, copy the link, close, view results."
              marks={[
                { x: 1198, y: 246, text: "A survey is published, then closed when you have enough answers." },
                { x: 232, y: 336, text: "Copy the public link to share it." },
                { x: 441, y: 336, text: "Results shows the answers." },
              ]}
            />
            <Shot
              src="/help/survey-public.webp" w={760} h={680}
              alt="A public survey form with name and email fields, a 1 to 5 rating, a choice question and a free-text question."
              caption="What a respondent sees. No account needed."
              marks={[{ x: 306, y: 232, text: "A 1–5 rating question. Ratings feed the survey part of the score." }]}
            />
            <Callout kind="note" title="Survey limits by plan">
              Startup includes 1 survey and Business includes up to 10. The Surveys page shows how
              many you have used. If you move to a smaller plan, existing surveys are kept; you just
              cannot create new ones until you are within the limit.
            </Callout>
            <Callout kind="note">
              The score uses the number of responses and the average rating of the linked survey.
              Free-text and choice answers are shown in Results; they do not change the score.
            </Callout>
          </Section>

          <Section id="priorities" eyebrow="Prioritize" title="Priorities & scoring">
            <p>
              <strong>Priorities</strong> ranks requests by evidence instead of by raw vote count.
              Every row shows a score, a recommendation, a confidence level and the numbers behind
              them. Click <strong>Why?</strong> to see exactly how the score was built.
            </p>
            <Shot
              src="/help/priorities.webp" w={1280} h={1077}
              alt="The Priorities table with scores, recommendations, supporters, surveys, effort and decision columns, and an expanded score breakdown for the top request."
              caption="Priorities, with the breakdown open for the top request."
              marks={[
                { x: 346, y: 319, text: "Score (0–100). A range such as 42–77 means some signals are missing." },
                { x: 586, y: 318, text: "Recommendation and confidence." },
                { x: 692, y: 326, text: "Supporters: distinct people who posted, voted or commented." },
                { x: 1146, y: 678, text: "Why? shows every signal, weight and piece of evidence." },
                { x: 1172, y: 310, text: "Hide why collapses the breakdown." },
              ]}
            />
            <h3>How the score is built (scoring v1)</h3>
            <WeightBar />
            <ul>
              <li><strong>Customer demand</strong> rises with distinct supporters and flattens out, so the 40th vote adds less than the 4th.</li>
              <li><strong>Survey evidence</strong> combines the number of responses with their average rating.</li>
              <li><strong>Recent activity</strong> halves every 30 days since the last vote, comment or post.</li>
              <li><strong>Urgency</strong> and <strong>strategic fit</strong> are 1–5 ratings from your team. Leave them empty and they are left out, not guessed.</li>
            </ul>
            <h3>Recommendations and confidence</h3>
            <div className="fm-help-table">
              <table>
                <thead><tr><th>Recommendation</th><th>When</th></tr></thead>
                <tbody>
                  <tr><td>Prioritize</td><td>Score 65 or more, with enough evidence</td></tr>
                  <tr><td>Consider</td><td>Score 40 to 64</td></tr>
                  <tr><td>Defer</td><td>Score below 40</td></tr>
                  <tr><td>Investigate</td><td>Low confidence, or fewer than 3 supporters and no survey responses: gather evidence first</td></tr>
                </tbody>
              </table>
            </div>
            <div className="fm-help-table">
              <table>
                <thead><tr><th>Confidence</th><th>When</th></tr></thead>
                <tbody>
                  <tr><td>High</td><td>10+ supporters and at least two of: survey responses, urgency rating, strategic rating</td></tr>
                  <tr><td>Medium</td><td>10+ supporters, or 3+ supporters with at least one of those inputs</td></tr>
                  <tr><td>Low</td><td>Otherwise</td></tr>
                </tbody>
              </table>
            </div>
            <Callout kind="warn" title="Read the range, not just the number">
              Scores are recommendations, not verdicts. A request with few supporters can still
              score high on ratings alone; the confidence tag and the range show how much
              evidence stands behind it. Completed and rejected requests are hidden unless you tick
              “Include completed and rejected”.
            </Callout>
          </Section>

          <Section id="decisions" eyebrow="Decide" title="Decisions">
            <p>
              Open a request from Priorities to get its <strong>decision brief</strong>: the
              recommendation, the evidence and where it came from, your team&apos;s inputs, and a
              form to record the decision. Every decision is kept in the history with the score
              and confidence at that moment.
            </p>
            <Shot
              src="/help/brief.webp" w={1280} h={1798}
              alt="A decision brief with the recommendation and score breakdown, evidence, team inputs for urgency, strategic fit and effort, a decision form and decision history."
              caption="The decision brief for one request."
              marks={[
                { x: 1192, y: 206, text: "The recommendation and confidence." },
                { x: 1186, y: 322, text: "Every signal with weight, contribution and evidence." },
                { x: 84, y: 731, text: "Where the evidence comes from, for example a linked survey." },
                { x: 84, y: 875, text: "Urgency, strategic fit and effort. Save inputs re-scores the request." },
                { x: 1198, y: 1206, text: "Your decision: Prioritize, Consider, Investigate, Defer or Reject." },
                { x: 84, y: 1380, text: "Optionally create or link a roadmap item in the same step." },
                { x: 84, y: 1604, text: "Decision history, with the reason you gave." },
              ]}
            />
            <Steps
              items={[
                ["Rate urgency and strategic fit", "Optional. 1 to 5. Effort is for your reference and is not scored."],
                ["Choose a decision", "The recommendation is pre-selected. You can choose another."],
                ["Give a reason when it matters", "A reason is required if you override the recommendation or reject a request."],
                ["Add it to the roadmap", "Choose “Create a roadmap item” (with an optional target date) or link an existing item. Available for Prioritize and Consider."],
              ]}
            />
            <Callout kind="note" title="What a decision changes">
              Recording a decision does not email anyone by itself. If it puts the request on the
              roadmap and the request was still Open, it becomes Planned, and Reject marks it
              Rejected. Those status changes are what notify followers.
            </Callout>
          </Section>

          <Section id="roadmap" eyebrow="Plan" title="Roadmap & changelog">
            <p>
              The roadmap has six statuses: Considering, Planned, In progress, Testing, Complete
              and Cancelled. Items can carry a target date and link back to the request they came
              from. Change an item&apos;s status from the card. The changelog is where you
              announce what shipped.
            </p>
            <Shot
              src="/help/roadmap.webp" w={1280} h={500}
              alt="The roadmap board with columns Considering, Planned, In progress, Testing and Complete, each with roadmap item cards and a status selector."
              caption="The staff roadmap."
              marks={[
                { x: 1202, y: 108, text: "New roadmap item. The page shows how many items your plan allows." },
                { x: 285, y: 166, text: "One column per status, with a count." },
                { x: 508, y: 232, text: "A target date, if you set one." },
                { x: 494, y: 258, text: "Change status here." },
              ]}
            />
            <Callout kind="note">
              Each workspace also has a public portal with a read-only roadmap and changelog.
            </Callout>
          </Section>

          <Section id="notifications" eyebrow="Tell" title="Notifications">
            <p>
              When a request&apos;s status changes, or its roadmap item&apos;s status changes,
              FIDMAP emails the request&apos;s followers: anyone who posted, voted or commented.
            </p>
            <Flow
              label="How a notification is sent"
              nodes={[
                { title: "Status changes", text: "On the request or its roadmap item." },
                { title: "Followers found", text: "Author, voters and commenters who have not unsubscribed." },
                { title: "Email sent once", text: "Subject: Update on “request title”. The same update is not sent twice." },
                { title: "One-click unsubscribe", text: "Stops updates about that request." },
              ]}
            />
            <ul>
              <li>Moving a request back to Open does not send an email.</li>
              <li>The email says why the person is receiving it and links to unsubscribe.</li>
            </ul>
          </Section>

          <Section id="insights" eyebrow="Learn" title="Insights">
            <p>
              <strong>Priorities → Insights</strong> shows request counts by status, recurring
              themes, and new requests and votes per week for the last eight weeks.
            </p>
            <Shot
              src="/help/insights.webp" w={1280} h={986}
              alt="The Insights page with request counts, a recurring themes list and a last eight weeks table of new requests and new votes."
              caption="Insights."
              marks={[
                { x: 349, y: 214, text: "Counts by status." },
                { x: 86, y: 449, text: "Themes: words shared by two or more open requests, with total votes." },
                { x: 640, y: 700, text: "New requests and votes per week." },
              ]}
            />
            <Callout kind="note">
              Themes are shared title words, not topics detected by a model. Votes cast before
              vote timestamps were recorded are not in the weekly counts.
            </Callout>
          </Section>

          <Section id="team" eyebrow="Workspace" title="Team & workspace">
            <p>
              <strong>Settings → Team</strong> lists the people with staff access and their role
              (Owner, Admin or Member). Invite a colleague by email, choose a role, and they get a
              link to join. Pending invitations can be resent or revoked. Your plan sets how many
              team members you can have; the page shows how many are used.
            </p>
            <Shot
              src="/help/settings-team.webp" w={800} h={690}
              alt="Settings Team tab listing three members with roles, an invite by email form, and one pending invitation with resend and revoke buttons."
              caption="Team settings."
              marks={[
                { x: 506, y: 189, text: "Plan limit on team members." },
                { x: 524, y: 220, text: "Members and roles." },
                { x: 205, y: 416, text: "Invite by email." },
                { x: 705, y: 636, text: "Pending invitations: resend or revoke." },
              ]}
            />
            <p>
              Plans and prices are on the <Link to="/pricing">pricing page</Link>. Sign in or start
              a trial at <a href={`${APP_URL}/sign-in`}>app.fidmap.co</a>.
            </p>
          </Section>

          <Section id="limits" eyebrow="Honest limits" title="What FIDMAP does not do">
            <ul className="fm-help-limits">
              <li><strong>No AI.</strong> Duplicate suggestions use word overlap; scores use a fixed formula.</li>
              <li><strong>No integrations.</strong> There is no Slack, Jira, Intercom or similar connection, and no SSO.</li>
              <li><strong>No identity verification</strong> for people who vote or post.</li>
              <li><strong>No automatic decisions.</strong> Merging, deciding and status changes are always done by your team.</li>
              <li><strong>Scores need evidence.</strong> With very little data the score is a rough guide; look at the range and confidence.</li>
            </ul>
          </Section>

          <Section id="faq" eyebrow="FAQ" title="Frequently asked questions">
            <div className="fm-help-faq">
              {FAQ.map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
            <p>
              Still stuck? <Link to="/contact">Contact us</Link>.
            </p>
          </Section>
        </main>
      </div>
    </MarketingLayout>
  );
};

export default Help;

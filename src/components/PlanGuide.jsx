import { PLANS, TRIAL_DAYS } from "../constants/pricing";

/*
 * Plain-language plan guide. Every statement here maps to something the backend
 * actually does (PlanEntitlementService, subscription lifecycle). Nothing here
 * promises support levels, integrations or limits that are not configured.
 */
const COPY = {
  STARTUP: {
    who: "A small team running its first public feedback board and roadmap.",
    solves: "Gets customer requests out of email and spreadsheets and into one place, with explained priorities.",
    choose: "Choose Startup if you have up to 3 people working in FIDMAP and your volume fits the limits listed above.",
  },
  BUSINESS: {
    who: "A growing product team with several contributors, more customers and a need for private boards.",
    solves: "Raises the limits that small teams hit first (people, posts, end users) and adds private boards.",
    choose: "Choose Business when you need more than 3 team members, more than 10 boards, or private boards.",
  },
};

const PlanGuide = () => (
  <section className="fm-x-planguide" aria-labelledby="plan-guide-title">
    <h2 id="plan-guide-title" className="fm-display fm-mkt-h2">
      Which plan fits?
    </h2>

    <div className="fm-table-wrap">
      <table className="fm-table">
        <thead>
          <tr>
            <th />
            {PLANS.map((p) => (
              <th key={p.key}>{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Who it is for</td>
            {PLANS.map((p) => (
              <td key={p.key}>{COPY[p.key]?.who}</td>
            ))}
          </tr>
          <tr>
            <td>What it solves</td>
            {PLANS.map((p) => (
              <td key={p.key}>{COPY[p.key]?.solves}</td>
            ))}
          </tr>
          <tr>
            <td>Choose it when</td>
            {PLANS.map((p) => (
              <td key={p.key}>{COPY[p.key]?.choose}</td>
            ))}
          </tr>
          <tr>
            <td>Price</td>
            {PLANS.map((p) => (
              <td key={p.key}>
                ${p.monthly} per month, or ${p.yearly} per year
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>

    <h3 className="fm-x-subhead">What happens at a limit, and when access ends</h3>
    <ul className="fm-x-facts">
      <li>
        <strong>Reaching a limit:</strong> you cannot add more of that item (for example a new
        board) until you delete something or move to a plan with a higher limit. Existing data is
        never deleted.
      </li>
      <li>
        <strong>Free trial:</strong> every new workspace starts with a {TRIAL_DAYS}-day trial of
        the Startup plan. When it ends without a plan, creating and editing is switched off until
        you choose a plan. Your data is kept.
      </li>
      <li>
        <strong>Cancelling:</strong> a cancelled monthly or yearly plan stays active until the end
        of the period you paid for, then access ends. Changing between monthly and yearly Startup
        or Business plans is done from Settings → Subscription.
      </li>
      <li>
        <strong>Failed payment or pause:</strong> access to creating and editing stops until the
        payment issue is resolved.
      </li>
    </ul>
  </section>
);

export default PlanGuide;

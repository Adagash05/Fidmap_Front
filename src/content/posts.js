// Blog content, kept as data rather than one component per post so
// adding a future article is a matter of adding an entry here, not
// writing new JSX. Deliberately starting with 4 genuinely useful posts
// rather than the 10-15 suggested — see the SEO task's own "quality over
// quantity" rule. Each post's `body` is a small block list BlogPost.jsx
// renders as real headings/paragraphs/lists (h2/h3/p/ul), not one
// undifferentiated paragraph.

export const POSTS = [
  {
    slug: "what-is-customer-feedback-management",
    title: "What Is Customer Feedback Management?",
    description:
      "A plain explanation of customer feedback management: what it is, why feedback gets scattered without it, and what a working process looks like.",
    date: "2026-08-01",
    body: [
      {
        type: "p",
        text: "Customer feedback management is the practice of collecting feedback and feature requests from customers, organizing them somewhere your team can actually see patterns, and using that to inform what you build next. It sounds simple, and the individual steps are — the hard part is usually that none of it happens in one place.",
      },
      { type: "h2", text: "Why it needs to be a process, not a habit" },
      {
        type: "p",
        text: "Most teams already collect feedback in some form — a support inbox, sales call notes, a Slack channel where customers vent. The problem isn't that feedback doesn't exist; it's that it exists in five different places, none of which talk to each other. A request mentioned in a support ticket and the same request mentioned on a sales call look like two separate, weaker signals instead of one strong one.",
      },
      { type: "h2", text: "What a working process looks like" },
      {
        type: "p",
        text: "A working feedback process usually has three parts: a single place to collect requests, a way to see which requests have the most demand, and a way to close the loop once something ships.",
      },
      {
        type: "ul",
        items: [
          "Collection: one shared place customers submit to, instead of scattered channels",
          "Signal: a way to see demand — typically votes — instead of guessing from memory",
          "Closing the loop: telling customers what happened to the thing they asked for",
        ],
      },
      { type: "h2", text: "Where a feedback board fits in" },
      {
        type: "p",
        text: "A public feedback board (what FIDMAP calls a board) covers the first two parts directly: customers submit to it, and other customers vote on existing requests instead of creating duplicates, which gives you a demand signal for free. Pairing that with a public roadmap and changelog covers the third part — customers can see what's planned, and see when it ships.",
      },
    ],
    relatedSlugs: ["feature-requests-vs-feedback", "how-to-prioritize-feature-requests"],
  },

  {
    slug: "how-to-prioritize-feature-requests",
    title: "How to Prioritize Feature Requests",
    description:
      "A practical approach to prioritizing feature requests using vote counts, effort, and strategic fit — not just whoever asked most recently.",
    date: "2026-08-08",
    body: [
      {
        type: "p",
        text: "Most teams don't have too few feature requests — they have too many, with no consistent way to decide which ones to build first. Here's a practical way to think about prioritization once requests are actually collected somewhere.",
      },
      { type: "h2", text: "Start with a real demand signal" },
      {
        type: "p",
        text: "The weakest prioritization input is 'someone asked for this recently.' A much stronger one is a vote count: if a request has accumulated votes over weeks or months from real customers, that's a signal that doesn't depend on who happened to email you last. This is the main reason a public, votable board beats a private list — the list can't tell you how many people silently agree with a request they didn't personally submit.",
      },
      { type: "h2", text: "Weigh demand against effort" },
      {
        type: "p",
        text: "Vote count alone isn't the whole picture. A heavily-requested feature that takes a quarter to build competes with a handful of smaller wins you could ship in a week. Most teams end up plotting requests on some version of demand vs. effort — high demand, low effort first; high demand, high effort next; low demand, high effort last (or never).",
      },
      { type: "h2", text: "Factor in strategic fit" },
      {
        type: "p",
        text: "Not every high-vote request fits where the product is actually going. It's reasonable to deprioritize a popular request that pulls the product away from its direction — but if you do, say so publicly on the request rather than letting it sit silently. Customers who voted deserve to know it was considered, not ignored.",
      },
      { type: "h2", text: "Close the loop either way" },
      {
        type: "p",
        text: "Whether a request gets built or explicitly declined, telling the people who asked is what makes the whole process worth doing again. A changelog entry when something ships, or a status update on the request itself when it doesn't, keeps customers submitting feedback instead of giving up on being heard.",
      },
    ],
    relatedSlugs: ["what-is-customer-feedback-management", "what-is-a-feedback-board"],
  },

  {
    slug: "what-is-a-feedback-board",
    title: "What Is a Customer Feedback Board?",
    description:
      "What a customer feedback board is, how it works for customers and teams, and why making it public changes how it's used.",
    date: "2026-08-15",
    body: [
      {
        type: "p",
        text: "A customer feedback board is a page where customers submit ideas or requests, vote on ones that already exist, and see what a company is planning to build. It's the most common building block of a feedback management process, largely because it does double duty: it's where customers speak up, and where your team sees demand accumulate.",
      },
      { type: "h2", text: "How customers use a board" },
      {
        type: "p",
        text: "On a public board, a customer submitting a request usually checks first whether it already exists. If it does, they vote on it instead of writing a near-duplicate. If it doesn't, they submit it, and it's now visible for the next customer with the same idea to vote on instead of submitting their own version.",
      },
      { type: "h2", text: "How teams use a board" },
      {
        type: "p",
        text: "For your team, a board turns individual feedback into a ranked list you didn't have to build manually — sorted by votes, filterable by status (under review, planned, in progress, shipped), with the full comment history attached to each request so you're not relying on memory for why it was asked for.",
      },
      { type: "h2", text: "Why public, not internal-only" },
      {
        type: "p",
        text: "An internal-only list still solves the collection problem, but it loses the two things a public board adds: customers checking before duplicating, and customers seeing that their input is taken seriously because they can watch it move through stages.",
      },
    ],
    relatedSlugs: ["how-to-prioritize-feature-requests", "feature-requests-vs-feedback"],
  },

  {
    slug: "feature-requests-vs-feedback",
    title: "Customer Feedback vs. Feature Requests: What's the Difference?",
    description:
      "Feature requests are a type of customer feedback, not a separate category. Here's why the distinction matters for how you organize a board.",
    date: "2026-08-22",
    body: [
      {
        type: "p",
        text: "\"Feedback\" and \"feature requests\" get used almost interchangeably, but treating them as the same thing can make a feedback board harder to use than it needs to be.",
      },
      { type: "h2", text: "Feature requests are a type of feedback" },
      {
        type: "p",
        text: "A feature request is feedback with a specific shape: a customer asking for something that doesn't exist yet. Feedback more broadly includes bug reports, complaints about existing behavior, praise, and general comments — none of which are asking for something new to be built.",
      },
      { type: "h2", text: "Why the distinction matters for a board" },
      {
        type: "p",
        text: "If bug reports, feature requests, and general feedback all land on the same board, voting stops being a useful signal — a bug fix and a nice-to-have feature end up competing for votes in a way that doesn't reflect how differently they should be prioritized. Most teams solve this with separate boards: one for feature requests, one for bugs, sometimes a third for general feedback.",
      },
      { type: "h2", text: "How this works in FIDMAP" },
      {
        type: "p",
        text: "FIDMAP lets you create as many boards as you need, so feature requests, bugs, and general feedback can live separately with their own vote counts, while still rolling up into the same roadmap and changelog once something's been decided.",
      },
    ],
    relatedSlugs: ["what-is-a-feedback-board", "what-is-customer-feedback-management"],
  },
];

export const getPostBySlug = (slug) => POSTS.find((p) => p.slug === slug) || null;

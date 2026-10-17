/*
 * DEMO DATA ONLY — a fictional workspace ("Tallyfox", an invoicing app) used by
 *   - the homepage interactive preview, and
 *   - the Help center's illustrations.
 * Nothing here is customer data.
 *
 * The priority results were NOT hand-written: each one is the output of the
 * real backend class PriorityScoringEngine (scoring v1) run on the evidence
 * listed beside it, with "now" fixed at 2026-10-14T09:00:00Z. The duplicate
 * similarity (0.55) and shared terms come from the real TextSimilarity class.
 * If the scoring rules change, regenerate these values.
 */

export const DEMO_NOW = "2026-10-14";

export const DEMO_WORKSPACE = { name: "Tallyfox", tagline: "Invoicing for freelancers" };

const R = {
  "recurring": {
    "version": "v1",
    "score": 95,
    "scoreLow": 95,
    "scoreHigh": 95,
    "confidence": "HIGH",
    "recommendation": "PRIORITIZE",
    "reason": "Strong evidence (score 95) with high confidence.",
    "components": [
      {
        "key": "demand",
        "label": "Customer demand",
        "value": 100,
        "weight": 40,
        "contribution": 40.0,
        "explanation": "38 distinct supporter(s)"
      },
      {
        "key": "survey",
        "label": "Survey evidence",
        "value": 94,
        "weight": 20,
        "contribution": 18.8,
        "explanation": "22 survey response(s), average rating 4.5/5"
      },
      {
        "key": "recency",
        "label": "Recent activity",
        "value": 95,
        "weight": 10,
        "contribution": 9.5,
        "explanation": "Last activity 2 day(s) ago"
      },
      {
        "key": "urgency",
        "label": "Urgency",
        "value": 75,
        "weight": 15,
        "contribution": 11.3,
        "explanation": "Urgency rated 4/5 by your team"
      },
      {
        "key": "strategic",
        "label": "Strategic fit",
        "value": 100,
        "weight": 15,
        "contribution": 15.0,
        "explanation": "Strategic fit rated 5/5 by your team"
      }
    ],
    "missingEvidence": []
  },
  "darkmode": {
    "version": "v1",
    "score": 48,
    "scoreLow": 39,
    "scoreHigh": 59,
    "confidence": "MEDIUM",
    "recommendation": "CONSIDER",
    "reason": "Moderate evidence (score 48); weigh against effort and strategy.",
    "components": [
      {
        "key": "demand",
        "label": "Customer demand",
        "value": 76,
        "weight": 40,
        "contribution": 30.4,
        "explanation": "9 distinct supporter(s)"
      },
      {
        "key": "survey",
        "label": "Survey evidence",
        "value": null,
        "weight": 20,
        "contribution": 0.0,
        "explanation": "No evidence yet - excluded from the score"
      },
      {
        "key": "recency",
        "label": "Recent activity",
        "value": 46,
        "weight": 10,
        "contribution": 4.6,
        "explanation": "Last activity 34 day(s) ago"
      },
      {
        "key": "urgency",
        "label": "Urgency",
        "value": 0,
        "weight": 15,
        "contribution": 0.0,
        "explanation": "Urgency rated 1/5 by your team"
      },
      {
        "key": "strategic",
        "label": "Strategic fit",
        "value": 25,
        "weight": 15,
        "contribution": 3.8,
        "explanation": "Strategic fit rated 2/5 by your team"
      }
    ],
    "missingEvidence": [
      "Link a survey and collect responses"
    ]
  },
  "xero": {
    "version": "v1",
    "score": 75,
    "scoreLow": 75,
    "scoreHigh": 75,
    "confidence": "HIGH",
    "recommendation": "PRIORITIZE",
    "reason": "Strong evidence (score 75) with high confidence.",
    "components": [
      {
        "key": "demand",
        "label": "Customer demand",
        "value": 82,
        "weight": 40,
        "contribution": 32.8,
        "explanation": "11 distinct supporter(s)"
      },
      {
        "key": "survey",
        "label": "Survey evidence",
        "value": 74,
        "weight": 20,
        "contribution": 14.8,
        "explanation": "9 survey response(s), average rating 3.1/5"
      },
      {
        "key": "recency",
        "label": "Recent activity",
        "value": 89,
        "weight": 10,
        "contribution": 8.9,
        "explanation": "Last activity 5 day(s) ago"
      },
      {
        "key": "urgency",
        "label": "Urgency",
        "value": 50,
        "weight": 15,
        "contribution": 7.5,
        "explanation": "Urgency rated 3/5 by your team"
      },
      {
        "key": "strategic",
        "label": "Strategic fit",
        "value": 75,
        "weight": 15,
        "contribution": 11.3,
        "explanation": "Strategic fit rated 4/5 by your team"
      }
    ],
    "missingEvidence": []
  },
  "multicurrency": {
    "version": "v1",
    "score": 65,
    "scoreLow": 42,
    "scoreHigh": 77,
    "confidence": "MEDIUM",
    "recommendation": "PRIORITIZE",
    "reason": "Strong evidence (score 65) with medium confidence.",
    "components": [
      {
        "key": "demand",
        "label": "Customer demand",
        "value": 64,
        "weight": 40,
        "contribution": 25.6,
        "explanation": "6 distinct supporter(s)"
      },
      {
        "key": "survey",
        "label": "Survey evidence",
        "value": null,
        "weight": 20,
        "contribution": 0.0,
        "explanation": "No evidence yet - excluded from the score"
      },
      {
        "key": "recency",
        "label": "Recent activity",
        "value": 93,
        "weight": 10,
        "contribution": 9.3,
        "explanation": "Last activity 3 day(s) ago"
      },
      {
        "key": "urgency",
        "label": "Urgency",
        "value": 50,
        "weight": 15,
        "contribution": 7.5,
        "explanation": "Urgency rated 3/5 by your team"
      },
      {
        "key": "strategic",
        "label": "Strategic fit",
        "value": null,
        "weight": 15,
        "contribution": 0.0,
        "explanation": "No evidence yet - excluded from the score"
      }
    ],
    "missingEvidence": [
      "Link a survey and collect responses",
      "Add strategic fit (1-5)"
    ]
  },
  "mobile": {
    "version": "v1",
    "score": 64,
    "scoreLow": 51,
    "scoreHigh": 71,
    "confidence": "HIGH",
    "recommendation": "CONSIDER",
    "reason": "Moderate evidence (score 64); weigh against effort and strategy.",
    "components": [
      {
        "key": "demand",
        "label": "Customer demand",
        "value": 89,
        "weight": 40,
        "contribution": 35.6,
        "explanation": "14 distinct supporter(s)"
      },
      {
        "key": "survey",
        "label": "Survey evidence",
        "value": null,
        "weight": 20,
        "contribution": 0.0,
        "explanation": "No evidence yet - excluded from the score"
      },
      {
        "key": "recency",
        "label": "Recent activity",
        "value": 40,
        "weight": 10,
        "contribution": 4.0,
        "explanation": "Last activity 40 day(s) ago"
      },
      {
        "key": "urgency",
        "label": "Urgency",
        "value": 25,
        "weight": 15,
        "contribution": 3.8,
        "explanation": "Urgency rated 2/5 by your team"
      },
      {
        "key": "strategic",
        "label": "Strategic fit",
        "value": 50,
        "weight": 15,
        "contribution": 7.5,
        "explanation": "Strategic fit rated 3/5 by your team"
      }
    ],
    "missingEvidence": [
      "Link a survey and collect responses"
    ]
  },
  "slack": {
    "version": "v1",
    "score": 44,
    "scoreLow": 22,
    "scoreHigh": 72,
    "confidence": "LOW",
    "recommendation": "INVESTIGATE",
    "reason": "Not enough evidence to decide: gather more votes, link a survey, or add urgency/strategic inputs.",
    "components": [
      {
        "key": "demand",
        "label": "Customer demand",
        "value": 36,
        "weight": 40,
        "contribution": 14.4,
        "explanation": "2 distinct supporter(s)"
      },
      {
        "key": "survey",
        "label": "Survey evidence",
        "value": null,
        "weight": 20,
        "contribution": 0.0,
        "explanation": "No evidence yet - excluded from the score"
      },
      {
        "key": "recency",
        "label": "Recent activity",
        "value": 76,
        "weight": 10,
        "contribution": 7.6,
        "explanation": "Last activity 12 day(s) ago"
      },
      {
        "key": "urgency",
        "label": "Urgency",
        "value": null,
        "weight": 15,
        "contribution": 0.0,
        "explanation": "No evidence yet - excluded from the score"
      },
      {
        "key": "strategic",
        "label": "Strategic fit",
        "value": null,
        "weight": 15,
        "contribution": 0.0,
        "explanation": "No evidence yet - excluded from the score"
      }
    ],
    "missingEvidence": [
      "Link a survey and collect responses",
      "Add urgency (1-5)",
      "Add strategic fit (1-5)"
    ]
  },
  "bulkpdf": {
    "version": "v1",
    "score": 31,
    "scoreLow": 16,
    "scoreHigh": 66,
    "confidence": "LOW",
    "recommendation": "INVESTIGATE",
    "reason": "Not enough evidence to decide: gather more votes, link a survey, or add urgency/strategic inputs.",
    "components": [
      {
        "key": "demand",
        "label": "Customer demand",
        "value": 23,
        "weight": 40,
        "contribution": 9.2,
        "explanation": "1 distinct supporter(s)"
      },
      {
        "key": "survey",
        "label": "Survey evidence",
        "value": null,
        "weight": 20,
        "contribution": 0.0,
        "explanation": "No evidence yet - excluded from the score"
      },
      {
        "key": "recency",
        "label": "Recent activity",
        "value": 63,
        "weight": 10,
        "contribution": 6.3,
        "explanation": "Last activity 20 day(s) ago"
      },
      {
        "key": "urgency",
        "label": "Urgency",
        "value": null,
        "weight": 15,
        "contribution": 0.0,
        "explanation": "No evidence yet - excluded from the score"
      },
      {
        "key": "strategic",
        "label": "Strategic fit",
        "value": null,
        "weight": 15,
        "contribution": 0.0,
        "explanation": "No evidence yet - excluded from the score"
      }
    ],
    "missingEvidence": [
      "Link a survey and collect responses",
      "Add urgency (1-5)",
      "Add strategic fit (1-5)"
    ]
  }
};

/* status uses the real FeedbackStatus values: OPEN, PLANNED, IN_PROGRESS, COMPLETED, REJECTED */
export const DEMO_REQUESTS = [
  {
    id: "recurring",
    title: "Recurring invoices",
    description: "Let me set an invoice to repeat weekly, monthly or yearly instead of recreating it every time.",
    status: "IN_PROGRESS",
    voteCount: 34,
    endUserName: "Priya N.",
    createdAt: "2026-08-02",
    comments: [
      { name: "Daniel W.", message: "I rebuild the same retainer invoice every month. This would save me an hour." },
      { name: "Priya N.", message: "Even a simple monthly repeat would do for us." },
    ],
    evidence: { supporters: 38, surveyResponses: 22, surveyAverageRating: 4.5, daysSinceActivity: 2, urgency: 4, strategic: 5, effort: 3 },
    result: R.recurring,
    decision: { action: "PRIORITIZE", rationale: "Largest cross-segment demand and the survey backs it. Matches the plan to grow retainer customers.", roadmapItemId: "rm-recurring" },
  },
  {
    id: "xero",
    title: "Xero export",
    description: "Export paid invoices to Xero so my accountant stops asking for spreadsheets.",
    status: "PLANNED",
    voteCount: 9,
    endUserName: "Tomas R.",
    createdAt: "2026-08-19",
    comments: [{ name: "Tomas R.", message: "CSV is fine to start with." }],
    evidence: { supporters: 11, surveyResponses: 9, surveyAverageRating: 3.1, daysSinceActivity: 5, urgency: 3, strategic: 4, effort: 4 },
    result: R.xero,
    decision: { action: "PRIORITIZE", rationale: "Lower volume but strong fit with accountant-led accounts.", roadmapItemId: "rm-xero" },
  },
  {
    id: "multicurrency",
    title: "Multi-currency invoices",
    description: "Invoice international clients in their own currency and show the exchange rate used.",
    status: "OPEN",
    voteCount: 5,
    endUserName: "Lena K.",
    createdAt: "2026-09-04",
    comments: [],
    evidence: { supporters: 6, surveyResponses: 0, surveyAverageRating: null, daysSinceActivity: 3, urgency: 3, strategic: null, effort: 3 },
    result: R.multicurrency,
    decision: null,
  },
  {
    id: "mobile",
    title: "Mobile app",
    description: "Create and send invoices from my phone.",
    status: "OPEN",
    voteCount: 12,
    endUserName: "Jordan P.",
    createdAt: "2026-06-11",
    comments: [],
    evidence: { supporters: 14, surveyResponses: 0, surveyAverageRating: null, daysSinceActivity: 40, urgency: 2, strategic: 3, effort: 5 },
    result: R.mobile,
    decision: null,
  },
  {
    id: "darkmode",
    title: "Dark mode",
    description: "A dark theme for late-night invoicing.",
    status: "OPEN",
    voteCount: 8,
    endUserName: "Sam O.",
    createdAt: "2026-07-21",
    comments: [],
    evidence: { supporters: 9, surveyResponses: 0, surveyAverageRating: null, daysSinceActivity: 34, urgency: 1, strategic: 2, effort: 2 },
    result: R.darkmode,
    decision: null,
  },
  {
    id: "slack",
    title: "Slack alert when an invoice is paid",
    description: "Post to a Slack channel when a client pays.",
    status: "OPEN",
    voteCount: 1,
    endUserName: "Ines F.",
    createdAt: "2026-10-02",
    comments: [],
    evidence: { supporters: 2, surveyResponses: 0, surveyAverageRating: null, daysSinceActivity: 12, urgency: null, strategic: null, effort: 2 },
    result: R.slack,
    decision: null,
  },
  {
    id: "bulkpdf",
    title: "Bulk PDF export",
    description: "Download a month of invoices as one zip of PDFs.",
    status: "OPEN",
    voteCount: 0,
    endUserName: "Marcus D.",
    createdAt: "2026-09-24",
    comments: [],
    evidence: { supporters: 1, surveyResponses: 0, surveyAverageRating: null, daysSinceActivity: 20, urgency: null, strategic: null, effort: 1 },
    result: R.bulkpdf,
    decision: null,
  },
];

/* A pair the real duplicate scan flags (similarity >= 0.45), waiting for a human to merge or dismiss. */
export const DEMO_DUPLICATE = {
  similarity: 0.55,
  reason: "Shared terms: invoice, recurring",
  keep: { id: "recurring", title: "Recurring invoices", votes: 34 },
  duplicate: {
    id: "auto-recurring",
    title: "Automatic recurring invoices",
    description: "Set an invoice to repeat every month so I do not recreate it for the same clients.",
    votes: 5,
  },
};

/* Real RoadMapStatus values: CONSIDERING, PLANNED, IN_PROGRESS, TESTING, COMPLETE, CANCELLED */
export const DEMO_ROADMAP = [
  { id: "rm-recurring", title: "Recurring invoices", description: "Repeat an invoice weekly, monthly or yearly.", status: "IN_PROGRESS", targetDate: "2026-11-30", feedbackId: "recurring" },
  { id: "rm-xero", title: "Xero export", description: "Send paid invoices to Xero.", status: "PLANNED", targetDate: "2026-12-15", feedbackId: "xero" },
  { id: "rm-reminders", title: "Payment reminder emails", description: "Automatic reminders for overdue invoices.", status: "COMPLETE", targetDate: "2026-09-29", feedbackId: null },
  { id: "rm-multicurrency", title: "Multi-currency invoices", description: "Invoice in the client's currency.", status: "CONSIDERING", targetDate: null, feedbackId: "multicurrency" },
];

export const DEMO_SURVEY = {
  title: "Recurring invoices: how would you use it?",
  responses: 22,
  questions: [
    { question: "How important is recurring invoicing to you?", type: "RATING", average: 4.5, distribution: { 5: 12, 4: 9, 3: 1 } },
    { question: "How often do you bill the same client?", type: "SINGLE_CHOICE", distribution: { Weekly: 3, Monthly: 15, Quarterly: 3, Yearly: 1 } },
  ],
};

export const DEMO_CHANGELOG = [
  { date: "Sep 29, 2026", title: "Payment reminder emails", text: "Overdue invoices now send a polite reminder automatically." },
  { date: "Sep 12, 2026", title: "Faster invoice search", text: "Find any invoice by client, number or amount." },
];

/* A shipped request, so the board's "Completed" filter has something real to show. Not scored (closed requests are excluded from /priorities by default). */
export const DEMO_COMPLETED = {
  id: "reminders",
  title: "Payment reminder emails",
  description: "Chase overdue invoices automatically.",
  status: "COMPLETED",
  voteCount: 29,
  endUserName: "Aisha B.",
  createdAt: "2026-05-14",
  comments: [],
};

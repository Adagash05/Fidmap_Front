# FIDMAP SEO Content Map

All URLs are on the marketing domain (`https://fidmap.co`). Canonical =
`https://fidmap.co<path>` unless noted. All pages below use the shared
`<Seo>` component (`src/components/Seo.jsx`) for title/description/
canonical/OG/Twitter; JSON-LD is noted only where present.

| URL | Purpose | Primary topic | H1 | Search intent | Structured data |
|---|---|---|---|---|---|
| `/` | Homepage | Customer feedback & feature request software | (existing hero H1) | Brand, commercial | Organization, WebSite |
| `/pricing` | Pricing | FIDMAP plans (reuses `MarketingPricing`) | "Simple pricing, no surprises" | Commercial | — |
| `/about` | About | What FIDMAP is / who it's for | "Built to give customer feedback a home" | Brand | — |
| `/contact` | Contact | Support email | "Get in touch" | Brand | — |
| `/resources` | Content hub | Links to blog/product/comparison pages | "Guides & resources" | Navigational | — |
| `/customer-feedback` | Product/problem | Customer feedback management | "Customer feedback management, without the spreadsheet" | Informational/commercial | FAQPage |
| `/feature-request-management` | Product/problem | Feature request management | "Feature request management that scales past the first ten requests" | Informational/commercial | FAQPage |
| `/feedback-board` | Product/problem | Public feedback boards | "One public board, instead of a hundred private conversations" | Informational/commercial | FAQPage |
| `/alternatives` | Comparison index | Links to Canny/Frill comparisons | "FIDMAP vs. other feedback tools" | Comparison | — |
| `/alternatives/canny` | Comparison | FIDMAP vs. Canny | "FIDMAP vs. Canny" | Comparison ("Canny alternative") | — |
| `/alternatives/frill` | Comparison | FIDMAP vs. Frill | "FIDMAP vs. Frill" | Comparison ("Frill alternative") | — |
| `/blog` | Blog index | Article listing | "Feedback & roadmap guides" | Informational | — |
| `/blog/what-is-customer-feedback-management` | Article | Feedback management basics | (post title) | Informational | Article |
| `/blog/how-to-prioritize-feature-requests` | Article | Prioritization | (post title) | Informational | Article |
| `/blog/what-is-a-feedback-board` | Article | Feedback boards | (post title) | Informational | Article |
| `/blog/feature-requests-vs-feedback` | Article | Terminology | (post title) | Informational | Article |
| `/terms` | Legal | Terms of Service | "Terms of Service" | Trust | — |
| `/privacy` | Legal | Privacy Policy | "Privacy Policy" | Trust | — |
| `/refund-policy` | Legal | Refund Policy | "Refund Policy" | Trust | — |

## Noindex (reachable without auth, intentionally excluded from indexing)

`/sign-in`, `/register`, `/forgot-password`, `/reset-password` (all on
`app.fidmap.co`) — carry `<meta name="robots" content="noindex, nofollow">`
via `<Seo noIndex />`.

## Not indexed / not in sitemap (protected, requires auth — crawlers can't
reach them anyway, so no noindex meta was added)

`/dashboard`, `/boards`, `/settings`, `/roadmap`, `/changelog` (staff),
`/billing/success`, `/settings/billing` — all on `app.fidmap.co`.

## Internal linking

- Homepage footer links to all product pages, pricing, blog, resources,
  alternatives, about, contact, and legal pages.
- Each product page (`/customer-feedback`, `/feature-request-management`,
  `/feedback-board`) links to the other two.
- Blog posts link to 2 related posts each via `relatedSlugs` in
  `content/posts.js`.
- `/resources` links to blog, all product pages, and both comparison pages.
- Comparison pages link to FIDMAP's own pricing/register.

## Deliberately deferred (see final report for why)

- Only 4 of the suggested 10–15 blog posts were written.
- Only 3 of the ~12 suggested product/problem pages were built
  (`/customer-feedback`, `/feature-request-management`, `/feedback-board`).
- `/changelog` (FIDMAP's own public changelog) was not built — no real
  release history exists in this repo to populate it with, and the task
  explicitly prohibits inventing entries.
- `sitemap.xml` is static, not generated from `content/posts.js` — adding
  a blog post requires updating both files by hand.
- No per-domain `robots.txt` for `app.fidmap.co` (one static build serves
  all domains) — mitigated with per-page `noindex` meta instead.

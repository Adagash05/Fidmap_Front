/*
 * Google Analytics 4 (gtag.js), loaded manually rather than via a
 * package — this is a single <script> tag plus the standard gtag()
 * queue function, which is all GA4 actually requires; no dependency
 * needed for that.
 *
 * Loaded once, globally (main.jsx), regardless of which domain
 * (fidmap.co / app.fidmap.co / a workspace subdomain) served this
 * build — see utils/tenant.js for why one build serves all of them.
 * Conversion events (sign_up, login, workspace_created, board_created,
 * feedback_created, checkout_started, purchase) all happen on
 * app.fidmap.co, so GA has to be active there too, not just on the
 * marketing domain.
 *
 * send_page_view is set to false in the initial config below —
 * page_view is instead sent manually, once on load and once per React
 * Router navigation (see the effect in App.jsx) — this is the standard
 * way to avoid a duplicate page_view in an SPA (gtag's automatic
 * page_view on `config` would otherwise fire once for the very first
 * load, then never again on client-side navigation, while a naive
 * "just call trackPageView on every route change" would double up
 * with it on that first load).
 */
const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || "G-XTKYDZ2XYK";

let initialized = false;

export function initGA() {
  if (initialized) return;
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (!GA_MEASUREMENT_ID) return;

  // Guards against a second init call (e.g. React StrictMode's
  // double-invoke in dev, or this being called from more than one
  // place) ever injecting the script or re-running `config` twice.
  if (document.getElementById("ga4-gtag-script")) {
    initialized = true;
    return;
  }

  const script = document.createElement("script");
  script.id = "ga4-gtag-script";
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });

  initialized = true;
}

/*
 * path should be a pathname only (no query string) — several routes put
 * sensitive values in the query string (e.g. /reset-password?token=...),
 * and none of that belongs in analytics. Callers pass location.pathname,
 * never location.search.
 */
export function trackPageView(path) {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", "page_view", {
    page_path: path,
    page_location: `${window.location.origin}${path}`,
    page_title: document.title,
  });
}

/*
 * Generic event tracking. Callers are responsible for only including
 * non-sensitive parameters — no emails, tokens, passwords, or feedback
 * content. See the specific call sites (AuthContext, BoardContext,
 * Board.jsx, SettingsSubscription.jsx, MultiStepForm.jsx) for what each
 * event actually sends.
 */
export function trackEvent(name, params = {}) {
  if (typeof window === "undefined" || !window.gtag) return;

  window.gtag("event", name, params);
}

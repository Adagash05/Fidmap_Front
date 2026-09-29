// First-touch referral-code capture: `?ref=CODE` on any first-party page is
// captured once and reused for every later action in this browser
// (currently just registration — see MultiStepForm.jsx) until it's
// explicitly cleared. Nothing here touches the URL or router state; it
// only reads `window.location.search` and writes to localStorage.
//
// Partner links are built with buildReferralLink() — used by the admin
// referral-partner UI (pages/Admin/) — reusing the same VITE_ROOT_DOMAIN
// production-URL convention SettingsProfile.jsx already uses for the
// public portal link, rather than hardcoding fidmap.co. In practice the
// backend already computes and returns this per partner
// (ReferralAdminService.buildReferralLink, same formula); this is the
// client-side fallback/preview for before that value exists.

const STORAGE_KEY = "fidmap_referral_code";

// Conservative on purpose: letters, digits, dashes and underscores only,
// 2-40 chars. This value round-trips into a registration request body, so
// anything outside this shape is treated as noise, not a referral code.
const REFERRAL_CODE_PATTERN = /^[A-Za-z0-9_-]{2,40}$/;

export function isValidReferralCode(code) {
  return typeof code === "string" && REFERRAL_CODE_PATTERN.test(code);
}

export function hasReferralCode() {
  return Boolean(localStorage.getItem(STORAGE_KEY));
}

export function getReferralCode() {
  return localStorage.getItem(STORAGE_KEY);
}

export function clearReferralCode() {
  localStorage.removeItem(STORAGE_KEY);
}

// Reads `ref` from the given query string (defaults to the current page's)
// and stores it — but only the first valid code seen in this browser; an
// existing stored code is never overwritten. Safe to call on every route
// change: a no-op once a code is already stored, and a no-op when `ref`
// is missing or fails validation. Returns the code now on file, if any.
export function captureReferralCode(
  search = typeof window !== "undefined" ? window.location.search : "",
) {
  const existing = getReferralCode();
  if (existing) return existing;

  const candidate = new URLSearchParams(search).get("ref");
  if (!isValidReferralCode(candidate)) return null;

  localStorage.setItem(STORAGE_KEY, candidate);
  return candidate;
}

// Registration happens on a different origin (app.fidmap.co) from the
// marketing site — see MarketingPricing.jsx's own comment on why its
// registerUrl forwards `plan`/`interval` the same way. localStorage
// doesn't cross that origin boundary, so a stored referral code has to
// ride along on the outbound link as `?ref=CODE`; App.jsx's top-level
// capture call then picks it up again once the visitor lands on
// app.fidmap.co, into that origin's own localStorage. No-op (returns
// `url` unchanged) when there's no referral code on file, or a `ref` is
// already present on `url` (e.g. a partner link that already points
// straight at /register?ref=CODE — that explicit value wins).
export function withReferralParam(url) {
  const code = getReferralCode();
  if (!code) return url;

  const u = new URL(url, window.location.origin);
  if (!u.searchParams.has("ref")) u.searchParams.set("ref", code);
  return u.toString();
}

// The link a partner shares: https://fidmap.co/?ref=CODE in production.
// Reuses VITE_ROOT_DOMAIN (already set up for the public portal — see
// utils/tenant.js) instead of hardcoding the production domain; falls
// back to the current origin so this still renders something sensible in
// local dev, where VITE_ROOT_DOMAIN is normally left unset.
export function buildReferralLink(code) {
  const rootDomain = import.meta.env.VITE_ROOT_DOMAIN;
  const base = rootDomain ? `https://${rootDomain}` : window.location.origin;

  return `${base}/?ref=${encodeURIComponent(code)}`;
}

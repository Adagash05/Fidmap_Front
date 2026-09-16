/// Detects a workspace slug from the current hostname in production
// ({workspaceSlug}.fidmap.co), so the same public-portal routes/components
// used for local dev's /p/:workspaceSlug fallback can also work when
// visited via a real subdomain.
//
// VITE_ROOT_DOMAIN (e.g. "fidmap.co") tells this which suffix marks the
// main app vs. a workspace subdomain.

const RESERVED_SUBDOMAINS = new Set(["www", "app", "api", "admin"]);

export function getWorkspaceSlugFromHostname(
  hostname = typeof window !== "undefined" ? window.location.hostname : "",
) {
  const rootDomain = import.meta.env.VITE_ROOT_DOMAIN;

  if (!rootDomain || !hostname) return null;
  if (hostname === rootDomain) return null; // fidmap.co itself
  if (hostname === "localhost" || hostname === "127.0.0.1") return null;
  if (!hostname.endsWith(`.${rootDomain}`)) return null;

  const subdomain = hostname.slice(0, -`.${rootDomain}`.length);

  // A subdomain can itself contain dots (e.g. staging.acme.fidmap.co is
  // out of scope for now — treat the whole remaining prefix as the slug
  // only when it's a single label).
  if (!subdomain || subdomain.includes(".")) return null;
  if (RESERVED_SUBDOMAINS.has(subdomain)) return null;

  return subdomain;
}

// Detects a workspace slug from the current hostname in production
// ({workspaceSlug}.fidmap.com), so the same public-portal routes/components
// used for local dev's /p/:workspaceSlug fallback can also work when
// visited via a real subdomain — without hardcoding one workspace.
//
// VITE_ROOT_DOMAIN (e.g. "fidmap.com") tells this which suffix marks "the
// main app" vs "a workspace subdomain". Unset in local dev, where this
// always returns null and the app relies on the /p/:workspaceSlug path
// fallback instead.

const RESERVED_SUBDOMAINS = new Set(["www", "app", "api", "admin"]);

export function getWorkspaceSlugFromHostname(
  hostname = typeof window !== "undefined" ? window.location.hostname : "",
) {
  const rootDomain = import.meta.env.VITE_ROOT_DOMAIN;

  if (!rootDomain || !hostname) return null;
  if (hostname === rootDomain) return null; // fidmap.com itself
  if (hostname === "localhost" || hostname === "127.0.0.1") return null;
  if (!hostname.endsWith(`.${rootDomain}`)) return null;

  const subdomain = hostname.slice(0, -`.${rootDomain}`.length);

  // A subdomain can itself contain dots (e.g. staging.acme.fidmap.com is
  // out of scope for now — treat the whole remaining prefix as the slug
  // only when it's a single label).
  if (!subdomain || subdomain.includes(".")) return null;
  if (RESERVED_SUBDOMAINS.has(subdomain)) return null;

  return subdomain;
}

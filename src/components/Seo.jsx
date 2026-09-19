import { useEffect } from "react";

const SITE_URL = "https://fidmap.co";
const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.svg`;

/*
 * Reusable per-page SEO metadata — replaces the ad-hoc `document.title =`
 * pattern LegalPage.jsx used on its own. Every indexable public page
 * should render one of these with a unique title/description; the
 * private/app pages that are reachable without auth (sign-in, register,
 * password reset) should pass noIndex so they carry a noindex meta tag
 * even though they share the same robots.txt as the marketing site (one
 * static build is served on every domain — see utils/tenant.js — so
 * robots.txt can't differ per-domain without a Cloudflare Worker rule;
 * per-page <meta name="robots"> is the part that actually can).
 *
 * path should be the route's path starting with "/", e.g. "/pricing" —
 * used to build the canonical URL. jsonLd is an optional object (or
 * array of objects) serialized as one or more <script type="ld+json">
 * tags; only pass schemas that describe content actually visible on the
 * page (see PHASE 11's "do not add structured data for content that is
 * not visible on the page").
 */
const Seo = ({
  title,
  description,
  path = "/",
  noIndex = false,
  ogType = "website",
  ogImage = DEFAULT_OG_IMAGE,
  jsonLd = null,
}) => {
  const canonicalUrl = `${SITE_URL}${path === "/" ? "" : path}`;
  const fullTitle = title.includes("FIDMAP") ? title : `${title} | FIDMAP`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (attr, key, content) => {
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setLink = (rel, href) => {
      let el = document.head.querySelector(`link[rel="${rel}"]`);
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    setMeta("name", "description", description);
    setMeta(
      "name",
      "robots",
      noIndex ? "noindex, nofollow" : "index, follow",
    );

    setLink("canonical", canonicalUrl);

    setMeta("property", "og:title", fullTitle);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonicalUrl);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:site_name", "FIDMAP");

    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", fullTitle);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);

    // JSON-LD: remove any script this component previously added, then
    // add the current one(s), so navigating between pages never leaves a
    // stale schema behind.
    document
      .querySelectorAll('script[data-seo-jsonld="true"]')
      .forEach((el) => el.remove());

    if (jsonLd) {
      const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      schemas.forEach((schema) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.dataset.seoJsonld = "true";
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    }

    return () => {
      document
        .querySelectorAll('script[data-seo-jsonld="true"]')
        .forEach((el) => el.remove());
    };
  }, [fullTitle, description, canonicalUrl, noIndex, ogType, ogImage, jsonLd]);

  return null;
};

export default Seo;
export { SITE_URL };

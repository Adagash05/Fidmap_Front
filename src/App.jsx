import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

import Marketing from "./pages/Marketing.jsx";
import Boards from "./pages/Boards.jsx";
import StaffDashboard from "./pages/StaffDashboard.jsx";
import PublicPortal from "./pages/PublicPortal.jsx";
import PortalRoadmap from "./pages/PortalRoadmap.jsx";
import PortalChangelog from "./pages/PortalChangelog.jsx";
import Board from "./pages/Board/Board.jsx";
import RoadmapView from "./pages/Roadmap/RoadmapView.jsx";
import ChangelogView from "./pages/Changelog/ChangelogView.jsx";
import Login from "./pages/Login/Login.jsx";
import MultiStepForm from "./pages/Register/MultiStepForm.jsx";
import Settings from "./pages/Settings/Settings.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import PartnerProtectedRoute from "./PartnerProtectedRoute.jsx";
import ReferralPartners from "./pages/Admin/ReferralPartners.jsx";
import PartnerSignIn from "./pages/Partner/PartnerSignIn.jsx";
import AcceptInvitation from "./pages/Partner/AcceptInvitation.jsx";
import PartnerDashboard from "./pages/Partner/PartnerDashboard.jsx";
import { getWorkspaceSlugFromHostname } from "./utils/tenant.js";
import ForgotPassword from "./pages/Login/ForgotPassword.jsx";
import ResetPassword from "./pages/Login/ResetPassword.jsx";
import TermsOfService from "./pages/Legal/TermsOfService.jsx";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy.jsx";
import RefundPolicy from "./pages/Legal/RefundPolicy.jsx";
import NotFound from "./pages/NotFound.jsx";
import Pricing from "./pages/Pricing.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Resources from "./pages/Resources.jsx";
import CustomerFeedback from "./pages/Product/CustomerFeedback.jsx";
import FeatureRequestManagement from "./pages/Product/FeatureRequestManagement.jsx";
import FeedbackBoard from "./pages/Product/FeedbackBoard.jsx";
import Alternatives from "./pages/Alternatives/Alternatives.jsx";
import CannyAlternative from "./pages/Alternatives/CannyAlternative.jsx";
import FrillAlternative from "./pages/Alternatives/FrillAlternative.jsx";
import Blog from "./pages/Blog/Blog.jsx";
import BlogPost from "./pages/Blog/BlogPost.jsx";
import { initGA, trackPageView } from "./utils/analytics.js";
import { captureReferralCode } from "./utils/referral.js";

/*
 * Routing.
 *
 * MAIN DOMAIN (fidmap.co):
 *   /            marketing landing page — no board/workspace/feedback data
 *   /sign-in     staff login
 *   /register    staff + workspace registration
 *   /dashboard   staff overview        — protected
 *   /boards      staff board mgmt      — protected (was "/" before Marketing existed)
 *   /roadmap     staff roadmap mgmt    — protected
 *   /changelog   staff changelog mgmt  — protected
 *   /settings    staff settings        — protected
 *   /admin/referrals   FIDMAP's own referral-partner management — protected,
 *      then gated inline to role SUPER_ADMIN (see ReferralPartners.jsx)
 *   /partner/sign-in, /partner/accept-invitation   public (a partner is a
 *      staff User with role PARTNER — no separate auth system)
 *   /partner/dashboard   partner's own referral stats — protected via
 *      PartnerProtectedRoute (role PARTNER, not just isStaff)
 *   /billing/success, /settings/billing   the two URLs the backend's
 *      Polar checkout session is hardcoded to send the browser back to
 *      (BillingService: successUrl/returnUrl) — both just redirect into
 *      /settings, which already exists                — protected
 *   /board/:boardId   public feedback experience for one board (no auth)
 *   /terms, /privacy, /refund-policy   public legal pages (no auth)
 *   /pricing, /about, /contact, /resources, /customer-feedback,
 *   /feature-request-management, /feedback-board, /alternatives(/canny|
 *   /frill), /blog, /blog/:slug   public SEO/content pages (no auth,
 *   marketing domain only)
 *   *  (catch-all, all three trees) — 404 page
 *
 * PUBLIC WORKSPACE PORTAL — {workspaceSlug}.fidmap.co in production
 * (VITE_ROOT_DOMAIN configured), /p/:workspaceSlug as the dev/local
 * fallback (see utils/tenant.js):
 *   /                boards list
 *   /roadmap         read-only, scoped to that workspace
 *   /changelog       read-only, scoped to that workspace
 *
 * When a workspace subdomain is detected, the ENTIRE app renders the
 * portal routes at "/" instead of marketing/staff — a public visitor on
 * acme.fidmap.co never sees fidmap.co's marketing page or /sign-in
 * unless they click "Staff sign in" in the header.
 */
export default function App() {
  const hostname = window.location.hostname;
  const subdomainSlug = getWorkspaceSlugFromHostname();
  const isAppDomain = hostname === "app.fidmap.co";
  const location = useLocation();

  // GA4 — loaded exactly once regardless of which of the three route
  // trees below actually renders (initGA() no-ops on any call after the
  // first). Page views are sent manually on every route change,
  // including the first, with send_page_view:false set in initGA() so
  // gtag's own automatic page_view never fires alongside this one — see
  // utils/analytics.js for why. Only pathname is sent, never the query
  // string, since some routes (e.g. /reset-password?token=...) carry
  // sensitive values there.
  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  // Referral capture (?ref=CODE) — first-touch, see utils/referral.js.
  // Deliberately NOT a useEffect: Marketing.jsx's CTAs and
  // MarketingPricing.jsx's registerUrl both read the stored code
  // (withReferralParam()) while THIS SAME render builds their href, to
  // forward it onto the app.fidmap.co registration link — a real
  // cross-origin navigation that localStorage can't otherwise cross (see
  // MarketingPricing.jsx's own comment on why plan/interval work the same
  // way). An effect would run one render too late for a link built during
  // this render to see it. Calling it here instead means every render
  // (including the very first paint) already reflects capture — cheap and
  // idempotent (a no-op past the first successful capture), so re-running
  // it on every render, including a location change, is harmless.
  captureReferralCode();

  // Workspace subdomain
  if (subdomainSlug) {
    return (
      <Routes>
        <Route
          path="/"
          element={<Navigate to={`/p/${subdomainSlug}`} replace />}
        />
        <Route path="/board/:boardId" element={<Board />} />
        <Route path="/p/:workspaceSlug" element={<PublicPortal />} />
        <Route path="/p/:workspaceSlug/roadmap" element={<PortalRoadmap />} />
        <Route
          path="/p/:workspaceSlug/changelog"
          element={<PortalChangelog />}
        />
        <Route path="/sign-in" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  // app.fidmap.co
  if (isAppDomain) {
    return (
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/sign-in" element={<Login />} />
        <Route path="/register" element={<MultiStepForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Referral/partner system — see docs/backend-api-requirements.md
            for the verified contract this is built against. A partner is
            a plain staff User (role PARTNER), so sign-in reuses /sign-in's
            own auth; these routes are public the same way /sign-in is. */}
        <Route path="/partner/sign-in" element={<PartnerSignIn />} />
        <Route
          path="/partner/accept-invitation"
          element={<AcceptInvitation />}
        />
        <Route element={<PartnerProtectedRoute />}>
          <Route path="/partner/dashboard" element={<PartnerDashboard />} />
          <Route path="/partner/profile" element={<PartnerDashboard />} />
        </Route>

        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<StaffDashboard />} />
          <Route path="/boards" element={<Boards />} />
          {/* PUBLIC INDIVIDUAL BOARD */}
          <Route path="/board/:boardId" element={<Board />} />
          <Route path="/roadmap" element={<RoadmapView />} />
          <Route path="/changelog" element={<ChangelogView />} />
          <Route path="/settings" element={<Settings />} />
          {/* SUPER_ADMIN-gated inline (see ReferralPartners.jsx) — same
              pattern Settings.jsx uses for its own isOwner-only tab,
              rather than a second route-guard component. */}
          <Route path="/admin/referrals" element={<ReferralPartners />} />
          {/* Backend-hardcoded Polar checkout return URLs (BillingService
              successUrl/returnUrl) — neither is a real page, both just
              land back on Settings, which re-fetches subscription state
              itself. */}
          <Route
            path="/billing/success"
            element={<Navigate to="/settings" replace />}
          />
          <Route
            path="/settings/billing"
            element={<Navigate to="/settings" replace />}
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    );
  }

  // fidmap.co
  // fidmap.co — MARKETING DOMAIN
  return (
    <Routes>
      <Route path="/" element={<Marketing />} />

      {/* SEO / content pages */}
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/customer-feedback" element={<CustomerFeedback />} />
      <Route
        path="/feature-request-management"
        element={<FeatureRequestManagement />}
      />
      <Route path="/feedback-board" element={<FeedbackBoard />} />
      <Route path="/alternatives" element={<Alternatives />} />
      <Route path="/alternatives/canny" element={<CannyAlternative />} />
      <Route path="/alternatives/frill" element={<FrillAlternative />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />

      {/* Public workspace */}
      <Route path="/p/:workspaceSlug" element={<PublicPortal />} />
      <Route path="/p/:workspaceSlug/roadmap" element={<PortalRoadmap />} />
      <Route path="/p/:workspaceSlug/changelog" element={<PortalChangelog />} />

      {/* Public board */}
      <Route path="/board/:boardId" element={<Board />} />

      {/* Legal pages */}
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

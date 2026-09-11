import { Routes, Route, Navigate } from "react-router-dom";

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
import { getWorkspaceSlugFromHostname } from "./utils/tenant.js";
import ForgotPassword from "./pages/Login/ForgotPassword.jsx";
import ResetPassword from "./pages/Login/ResetPassword.jsx";
import TermsOfService from "./pages/Legal/TermsOfService.jsx";
import PrivacyPolicy from "./pages/Legal/PrivacyPolicy.jsx";
import RefundPolicy from "./pages/Legal/RefundPolicy.jsx";

/*
 * Routing.
 *
 * MAIN DOMAIN (fidmap.com):
 *   /            marketing landing page — no board/workspace/feedback data
 *   /sign-in     staff login
 *   /register    staff + workspace registration
 *   /dashboard   staff overview        — protected
 *   /boards      staff board mgmt      — protected (was "/" before Marketing existed)
 *   /roadmap     staff roadmap mgmt    — protected
 *   /changelog   staff changelog mgmt  — protected
 *   /settings    staff settings        — protected
 *   /board/:boardId   public feedback experience for one board (no auth)
 *   /terms, /privacy, /refund-policy   public legal pages (no auth)
 *
 * PUBLIC WORKSPACE PORTAL — {workspaceSlug}.fidmap.com in production
 * (VITE_ROOT_DOMAIN configured), /p/:workspaceSlug as the dev/local
 * fallback (see utils/tenant.js):
 *   /                boards list
 *   /roadmap         read-only, scoped to that workspace
 *   /changelog       read-only, scoped to that workspace
 *
 * When a workspace subdomain is detected, the ENTIRE app renders the
 * portal routes at "/" instead of marketing/staff — a public visitor on
 * acme.fidmap.com never sees fidmap.com's marketing page or /sign-in
 * unless they click "Staff sign in" in the header.
 */
export default function App() {
  const hostname = window.location.hostname;
  const subdomainSlug = getWorkspaceSlugFromHostname();
  const isAppDomain = hostname === "app.fidmap.co";

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

        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<StaffDashboard />} />
          <Route path="/boards" element={<Boards />} />
          <Route path="/roadmap" element={<RoadmapView />} />
          <Route path="/changelog" element={<ChangelogView />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    );
  }

  // fidmap.co
  return (
    <Routes>
      <Route path="/" element={<Marketing />} />

      <Route path="/p/:workspaceSlug" element={<PublicPortal />} />
      <Route path="/p/:workspaceSlug/roadmap" element={<PortalRoadmap />} />
      <Route path="/p/:workspaceSlug/changelog" element={<PortalChangelog />} />

      <Route path="/board/:boardId" element={<Board />} />

      <Route path="/sign-in" element={<Login />} />
      <Route path="/register" element={<MultiStepForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/refund-policy" element={<RefundPolicy />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<StaffDashboard />} />
        <Route path="/boards" element={<Boards />} />
        <Route path="/roadmap" element={<RoadmapView />} />
        <Route path="/changelog" element={<ChangelogView />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

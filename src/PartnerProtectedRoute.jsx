import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

/*
 * Guards /partner/dashboard. Verified against the real backend
 * (com.amsal.fidmap.referral.* + SecurityConfig, uploaded 2026-09-27):
 * partners are plain `User` rows with role Role.PARTNER, authenticated
 * through the exact same JWT as staff — SecurityConfig gates
 * /api/partner/referrals/** with hasRole("PARTNER"), and
 * PartnerDashboardController reads (User) authentication.getPrincipal(),
 * same as every other endpoint. So this reuses useAuth() directly rather
 * than a second auth system — there is no separate partner token.
 *
 * A signed-in non-partner staff user is sent to their own /dashboard
 * rather than /partner/sign-in — they're legitimately authenticated, just
 * in the wrong area.
 */
const PartnerProtectedRoute = () => {
  const location = useLocation();
  const { isStaff, isChecking, currentUser } = useAuth();

  if (isChecking) {
    return <div className="fm-loading">Checking your session…</div>;
  }

  if (!isStaff) {
    return (
      <Navigate to="/partner/sign-in" replace state={{ from: location }} />
    );
  }

  if (currentUser?.role !== "PARTNER") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PartnerProtectedRoute;

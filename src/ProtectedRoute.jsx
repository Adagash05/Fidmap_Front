import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

/*
 * Guards staff-only routes. AuthContext verifies the stored token against
 * the backend on load (GET /feedback/user/me), not just Boolean(token), so
 * while that check is in flight we show a neutral loading state instead of
 * bouncing a real staff user to /sign-in on refresh.
 */
const ProtectedRoute = () => {
  const location = useLocation();
  const { isStaff, isChecking } = useAuth();

  if (isChecking) {
    return <div className="fm-loading">Checking your session…</div>;
  }

  if (!isStaff) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

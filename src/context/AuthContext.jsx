import { createContext, useCallback, useEffect, useState } from "react";
import {
  auth as authApi,
  users as usersApi,
  getToken,
  setToken as persistToken,
} from "../components/Api";

const AuthContext = createContext(null);

/*
 * The one source of truth for staff authentication. Owns the token,
 * verifies it against the backend (GET /feedback/user/me) rather than
 * trusting Boolean(localStorage.getItem(...)) alone, and exposes
 * login/register/logout. Every other component (Header, ProtectedRoute,
 * Board, Settings, BoardContext) reads staff state from here via useAuth()
 * instead of independently reading the token.
 */
export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => getToken());
  const [currentUser, setCurrentUser] = useState(null);
  // "checking" while we verify a stored token on first load, so ProtectedRoute
  // doesn't bounce a real staff user to /login for one frame on refresh.
  const [status, setStatus] = useState(() =>
    getToken() ? "checking" : "signed-out",
  );

  const restore = useCallback(async () => {
    const existing = getToken();

    if (!existing) {
      setCurrentUser(null);
      setStatus("signed-out");
      return;
    }

    setStatus("checking");

    try {
      const user = await usersApi.me();
      setCurrentUser(user);
      setStatus("signed-in");
    } catch {
      // Token is invalid/expired — the backend rejected it.
      persistToken(null);
      setTokenState(null);
      setCurrentUser(null);
      setStatus("signed-out");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(() => {
      if (!cancelled) restore();
    });

    return () => {
      cancelled = true;
    };
  }, [restore]);

  const login = async (email, password) => {
    const result = await authApi.logIn(email, password);

    console.log("LOGIN RESPONSE:", result);

    const accessToken = result?.accessToken ?? null;

    console.log("ACCESS TOKEN:", accessToken);

    persistToken(accessToken);
    setTokenState(accessToken);

    console.log("TOKEN FROM STORAGE:", localStorage.getItem("accessToken"));

    await restore();

    return result;
  };

  /*
   * Registers the first staff user + workspace, then signs them in.
   * `data` shape: { firstUser: { fullName, email, password }, dto: { name } }
   * Response is a UserDto: { id, fullName, email, accessToken, refreshToken, workspaceId }
   * — camelCase, unlike /auth/log-in's snake_case access_token.
   */
  const register = async (data) => {
    const result = await authApi.register(data);
    const accessToken = result?.accessToken ?? null;

    persistToken(accessToken);
    setTokenState(accessToken);

    await restore();

    return result;
  };

  const logout = () => {
    persistToken(null);
    setTokenState(null);
    setCurrentUser(null);
    setStatus("signed-out");
  };

  const isStaff = status === "signed-in";
  const isChecking = status === "checking";

  return (
    <AuthContext.Provider
      value={{
        token,
        currentUser,
        isStaff,
        isChecking,
        login,
        register,
        logout,
        refreshUser: restore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

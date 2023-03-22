import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  handleAuthChanged,
  handleGoogleLogin,
  handleLogout,
} from "../../lib/auth";

const defState = {
  user: null,
  status: "INITIAL",
  error: null,
  login: async () => {},
  logout: async () => {},
};

const AuthContext = createContext(defState);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(defState.user);
  const [status, setStatus] = useState(defState.status);
  const [error, setError] = useState(defState.error);

  useEffect(() => {
    const unsubscribe = handleAuthChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setStatus("AUTHORIZED");
      } else {
        setUser(null);
        setStatus("UNAUTHORIZED");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // login to auth
  const login = async () => {
    try {
      setStatus("LOADING");
      const response = await handleGoogleLogin();
      setUser(response);
      setStatus("AUTHORIZED");
      return response;
    } catch (err) {
      setStatus("UNAUTHORIZED");
      setError(err);
    }
  };

  // logout from auth
  const logout = async () => {
    try {
      setStatus("LOADING");
      const response = await handleLogout();
      setStatus("UNAUTHORIZED");
      return response;
    } catch (err) {
      setStatus("UNAUTHORIZED");
      setError(err);
    }
  };

  // memorized value
  const value = useMemo(
    () => ({
      user,
      status,
      error,
      login,
      logout,
    }),
    [user, status, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

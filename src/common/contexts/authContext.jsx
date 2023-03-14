import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import app from "../../firebase";
import { logOut, signInWith } from "../../lib/auth";

// firebase auth
const auth = getAuth(app);

// auth context
const AuthContext = createContext();

// use auth context
export const useAuth = () => useContext(AuthContext);

// use auth context provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("INITIAL"); // INITIAL, AUTHORIZED, UNAUTHORIZED, LOADING
  const [error, setError] = useState(null);

  // handle user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setStatus("AUTHORIZED");
        setUser(currentUser);
      } else {
        setStatus("UNAUTHORIZED");
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // handle sign in
  const handleSignInWith = (provider) => async () => {
    try {
      setStatus("LOADING");
      const response = await signInWith(provider);
      // set user
      setUser(response);
      setStatus("AUTHORIZED");
      return response;
    } catch (err) {
      setStatus("UNAUTHORIZED");
      setError(err);
      return err;
    }
  };

  // handle Google Sign In
  const handleGoogleSignIn = handleSignInWith("google");
  // handle Facebook Sign In
  const handleFacebookSignIn = handleSignInWith("facebook");
  // handle Github Sign In
  const handleGithubSignIn = handleSignInWith("github");

  // handle log out
  const handleLogOut = async () => {
    try {
      const response = await logOut();
      setStatus("UNAUTHORIZED");
      setUser(null);
      return response;
    } catch (err) {
      setStatus("UNAUTHORIZED");
      setError(err);
      return err;
    }
  };

  const value = useMemo(
    () => ({
      user,
      status,
      error,
      handleGoogleSignIn,
      handleFacebookSignIn,
      handleGithubSignIn,
      handleLogOut,
    }),
    [user, status, error]
  );

  return (
    <>
      <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    </>
  );
};

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase";

self.addEventListener("fetch", (e) => {
  console.log(e);
});

// auth context
const AuthContext = createContext();

// use auth context
export const useAuth = () => useContext(AuthContext);

// use auth context provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(undefined);
  const [status, setStatus] = useState("INITIAL"); // INITIAL, AUTHORIZED, UNAUTHORIZED, LOADING
  const [error, setError] = useState(null);

  // handle user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        setStatus("AUTHORIZED");
      } else {
        setStatus("UNAUTHORIZED");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  console.log(user);

  // handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      setStatus("LOADING");
      const provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, provider);
      return response;
    } catch (err) {
      setStatus("UNAUTHORIZED");
      setError(err);
      return err;
    }
  };
  // handle Facebook Sign In
  const handleFacebookSignIn = () => {};
  // handle Github Sign In
  const handleGithubSignIn = () => {};

  // handle log out
  const handleLogOut = async () => {
    try {
      const response = await signOut(auth);
      return response;
    } catch (error) {
      console.log(error);
      return { error };
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

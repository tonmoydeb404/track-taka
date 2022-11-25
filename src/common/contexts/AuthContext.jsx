import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import app from "../../firebase";

// firebase auth
const auth = getAuth(app);

// auth context
const AuthContext = createContext();

// use auth context
export const useAuth = () => useContext(AuthContext);

// use auth context provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // handle user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // handle sign in
  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
    }
  };

  // handle log out
  const handleLogOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.log(error);
    }
  };

  const value = useMemo(
    () => ({
      user,
      handleSignIn,
      handleLogOut,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

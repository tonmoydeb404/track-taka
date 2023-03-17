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
      console.log({ currentUser });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  console.log({ user });

  // handle sign in
  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, provider);
      return response;
    } catch (error) {
      console.log(error);
      return { error };
    }
  };

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
      handleSignIn,
      handleLogOut,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

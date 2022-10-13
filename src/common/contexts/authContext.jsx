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

const authContext = createContext();

// use auth context
export const useAuthContext = () => useContext(authContext);

// use auth context provider
export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  //   console.log(user);

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
      signOut(auth);
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

  return <authContext.Provider value={value}>{children}</authContext.Provider>;
};

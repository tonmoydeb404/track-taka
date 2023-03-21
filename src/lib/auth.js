import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

export const handleGoogleLogin = async () =>
  new Promise(async (resolve, reject) => {
    try {
      const provider = new GoogleAuthProvider();
      const response = await signInWithPopup(auth, provider);

      resolve(response.user);
    } catch (error) {
      reject(error);
    }
  });

export const handleLogout = async () =>
  new Promise(async (resolve, reject) => {
    try {
      await signOut(auth);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });

export const handleAuthChanged = (callback = () => {}) =>
  onAuthStateChanged(auth, (user) => callback(user));

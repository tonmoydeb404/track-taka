import {
  FacebookAuthProvider,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import app from "../firebase";

const auth = getAuth(app);
const providers = {
  google: GoogleAuthProvider,
  facebook: FacebookAuthProvider,
  github: GithubAuthProvider,
};

// sign with third party providers google
export const signInWith = (provider) =>
  new Promise(async (resolve, reject) => {
    if (!provider || !providers[provider])
      throw Error("valid auth provider is required");
    // select auth provider
    const authProvider = new providers[provider]();

    try {
      const result = await signInWithPopup(auth, authProvider);

      resolve(result.user);
    } catch (error) {
      reject(error);
    }
  });

// sign out
export const logOut = () =>
  new Promise(async (resolve, reject) => {
    try {
      await signOut(auth);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });

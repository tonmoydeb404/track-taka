import {
  getAdditionalUserInfo,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import app from "../firebase";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// perform new user tasks
const newUserTask = async (user) => {
  try {
    // update profile
    const photoURL = `https://api.dicebear.com/5.x/thumbs/svg?seed=${user.uid}`;
    await updateProfile(user, { photoURL });
  } catch (error) {
    console.log(error);
  }
};

// sign with google
export const signInWithGoogle = () =>
  new Promise(async (resolve, reject) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser;
      // if user is new then perform new user task
      if (isNewUser) await newUserTask(result.user);

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

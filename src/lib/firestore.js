import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";

// create a single document
export const createDocument = (collectionName, documentId, data) =>
  new Promise(async (resolve, reject) => {
    try {
      // document reference
      const docRef = doc(firestore, collectionName, documentId);
      await setDoc(docRef, data);
      resolve(true);
    } catch (error) {
      return reject(error);
    }
  });

// get a single document
export const getDocument = (collectionName, documentId) =>
  new Promise(async (resolve, reject) => {
    try {
      // document reference
      const docRef = doc(firestore, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) resolve({});
      const data = docSnap.data();
      resolve(data);
    } catch (error) {
      return reject(error);
    }
  });

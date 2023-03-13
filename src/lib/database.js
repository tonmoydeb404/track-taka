import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";

// create a single document
export const createDocument = (collectionName, documentId, data) =>
  new Promise(async (resolve, reject) => {
    try {
      // document reference
      const docRef = doc(db, ...collectionName, documentId);
      await setDoc(docRef, data);
      resolve(true);
    } catch (error) {
      return reject(error);
    }
  });

// read collection data in realtime
export const readCollectionRealtime =
  (collectionName, orders) =>
  (callback = (data) => {}) => {
    // sort data
    const ordersBy =
      orders && orders instanceof Array && orders.length
        ? orders.map((order) => orderBy(order[0], order[1] || "asc"))
        : [];
    // collection reference
    const collectionRef = collection(db, ...collectionName);
    const unsubscribe = onSnapshot(
      query(collectionRef, ...ordersBy),
      (snapshot) => {
        let data = [];
        data = snapshot.docs.map((docRef) => docRef.data());

        callback(data);
      }
    );

    return unsubscribe;
  };

// update any single document
export const updateDocument = (collectionName, documentId, updates) =>
  new Promise(async (resolve, reject) => {
    try {
      if (!Object.keys(updates).length) throw Error("updates not provided");
      const docRef = doc(db, ...collectionName, documentId);
      await updateDoc(docRef, updates);

      resolve(updates);
    } catch (error) {
      return reject(error);
    }
  });

// delete a single document
export const deleteDocument = (collectionName, documentId) =>
  new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, ...collectionName, documentId);
      await deleteDoc(docRef);

      resolve(true);
    } catch (error) {
      reject(error);
    }
  });

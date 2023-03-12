import { collection, onSnapshot, orderBy } from "firebase/firestore";

// create a single document
export const createDocument = (collectionName, documentId, data) =>
  new Promise(async (resolve, reject) => {
    try {
      // document reference
      const docRef = doc(db, collectionName, documentId);
      await setDoc(docRef, data);
      resolve(true);
    } catch (error) {
      const errorMsg = error.code || error.message || "something went wrong";
      return reject(errorMsg);
    }
  });

// read collection data in realtime
export const readCollectionRealtime = (collectionName, orders, callback) => {
  // sort data
  const ordersBy = orders.map((order) => orderBy(order[0], order[1] || "asc"));
  // collection reference
  const collectionRef = collection(db, collectionName);
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
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, updates);

      // get updated data
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) throw Error("document not found");

      const data = snapshot.data();
      resolve(data);
    } catch (error) {
      const errorMsg = error.code || error.message || "something went wrong";
      return reject(errorMsg);
    }
  });

// delete a single document
export const deleteDocument = (collectionName, documentId) =>
  new Promise(async (resolve, reject) => {
    try {
      const docRef = doc(db, collectionName, documentId);
      await deleteDoc(docRef);

      resolve(true);
    } catch (error) {
      const errorMsg = error.code || error.message || "something went wrong";
      return reject(errorMsg);
    }
  });

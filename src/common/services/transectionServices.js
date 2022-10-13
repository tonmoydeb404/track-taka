import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import "../../firebase";
import { arrayToObj, objToArray } from "../../utilities/objArraySwap";

// database
const db = getFirestore();

export const fetchTransections = async ({ uid = null }) => {
  if (!uid) return { error: "uid is null" };

  // document ref
  const docRef = doc(db, `users`, uid);

  try {
    const snapshot = await getDoc(docRef);
    const data = snapshot.data();

    return data == undefined ? {} : data;
  } catch (error) {
    console.log(error);
  }
};

export const setTransections = async ({ data = {}, uid = null }) => {
  if (!uid) return { error: "uid is null" };
  if (!data || !Object.keys(data).length) return { error: "data is empty" };

  // document ref
  const docRef = doc(db, `users`, uid);

  try {
    await setDoc(docRef, data);
  } catch (error) {
    console.log(error);
  }
};

export const downloadTransections = async ({
  uid = null,
  updateState = () => {},
}) => {
  // fetch data from firebase
  const state = await toast.promise(fetchTransections({ uid }), {
    loading: "downloading data from server...",
    error: "error when downloading data",
    success: "successfully downloaded data from server",
  });

  // convert data to array
  const stateArr = await objToArray(state);
  // update app state
  await updateState(stateArr);
};

export const uploadTransections = async ({ uid = null, data = [] }) => {
  // convert app sate array to object
  const objState = await arrayToObj(data, "id");

  // send app data to firebase
  const sendTransections = setTransections({
    data: objState,
    uid,
  });
  // toast message
  await toast.promise(sendTransections, {
    loading: "uploading data to the server...",
    error: "error when uploading data",
    success: "successfully data uploaded",
  });
};

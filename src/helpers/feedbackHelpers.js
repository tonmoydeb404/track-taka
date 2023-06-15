import { addDoc } from "firebase/firestore";
import { feedbacksCollection } from "../firebase";

export const createFeedback = async (feedback = {}) =>
  new Promise(async (resolve, reject) => {
    try {
      const data = {
        ...feedback,
        createdAt: Date.now(),
        updatedAt: null,
      };
      const response = await addDoc(feedbacksCollection, {
        ...data,
      });
      resolve(response);
    } catch (error) {
      return reject(error);
    }
  });

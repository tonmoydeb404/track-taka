import { createContext, useContext, useMemo } from "react";
import firestoreConfig from "../../config/firestore.config";
import indexedDBConfig from "../../config/indexedDB.config";
import categories from "../../data/categories.json";
import { createDocument, getDocument } from "../../lib/firestore";
import { arrayToObj } from "../../utilities/objArraySwap";
import useIndexedDB from "../hooks/useIndexedDB";
import { useAuth } from "./authContext";

// transection context
export const TransectionContext = createContext({
  transections: [],
  createTransection: async () => {},
  updateTransection: async () => {},
  deleteTransection: async () => {},
  importTransections: async () => {},
  exportTransections: async () => {},
  clearTransections: async () => {},
});

// use transection values
export const useTransection = () => useContext(TransectionContext);

// transection context provider
export const TransectionProvider = ({ children }) => {
  const { user } = useAuth();
  // transection state
  const {
    data: transections,
    deleteData: deleteTransection,
    deleteMultipleData: deleteTransections,
    createData: createTransection,
    updateData: updateTransection,
    insertData: insertTransections,
    clearData: clearTransections,
  } = useIndexedDB(
    indexedDBConfig.NAME,
    indexedDBConfig.VERSION,
    indexedDBConfig.STORE,
    indexedDBConfig.KEY_PATH,
    indexedDBConfig.OLD_STORE
  );

  const importTransections = async (authUser) =>
    new Promise(async (resolve, reject) => {
      try {
        const myUser = authUser || user;
        if (!myUser) throw Error("unauthorized request");
        // get data from server
        const response = await getDocument(
          firestoreConfig.collection,
          myUser.uid
        );
        if (!response) resolve({ message: "nothing to import" });
        const responseArr = Object.values(response);
        // filter the valid data
        const filteredResponse = responseArr
          .filter((item) => {
            const isExist = transections.findIndex((t) => t.id === item.id);
            const hasAllProperties =
              item?.id &&
              item?.title &&
              item?.date &&
              ["income", "expense"].includes(item?.type) &&
              item?.amount &&
              item?.category &&
              item?.createdAt;
            return isExist < 0 && hasAllProperties;
          })
          .map((item) => {
            const transection = item;
            // change invalid categories value
            transection.category = categories?.[transection.category]
              ? transection.category
              : "others";

            // change old invalid date value
            if (isNaN(Date.parse(transection.date))) {
              transection.date = transections.createdAt;
            } else if (typeof transections.date !== "number") {
              const date = new Date(transection.date);
              const createdAt = new Date(transection.createdAt);

              date.setHours(createdAt.getHours());
              date.setMinutes(createdAt.getMinutes());
              date.setSeconds(createdAt.getSeconds());
              date.setMilliseconds(createdAt.getMilliseconds());

              transection.date = date;
            }

            return transection;
          });
        // insert data to the local database
        await insertTransections(filteredResponse);
        resolve({ message: "successfully imported transections" });
      } catch (error) {
        reject({ message: error.message });
      }
    });

  const exportTransections = async (authUser) =>
    new Promise(async (resolve, reject) => {
      try {
        const myUser = authUser || user;
        if (!myUser) throw Error("unauthorized request");
        if (!transections.length) throw Error("nothing to export");

        const transectionsObj = arrayToObj(transections, "id");
        const response = await createDocument(
          firestoreConfig.collection,
          myUser.uid,
          transectionsObj
        );
        resolve({ message: "successfully exported transections" });
      } catch (error) {
        resolve({ message: error.message });
      }
    });

  // context value with memorization
  const value = useMemo(
    () => ({
      // main transection
      transections,
      createTransection,
      updateTransection,
      deleteTransection,
      deleteTransections,
      exportTransections,
      importTransections,
      clearTransections,
    }),
    [transections, user]
  );

  return (
    <TransectionContext.Provider value={value}>
      {children}
    </TransectionContext.Provider>
  );
};

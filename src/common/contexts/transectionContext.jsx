import { createContext, useContext, useMemo } from "react";
import dbConfig from "../../config/db.config";
import useIndexedDB from "../hooks/useIndexedDB";
import { useAuth } from "./authContext";

// transection context
export const TransectionContext = createContext({
  transections: [],
  createTransection: async () => {},
  updateTransection: async () => {},
  deleteTransection: async () => {},
  downloadTransection: async () => {},
  uploadTransection: async () => {},
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
  } = useIndexedDB(
    dbConfig.NAME,
    dbConfig.VERSION,
    dbConfig.STORE,
    dbConfig.KEY_PATH,
    dbConfig.OLD_STORE
  );

  const downloadTransection = async () => {
    try {
      if (!user) throw Error("unauthorized request");

      return { message: "successfully downloaded transections" };
    } catch (error) {
      return { message: error.message };
    }
  };

  const uploadTransection = async () => {
    try {
      if (!user) throw Error("unauthorized request");

      return { message: "successfully uploaded transections" };
    } catch (error) {
      return { message: error.message };
    }
  };

  // context value with memorization
  const value = useMemo(
    () => ({
      // main transection
      transections,
      createTransection,
      updateTransection,
      deleteTransection,
      deleteTransections,
      uploadTransection,
      downloadTransection,
    }),
    [transections]
  );

  return (
    <TransectionContext.Provider value={value}>
      {children}
    </TransectionContext.Provider>
  );
};

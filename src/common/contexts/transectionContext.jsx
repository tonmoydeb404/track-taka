import { createContext, useContext, useMemo } from "react";
import dbConfig from "../../config/db.config";
import useIndexedDB from "../hooks/useIndexedDB";

// transection context
export const TransectionContext = createContext({
  transections: [],
  createTransection: async () => {},
  updateTransection: async () => {},
  deleteTransection: async () => {},
});

// use transection values
export const useTransection = () => useContext(TransectionContext);

// transection context provider
export const TransectionProvider = ({ children }) => {
  // transection state
  const {
    data: transections,
    deleteData: deleteTransection,
    deleteMultipleData: deleteTransections,
    createData: createTransection,
    updateData: updateTransection,
  } = useIndexedDB(
    dbConfig.NAME,
    dbConfig.VERSION,
    dbConfig.STORE,
    dbConfig.KEY_PATH,
    dbConfig.OLD_STORE
  );

  // context value with memorization
  const value = useMemo(
    () => ({
      // main transection
      transections,
      createTransection,
      updateTransection,
      deleteTransection,
      deleteTransections,
    }),
    [transections]
  );

  return (
    <TransectionContext.Provider value={value}>
      {children}
    </TransectionContext.Provider>
  );
};

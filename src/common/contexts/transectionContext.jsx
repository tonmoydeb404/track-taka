import { createContext, useContext, useMemo } from "react";
import config from "../../data/config.json";
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
    loading: transectionsLoading,
    error: transectionsError,
    createData: createTransection,
    updateData: updateTransection,
  } = useIndexedDB(
    config.DB_NAME,
    config.DB_VERSION,
    config.DB_STORE,
    config.DB_KEY_PATH,
    config.DB_OLD_STORE
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
      transectionsLoading,
      transectionsError,
    }),
    [transections, transectionsLoading, transectionsError]
  );

  return (
    <TransectionContext.Provider value={value}>
      {children}
    </TransectionContext.Provider>
  );
};

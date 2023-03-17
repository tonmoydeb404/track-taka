import { createContext, useContext, useMemo } from "react";
import useTransections from "../hooks/useTransections";

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
    transections,
    createTransection,
    updateTransection,
    deleteTransection,
  } = useTransections();

  // context value with memorization
  const value = useMemo(
    () => ({
      // main transection
      transections,
      createTransection,
      updateTransection,
      deleteTransection,
    }),
    [transections]
  );

  return (
    <TransectionContext.Provider value={value}>
      {children}
    </TransectionContext.Provider>
  );
};

import { createContext, useContext, useMemo } from "react";
import useUserTransections from "../hooks/useUserTransections";
import { useAuth } from "./authContext";

// transection context
export const TransectionContext = createContext({
  transections: [],
  transectionLoading: true,
  createTransection: async () => {},
  updateTransection: async () => {},
  deleteTransection: async () => {},
});

// use transection values
export const useTransection = () => useContext(TransectionContext);

// transection context provider
export const TransectionProvider = ({ children }) => {
  // auth contexts
  const { user } = useAuth();
  // transection state
  const {
    userTransections,
    createTransection,
    updateTransection,
    deleteTransection,
    transectionLoading,
  } = useUserTransections(user?.uid);

  // context value with memorization
  const value = useMemo(
    () => ({
      // main transection
      transections: userTransections,
      transectionLoading,
      createTransection,
      updateTransection,
      deleteTransection,
    }),
    [userTransections, transectionLoading]
  );

  return (
    <TransectionContext.Provider value={value}>
      {children}
    </TransectionContext.Provider>
  );
};

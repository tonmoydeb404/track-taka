import { createContext, useContext, useMemo, useState } from "react";
import useUserTransections from "../hooks/useUserTransections";
import { useAuth } from "./AuthContext";

// transection context
export const TransectionContext = createContext({
  transections: [],
  transectionLoading: true,
  createTransection: () => {},
  updateTransection: () => {},
  deleteTransection: () => {},
  transectionTime: Date.now(),
  setTransectionTime: () => {},
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
  // transection time state
  const [transectionTime, setTransectionTime] = useState(Date.now());

  // monthly transections
  const transections = useMemo(() => {
    // when transection time is disabled
    if (transectionTime === null) return userTransections;

    // when user transections is or empty or invalid
    if (!userTransections || !userTransections?.length) return [];

    // filter by transection time
    const transectionDate = new Date(transectionTime);
    return userTransections.filter((t) => {
      const tDate = new Date(t.date);
      return (
        tDate.getMonth() === transectionDate.getMonth() &&
        tDate.getFullYear() === transectionDate.getFullYear()
      );
    });
  }, [transectionTime, userTransections]);

  // context value with memorization
  const value = useMemo(
    () => ({
      // main transection
      transections,
      allTransections: userTransections,
      transectionLoading,
      createTransection,
      updateTransection,
      deleteTransection,
      // transection time
      transectionTime,
      setTransectionTime,
    }),
    [userTransections, transectionTime, transections, transectionLoading]
  );

  return (
    <TransectionContext.Provider value={value}>
      {children}
    </TransectionContext.Provider>
  );
};

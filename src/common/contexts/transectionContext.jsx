import { createContext, useContext, useMemo, useReducer } from "react";
import {
  transectionInitState,
  transectionReducer,
  transectionTypes,
} from "../reducers/transectionReducer";

const transectionContext = createContext();

// use transection context
export const useTransectionContext = () => useContext(transectionContext);

// provide transection context
export const TransectionContextProvier = ({ children }) => {
  const [state, dispatch] = useReducer(
    transectionReducer,
    transectionInitState
  );

  const value = useMemo(
    () => ({
      state,
      handleDelete: (id) =>
        dispatch({ type: transectionTypes.DELETE, payload: { id } }),
      handleCreate: (data) =>
        dispatch({ type: transectionTypes.CREATE, payload: { ...data } }),
      handleEdit: (data) =>
        dispatch({ type: transectionTypes.EDIT, payload: { ...data } }),
      handleInsert: (data) =>
        dispatch({ type: transectionTypes.INSERT, payload: { data } }),
    }),
    [state]
  );

  return (
    <transectionContext.Provider value={value}>
      {children}
    </transectionContext.Provider>
  );
};

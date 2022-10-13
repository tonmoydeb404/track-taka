import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { localStorageKey } from "../../data/constant.json";
import {
  transectionReducer,
  transectionTypes,
} from "../reducers/transectionReducer";

const transectionContext = createContext();

// use transection context
export const useTransectionContext = () => useContext(transectionContext);

// provide transection context
export const TransectionContextProvier = ({ children }) => {
  const [state, dispatch] = useReducer(transectionReducer, []);

  // get data from localstorage
  useEffect(() => {
    const localstate = localStorage.getItem(localStorageKey);
    if (localstate != null) {
      dispatch({
        type: transectionTypes.INSERT,
        payload: { data: JSON.parse(localstate) },
      });
    }
  }, []);

  // save data to localstorage
  useEffect(() => {
    if (state && state.length) {
      try {
        localStorage.setItem(localStorageKey, JSON.stringify(state));
      } catch (error) {
        console.log(error);
      }
    }
  }, [state]);

  // memorize the value
  const value = useMemo(
    () => ({
      state: state || [],
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

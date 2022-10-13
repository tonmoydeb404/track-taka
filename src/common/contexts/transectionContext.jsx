import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { localStorageTransectionsKey } from "../../data/constant.json";
import {
  transectionReducer,
  transectionTypes,
} from "../reducers/transectionReducer";
import { useGlobalContext } from "./globalContext";

const transectionContext = createContext();

// use transection context
export const useTransectionContext = () => useContext(transectionContext);

// provide transection context
export const TransectionContextProvier = ({ children }) => {
  const { monthFilter } = useGlobalContext();
  const [state, dispatch] = useReducer(transectionReducer, []);

  // get data from localstorage
  useEffect(() => {
    const localstate = localStorage.getItem(localStorageTransectionsKey);
    if (localstate != null) {
      dispatch({
        type: transectionTypes.INSERT,
        payload: { data: JSON.parse(localstate) },
      });
    }
  }, []);

  // save data to localstorage
  useEffect(() => {
    try {
      localStorage.setItem(localStorageTransectionsKey, JSON.stringify(state));
    } catch (error) {
      console.log(error);
    }
  }, [state]);

  // filter state by month
  const filteredState = useMemo(() => {
    return monthFilter.enable
      ? state.filter((item) => {
          const itemDate = new Date(item.date);
          const selectedDate = new Date(monthFilter.value);

          return (
            itemDate.getMonth() == selectedDate.getMonth() &&
            itemDate.getFullYear() == itemDate.getFullYear()
          );
        })
      : state;
  }, [state, monthFilter.enable, monthFilter.value]);

  // memorize the value
  const value = useMemo(
    () => ({
      state: state || [],
      filteredState: filteredState,
      handleDelete: (id) =>
        dispatch({ type: transectionTypes.DELETE, payload: { id } }),
      handleCreate: (data) =>
        dispatch({ type: transectionTypes.CREATE, payload: { ...data } }),
      handleEdit: (data) =>
        dispatch({ type: transectionTypes.EDIT, payload: { ...data } }),
      handleInsert: (data) =>
        dispatch({ type: transectionTypes.INSERT, payload: { data } }),
    }),
    [state, filteredState]
  );

  return (
    <transectionContext.Provider value={value}>
      {children}
    </transectionContext.Provider>
  );
};

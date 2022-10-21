import { LOCAL_TRANSECTION_KEY } from "../../../data/constant";
import { useGlobal } from "../GlobalContext";
import { initialState, reducers } from "./reducers";
import {
  CLEAR_TRANSECTION,
  CREATE_TRANSECTION,
  DELETE_TRANSECTION,
  INSERT_CATEGORIES,
  INSERT_TRANSECTION,
  UPDATE_TRANSECTION,
} from "./types";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

// transection context
export const TransectionContext = createContext({});

// use transection values
export const useTransection = () => useContext(TransectionContext);

// transection context provider
export const TransectionProvider = ({ children }) => {
  const { monthFilter } = useGlobal();
  // transection states
  const [state, dispatch] = useReducer(reducers, initialState);

  // transection actions
  const createTransection = (transection = {}) =>
    dispatch({ type: CREATE_TRANSECTION, payload: { ...transection } });
  const deleteTransection = (idList = []) =>
    dispatch({ type: DELETE_TRANSECTION, payload: { idList } });
  const updateTransection = (transection = {}) =>
    dispatch({ type: UPDATE_TRANSECTION, payload: { ...transection } });
  const insertTransection = (newData = []) =>
    dispatch({
      type: INSERT_TRANSECTION,
      payload: { newData },
    });
  const clearTransection = () => dispatch({ type: CLEAR_TRANSECTION });
  // category actions
  const createCategory = (category) =>
    dispatch({ type: CREATE_TRANSECTION, payload: { category } });
  const insertCategories = (categories = []) =>
    dispatch({ type: INSERT_CATEGORIES, payload: { categories } });

  // get transections data from localstorage
  useEffect(() => {
    const localstate = localStorage.getItem(LOCAL_TRANSECTION_KEY);
    if (localstate != null) {
      insertTransection(JSON.parse(localstate));
    }
  }, []);

  // save transections data to localstorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_TRANSECTION_KEY, JSON.stringify(state.data));
    } catch (error) {
      console.log(error);
    }
  }, [state.data]);

  // filter transection data by month
  const filteredTransections = useMemo(() => {
    return monthFilter.enable
      ? state.data.filter((item) => {
          const itemDate = new Date(item.date);
          const selectedDate = new Date(monthFilter.value);

          return (
            itemDate.getMonth() == selectedDate.getMonth() &&
            itemDate.getFullYear() == itemDate.getFullYear()
          );
        })
      : state.data;
  }, [state.data, monthFilter.enable, monthFilter.value]);

  // context value with memorization
  const value = useMemo(
    () => ({
      transections: state.data,
      categories: state.categories,
      filteredTransections,
      createTransection,
      deleteTransection,
      updateTransection,
      insertTransection,
      clearTransection,
      createCategory,
      insertCategories,
    }),
    [state, filteredTransections]
  );

  return (
    <TransectionContext.Provider value={value}>
      {children}
    </TransectionContext.Provider>
  );
};

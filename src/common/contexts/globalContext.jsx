import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
} from "react";
import { localStorageThemeKey } from "../../data/constant.json";
import {
  globalActions,
  globalReducer,
  globalValues,
} from "../reducers/globalReducer";

// global context
const globalContext = createContext();

// use global context
export const useGlobalContext = () => useContext(globalContext);

// global context provider
export const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, globalValues);

  // get theme from localstorage
  useLayoutEffect(() => {
    const localTheme = localStorage.getItem(localStorageThemeKey);
    if (localTheme != null) {
      dispatch({
        type: globalActions.SET_THEME,
        payload: { theme: localTheme },
      });
    }
  }, []);

  // handle theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme == "dark");
    localStorage.setItem(localStorageThemeKey, state.theme);
  }, [state.theme]);

  // handle sidebar
  useEffect(() => {
    document.body.dataset.sidebar = state.sidebar;
  }, [state.sidebar]);

  const value = useMemo(
    () => ({
      ...state,
      toggleSidebar: () => dispatch({ type: globalActions.TOGGLE_SIDEBAR }),
      toggleTheme: () => dispatch({ type: globalActions.TOGGLE_THEME }),
      setMonthFilter: (month) =>
        dispatch({ type: globalActions.SET_MONTH_FILTER, payload: { month } }),
      toggleMonthFilter: () =>
        dispatch({ type: globalActions.TOGGLE_MONTH_FILTER }),
    }),
    [state]
  );

  return (
    <globalContext.Provider value={value}>{children}</globalContext.Provider>
  );
};

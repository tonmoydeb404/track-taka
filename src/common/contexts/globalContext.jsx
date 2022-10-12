import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  globalReducer,
  globalValues,
  TOGGLE_SIDEBAR,
  TOGGLE_THEME,
} from "../reducers/globalReducer";

// global context
const globalContext = createContext();

// use global context
export const useGlobalContext = () => useContext(globalContext);

// global context provider
export const GlobalContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, globalValues);

  // handle theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.darkTheme);
  }, [state.darkTheme]);

  // handle sidebar
  useEffect(() => {
    document.body.dataset.sidebar = state.sidebar;
  }, [state.sidebar]);

  const value = useMemo(
    () => ({
      ...state,
      toggleSidebar: () => dispatch({ type: TOGGLE_SIDEBAR }),
      toggleTheme: () => dispatch({ type: TOGGLE_THEME }),
    }),
    [state]
  );

  return (
    <globalContext.Provider value={value}>{children}</globalContext.Provider>
  );
};

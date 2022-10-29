import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
} from "react";
import { LOCAL_AUTOBACKUP_KEY, LOCAL_THEME_KEY } from "../../../data/constant";
import { initialState, reducers } from "./reducers";
import {
  SET_AUTOBACKUP,
  SET_AUTOBACKUP_DURATION,
  SET_AUTOBACKUP_LAST_TIME,
  SET_MONTH_FILTER,
  SET_ONLINE,
  SET_SIDEBAR,
  SET_THEME,
  TOGGLE_MONTH_FILTER,
  TOGGLE_SIDEBAR,
  TOGGLE_THEME,
} from "./types";

// global context
export const GlobalContext = createContext({});

// use global context
export const useGlobal = () => useContext(GlobalContext);

// global context provider
export const GlobalProvider = ({ children }) => {
  // state
  const [state, dispatch] = useReducer(reducers, initialState);

  // context online
  const setOnline = (isOnline) =>
    dispatch({ type: SET_ONLINE, payload: { isOnline } });
  // context sidebar actions
  const toggleSidebar = () => dispatch({ type: TOGGLE_SIDEBAR });
  const setSidebar = (sidebar) =>
    dispatch({ type: SET_SIDEBAR, payload: { sidebar } });
  // context theme actions
  const toggleTheme = () => dispatch({ type: TOGGLE_THEME });
  const setTheme = (theme) => dispatch({ type: SET_THEME, payload: { theme } });
  // context month filter actions
  const setMonthFilter = (month) =>
    dispatch({ type: SET_MONTH_FILTER, payload: { month } });
  const toggleMonthFilter = () => dispatch({ type: TOGGLE_MONTH_FILTER });
  // context autobackup actions
  const setAutoBackup = (autoBackup) =>
    dispatch({
      type: SET_AUTOBACKUP,
      payload: { autoBackup },
    });
  const setAutoBackupDuration = (duration) =>
    dispatch({
      type: SET_AUTOBACKUP_DURATION,
      payload: { duration },
    });
  const setAutoBackupLastTime = (lastTime) =>
    dispatch({
      type: SET_AUTOBACKUP_LAST_TIME,
      payload: { lastTime },
    });

  // handle online
  useEffect(() => {
    if ("onLine" in navigator) {
      setOnline(navigator.onLine);
    }

    window.addEventListener("offline", () => setOnline(false));
    window.addEventListener("online", () => setOnline(true));
  }, []);

  // get DATA from localstorage
  useLayoutEffect(() => {
    // theme
    const localTheme = localStorage.getItem(LOCAL_THEME_KEY);
    if (localTheme != null) {
      setTheme(localTheme);
    }

    // auto backup duration
    const localAutoBackupDuration = localStorage.getItem(LOCAL_AUTOBACKUP_KEY);
    if (localAutoBackupDuration != null) {
      setAutoBackupDuration(JSON.parse(localAutoBackupDuration));
    }
  }, []);

  // handle theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.theme == "dark");
    localStorage.setItem(LOCAL_THEME_KEY, state.theme);
  }, [state.theme]);

  // handle auto backup duration
  useEffect(() => {
    localStorage.setItem(LOCAL_AUTOBACKUP_KEY, state.autoBackup.duration);
  }, [state.autoBackup.duration]);

  // handle sidebar
  useEffect(() => {
    document.body.dataset.sidebar = state.sidebar;
  }, [state.sidebar]);

  const value = useMemo(
    () => ({
      ...state,
      setOnline,
      setSidebar,
      toggleSidebar,
      toggleTheme,
      setTheme,
      setMonthFilter,
      toggleMonthFilter,
      setAutoBackup,
      setAutoBackupDuration,
      setAutoBackupLastTime,
    }),
    [state]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

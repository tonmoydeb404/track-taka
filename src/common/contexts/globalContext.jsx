import { createContext, useContext, useMemo } from "react";
import siteConfig from "../../config/site.config";
import useOnline from "../hooks/useOnline";
import useSidebar from "../hooks/useSidebar";

export const GlobalContext = createContext({
  sidebar: siteConfig.defaultSidebar,
  toggleSidebar: () => {},
  showSidebar: () => {},
  hideSidebar: () => {},
  isOnline: true,
});

// use global context
export const useGlobal = () => useContext(GlobalContext);

// global context provider
export const GlobalProvider = ({ children }) => {
  // sidebar states
  const { sidebar, toggleSidebar, showSidebar, hideSidebar } = useSidebar(
    siteConfig.defaultSidebar
  );
  // user online sates
  const { isOnline } = useOnline();

  // memorize value for context
  const value = useMemo(
    () => ({
      sidebar,
      toggleSidebar,
      showSidebar,
      hideSidebar,
      isOnline,
    }),
    [sidebar, isOnline]
  );

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};

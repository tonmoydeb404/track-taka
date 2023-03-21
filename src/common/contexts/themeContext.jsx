import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import siteConfig from "../../config/site.config";

const ThemeContext = createContext({
  theme: siteConfig.defaultTheme,
  toggleTheme: () => {},
});

// use theme values
export const useTheme = () => useContext(ThemeContext);

// theme provider
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(siteConfig.defaultTheme);

  // get theme from localstorage
  useLayoutEffect(() => {
    // theme
    const localTheme = localStorage.getItem(siteConfig.themeKey);
    if (localTheme != null && ["light", "dark"].includes(localTheme)) {
      setTheme(localTheme);
    }
  }, []);

  // update layout and localstorage on theme change
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme == "dark");
    localStorage.setItem(siteConfig.themeKey, theme);
  }, [theme]);

  // toggle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // memorizing context value
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

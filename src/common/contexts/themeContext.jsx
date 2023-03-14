import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import config from "../../data/config.json";

const themeContext = createContext({
  theme: config.defaultTheme,
  toggleTheme: () => {},
});

// use theme values
export const useTheme = () => useContext(themeContext);

// theme provider
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(config.defaultTheme);

  // get theme from localstorage
  useLayoutEffect(() => {
    // theme
    const localTheme = localStorage.getItem(config.themeKey);
    if (localTheme != null && ["light", "dark"].includes(localTheme)) {
      setTheme(localTheme);
    }
  }, []);

  // update layout and localstorage on theme change
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme == "dark");
    localStorage.setItem(config.themeKey, theme);
  }, [theme]);

  // toggle theme
  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // memorizing context value
  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <themeContext.Provider value={value}>{children}</themeContext.Provider>
  );
};

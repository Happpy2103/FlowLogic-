import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";

const ThemeContext = createContext(null);
const STORAGE_KEY = "flowlogic-theme";

function getInitialMode() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode);
  const isDark = mode === "dark";

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((current) => (current === "light" ? "dark" : "light"));
  };

  const antdConfig = useMemo(
    () => ({
      algorithm: isDark
        ? antdTheme.darkAlgorithm
        : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: isDark ? "#e8e8e8" : "#141414",
        borderRadius: 8,
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      },
      components: {
        Button: {
          primaryColor: isDark ? "#141414" : "#ffffff",
        },
        Layout: {
          bodyBg: isDark ? "#0a0a0a" : "#ffffff",
          headerBg: isDark ? "#0a0a0a" : "#ffffff",
          siderBg: isDark ? "#0a0a0a" : "#ffffff",
        },
        Card: {
          colorBgContainer: isDark ? "#141414" : "#ffffff",
        },
      },
    }),
    [isDark]
  );

  const value = useMemo(
    () => ({ mode, isDark, setMode, toggleTheme }),
    [mode, isDark]
  );

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider theme={antdConfig}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}

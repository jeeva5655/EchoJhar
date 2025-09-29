import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  isDark: boolean;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyThemeClass(next: Theme) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const shouldDark = next === "dark" || (next === "system" && prefersDark);
  root.classList.toggle("dark", shouldDark);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    const saved = localStorage.getItem("theme") as Theme | null;
    return saved ?? "system";
  });

  useEffect(() => {
    applyThemeClass(theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  // Sync with system theme changes when in "system"
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      const saved = (localStorage.getItem("theme") as Theme | null) ?? "system";
      if (saved === "system") applyThemeClass("system");
    };
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    isDark:
      theme === "dark" ||
      (theme === "system" && typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches === true),
    setTheme: (t) => setThemeState(t),
    toggleTheme: () => setThemeState((prev) => (prev === "dark" ? "light" : "dark")),
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

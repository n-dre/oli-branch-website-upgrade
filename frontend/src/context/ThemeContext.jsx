/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

export const ThemeContext = createContext(null);

const STORAGE_KEY = "oliBranchTheme";

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(mode) {
  if (typeof window === "undefined") return;
  
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  
  const applied = mode === "system" ? getSystemTheme() : mode;
  root.classList.add(applied);
  root.setAttribute("data-theme", applied);
}

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "dark" || saved === "light" || saved === "system") return saved;
    return "light";
  });

  const currentTheme = useMemo(() => {
    return themeMode === "system" ? getSystemTheme() : themeMode;
  }, [themeMode]);

  useEffect(() => {
    applyTheme(themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    applyTheme(themeMode);
    localStorage.setItem(STORAGE_KEY, themeMode);
  }, [themeMode]);

  useEffect(() => {
    if (typeof window === "undefined" || themeMode !== "system") return;

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handler = (e) => {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      const newTheme = e.matches ? "dark" : "light";
      root.classList.add(newTheme);
      root.setAttribute("data-theme", newTheme);
    };

    if (mq.addEventListener) {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } else {
      mq.addListener(handler);
      return () => mq.removeListener(handler);
    }
  }, [themeMode]);

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const cycleThemeMode = useCallback(() => {
    setThemeMode((prev) => {
      if (prev === "light") return "dark";
      if (prev === "dark") return "system";
      return "light";
    });
  }, []);

  const value = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      currentTheme,
      theme: currentTheme,
      setTheme: setThemeMode,
      toggleTheme,
      cycleThemeMode,
    }),
    [themeMode, currentTheme, toggleTheme, cycleThemeMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
import { DataProvider } from "./context/DataContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

/* -------------------------------------------------
   ⚡ Immediately apply the correct theme to <html>
   BEFORE React renders anything
--------------------------------------------------- */
(function initTheme() {
  if (typeof window === "undefined") return;

  const STORAGE_KEY = "oliBranchTheme";
  const saved = localStorage.getItem(STORAGE_KEY);
  const themeMode = (saved === "dark" || saved === "light" || saved === "system") ? saved : "light";

  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const applied = themeMode === "system" ? getSystemTheme() : themeMode;

  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(applied);
  root.setAttribute("data-theme", applied);
})();

/* -------------------------------------------------
   Mount React App
--------------------------------------------------- */
const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container (#root) not found in index.html");
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <DataProvider>
          <App />
        </DataProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);

import React, { createContext, useContext, useState, useEffect } from "react";
import { readPref, writePref } from "./storage.js";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
  glassMode: true,
  toggleGlassMode: () => {},
  setGlassMode: () => {},
});

export function ThemeProvider({ children }) {
  // The product is dark-only. Light mode was removed rather than patched:
  // hundreds of high-specificity overrides made it unreliable, and the
  // forensic surfaces were designed against the dark palette.
  const [glassMode, setGlassMode] = useState(() => {
    return readPref("chakravyuh_glass_mode") !== "false";
  });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.add("dark");
    root.classList.remove("light");
    body?.classList.add("dark");
    body?.classList.remove("light");
    root.setAttribute("data-theme", "dark");
    // Clear any light preference left in storage from an earlier visit.
    if (readPref("chakravyuh_theme") !== "dark") writePref("chakravyuh_theme", "dark");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (glassMode) {
      root.classList.add("glass-mode-active");
      body?.classList.add("glass-mode-active");
    } else {
      root.classList.remove("glass-mode-active");
      body?.classList.remove("glass-mode-active");
    }
    writePref("chakravyuh_glass_mode", glassMode);
  }, [glassMode]);

  const noop = () => {};

  return (
    <ThemeContext.Provider
      value={{
        theme: "dark",
        toggleTheme: noop,
        setTheme: noop,
        glassMode,
        toggleGlassMode: () => setGlassMode((prev) => !prev),
        setGlassMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

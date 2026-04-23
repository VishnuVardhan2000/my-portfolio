"use client";
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext({
  accent: "168,85,247",
  setAccent: () => {},
});

export function ThemeProvider({ children }) {
  const [accent, setAccent] = useState("168,85,247"); // default purple
  return (
    <ThemeContext.Provider value={{ accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
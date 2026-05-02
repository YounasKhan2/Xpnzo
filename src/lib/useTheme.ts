import { useEffect, useState } from "react";

const STORAGE_KEY = "xpnzo-theme";

// Apply theme eagerly (before React renders) to prevent flash
const getInitialTheme = (): boolean => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const isDark = stored !== null
    ? stored === "dark"
    : window.matchMedia("(prefers-color-scheme: dark)").matches;

  // Apply immediately so the class is set before any component mounts
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  return isDark;
};

/** Returns [isDark, toggle] — persists choice to localStorage and sets html.dark class */
export function useTheme(): [boolean, (v: boolean) => void] {
  const [isDark, setIsDark] = useState<boolean>(getInitialTheme);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  return [isDark, setIsDark];
}

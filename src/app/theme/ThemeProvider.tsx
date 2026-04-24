import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ThemeContext, type ThemeMode, type ThemeContextValue } from "./ThemeContext";

const STORAGE_KEY = "rentease-theme";

function getSystemPrefersDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? false;
}

function readStoredMode(): ThemeMode | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "light" || raw === "dark" || raw === "system") return raw;
    return null;
  } catch {
    return null;
  }
}

function writeStoredMode(mode: ThemeMode) {
  try {
    localStorage.setItem(STORAGE_KEY, mode);
  } catch (err) {
    console.warn("Failed to save theme preference:", err);
  }
}

function resolveMode(mode: ThemeMode): "light" | "dark" {
  if (mode === "system") return getSystemPrefersDark() ? "dark" : "light";
  return mode;
}

function applyThemeToDocument(resolved: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setModeState] = useState<ThemeMode>(
    () => readStoredMode() ?? "system",
  );

  // Derive resolvedMode during render to avoid cascading renders
  const resolvedMode = useMemo(() => resolveMode(mode), [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    writeStoredMode(next);
  }, []);

  const toggle = useCallback(() => {
    setMode(resolvedMode === "dark" ? "light" : "dark");
  }, [resolvedMode, setMode]);

  useEffect(() => {
    applyThemeToDocument(resolvedMode);
  }, [resolvedMode]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");

    const handler = () => {
      if (mode === "system") {
        applyThemeToDocument(resolveMode("system"));
      }
    };

    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      setMode,
      toggle,
      resolvedMode,
    }),
    [mode, setMode, toggle, resolvedMode],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

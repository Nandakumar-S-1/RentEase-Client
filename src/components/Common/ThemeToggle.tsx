import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../app/theme/ThemeProvider";

type Props = {
  className?: string;
};

export const ThemeToggle: React.FC<Props> = ({ className }) => {
  const { resolvedMode, toggle } = useTheme();
  const isDark = resolvedMode === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={
        className ??
        "p-2 rounded-lg transition-colors text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/10"
      }
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};


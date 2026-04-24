import React, { type MouseEvent } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../app/theme/ThemeContext";

type Props = {
  className?: string;
};

export const ThemeToggle: React.FC<Props> = ({ className }) => {
  const { resolvedMode, toggle } = useTheme();
  const isDark = resolvedMode === "dark";

  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    if (!document.startViewTransition) {
      toggle();
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      toggle();
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={
        className ??
        "p-2 rounded-xl transition-all duration-300 transform active:scale-95 text-slate-500 hover:text-primary hover:bg-primary/10 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10"
      }
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

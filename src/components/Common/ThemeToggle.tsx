import React, { type MouseEvent } from "react";
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
      Math.max(y, innerHeight - y),
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
        },
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
        "relative w-20 h-10 rounded-full cursor-pointer overflow-hidden transition-all duration-500 ease-in-out select-none active:scale-95 transform border border-slate-300/20 shadow-[inset_0_3px_6px_rgba(0,0,0,0.3),_0_1px_1px_rgba(255,255,255,0.1)] dark:shadow-[inset_0_3px_6px_rgba(0,0,0,0.5),_0_1px_1px_rgba(255,255,255,0.05)] bg-[#4ca5ff]"
      }
    >
      {/* Light Mode Sky & Rays */}
      <div
        className={`absolute inset-0 bg-gradient-to-b from-[#4ca5ff] via-[#75beff] to-[#b1dcff] transition-opacity duration-500 ease-in-out ${
          isDark ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Soft Diagonal Sun Rays */}
        <div className="absolute top-[-5px] left-[25px] w-[5px] h-[50px] bg-white/15 rounded-full transform -rotate-[35deg]" />
        <div className="absolute top-[-10px] left-[45px] w-[9px] h-[60px] bg-white/15 rounded-full transform -rotate-[35deg]" />
        <div className="absolute top-[-5px] left-[63px] w-[4px] h-[50px] bg-white/15 rounded-full transform -rotate-[35deg]" />
      </div>

      {/* Dark Mode Sky & Concentric Bands */}
      <div
        className={`absolute inset-0 bg-[#060913] transition-opacity duration-500 ease-in-out ${
          isDark ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Concentric bands centered at the moon's position on the right (x=60, y=20) */}
        {/* Band 1 (Outer) */}
        <div
          className={`absolute left-[0px] top-[-40px] w-[120px] h-[120px] rounded-full bg-[#0f1522] transition-all duration-500 ease-out ${
            isDark
              ? "scale-100 translate-x-0 opacity-100"
              : "scale-75 translate-x-4 opacity-0"
          }`}
        />
        {/* Band 2 (Middle) */}
        <div
          className={`absolute left-[15px] top-[-25px] w-[90px] h-[90px] rounded-full bg-[#161e2e] transition-all duration-500 ease-out ${
            isDark
              ? "scale-100 translate-x-0 opacity-100"
              : "scale-75 translate-x-4 opacity-0"
          }`}
        />
        {/* Band 3 (Inner) */}
        <div
          className={`absolute left-[30px] top-[-10px] w-[60px] h-[60px] rounded-full bg-[#2b3553] transition-all duration-500 ease-out ${
            isDark
              ? "scale-100 translate-x-0 opacity-100"
              : "scale-75 translate-x-4 opacity-0"
          }`}
        />

        {/* Twinkling Stars */}
        {/* Sparkle Star 1 */}
        <svg
          viewBox="0 0 24 24"
          className="absolute top-[8px] left-[20px] w-2.5 h-2.5 text-white fill-current animate-pulse [animation-duration:2.5s]"
        >
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        {/* Sparkle Star 2 */}
        <svg
          viewBox="0 0 24 24"
          className="absolute bottom-[9px] left-[11px] w-2 h-2 text-white fill-current animate-pulse [animation-duration:1.8s] [animation-delay:0.4s]"
        >
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        {/* Sparkle Star 3 */}
        <svg
          viewBox="0 0 24 24"
          className="absolute top-[18px] left-[32px] w-1.5 h-1.5 text-white fill-current animate-pulse [animation-duration:2.2s] [animation-delay:0.8s]"
        >
          <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
        </svg>
        {/* Tiny Dot Stars */}
        <div className="absolute top-[12px] left-[10px] w-0.5 h-0.5 bg-white rounded-full opacity-60" />
        <div className="absolute bottom-[13px] left-[25px] w-0.5 h-0.5 bg-white rounded-full opacity-80" />
        <div className="absolute top-[26px] left-[18px] w-[1px] h-[1px] bg-white rounded-full opacity-40 animate-ping" />
      </div>

      {/* Back Layer of Clouds */}
      <div
        className={`absolute inset-0 transition-all duration-500 ease-in-out ${
          isDark
            ? "opacity-0 translate-y-6 scale-95"
            : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        <div className="absolute bottom-[-15px] right-[-4px] w-14 h-14 rounded-full bg-[#e0f2fe]/40 backdrop-blur-[0.5px]" />
        <div className="absolute bottom-[-10px] right-[24px] w-10 h-10 rounded-full bg-[#e0f2fe]/40 backdrop-blur-[0.5px]" />
      </div>

      {/* Middle Layer of Clouds */}
      <div
        className={`absolute inset-0 transition-all duration-500 ease-in-out delay-75 ${
          isDark
            ? "opacity-0 translate-y-6 scale-90"
            : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        <div className="absolute bottom-[-12px] right-[-8px] w-12 h-12 rounded-full bg-white/60" />
        <div className="absolute bottom-[-10px] right-[16px] w-10 h-10 rounded-full bg-white/60" />
      </div>

      {/* Switch Knob (Sun / Moon) */}
      <div
        className={`absolute top-[4px] left-[4px] w-8 h-8 rounded-full transition-all duration-500 ease-in-out transform shadow-[0_4px_6px_rgba(0,0,0,0.15)] ${
          isDark
            ? "translate-x-[40px] bg-gradient-to-b from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1] shadow-[0_0_12px_rgba(255,255,255,0.35),inset_0_-2.5px_4px_rgba(0,0,0,0.25),inset_0_2.5px_4px_rgba(255,255,255,0.7)] border border-slate-300/40"
            : "translate-x-0 bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] shadow-[0_0_12px_rgba(251,191,36,0.6),inset_0_-2px_4px_rgba(0,0,0,0.25),inset_0_2px_4px_rgba(255,255,255,0.5)] border border-amber-500/30"
        }`}
      >
        {/* Moon Craters (visible only in dark mode) */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            isDark ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Crater 1 (Large - bottom left) */}
          <div className="absolute bottom-[5px] left-[6px] w-[10px] h-[10px] bg-[#94a3b8] rounded-full shadow-[inset_1.5px_1.5px_2px_rgba(0,0,0,0.25)]" />
          {/* Crater 2 (Medium - top right) */}
          <div className="absolute top-[6px] right-[6px] w-[7px] h-[7px] bg-[#94a3b8] rounded-full shadow-[inset_1px_1px_1.5px_rgba(0,0,0,0.25)]" />
          {/* Crater 3 (Small - bottom right) */}
          <div className="absolute bottom-[9px] right-[6px] w-[4.5px] h-[4.5px] bg-[#94a3b8] rounded-full shadow-[inset_0.5px_0.5px_1px_rgba(0,0,0,0.25)]" />
        </div>
      </div>

      {/* Front Layer of Clouds (rendered after the knob to overlap it slightly in light mode) */}
      <div
        className={`absolute inset-0 transition-all duration-500 ease-in-out delay-150 pointer-events-none ${
          isDark
            ? "opacity-0 translate-y-6 scale-75"
            : "opacity-100 translate-y-0 scale-100"
        }`}
      >
        <div className="absolute bottom-[-10px] right-[-10px] w-10 h-10 rounded-full bg-white shadow-sm" />
        <div className="absolute bottom-[-8px] right-[10px] w-10 h-10 rounded-full bg-white shadow-sm" />
        <div className="absolute bottom-[-8px] right-[28px] w-8 h-8 rounded-full bg-white shadow-sm" />
      </div>
    </button>
  );
};

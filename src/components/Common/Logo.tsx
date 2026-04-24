import React from "react";
import type { LogoProps } from "../../types/common/LogoProps";

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showText = true,
  className = "",
}) => {
  const sizes = {
    sm: { container: "h-8", icon: "24", text: "text-lg" },
    md: { container: "h-10", icon: "32", text: "text-2xl" },
    lg: { container: "h-14", icon: "44", text: "text-4xl" },
  };

  return (
    <div className={`flex items-center gap-3 group cursor-pointer ${className}`}>
      <div className={`relative flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${sizes[size].container} text-primary`}>
        <svg
          width={sizes[size].icon}
          height={sizes[size].icon}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 14L16 3L28 14V26C28 27.1046 27.1046 28 26 28H6C4.89543 28 4 27.1046 4 26V14Z"
            fill="currentColor"
            fillOpacity="0.15"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 14L16 2L30 14"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
                    <g className="door-animation">

            <rect x="12" y="16" width="8" height="12" rx="1" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <rect 
              x="12" y="16" width="8" height="12" rx="1" 
              fill="currentColor" 
              className="origin-left transition-transform duration-700 ease-in-out group-hover:[transform:rotateY(-110deg)]"
              style={{
                perspective: "100px",
                transformOrigin: "left",
                animation: "door-cycle 6s infinite ease-in-out"
              }}
            />

            <circle cx="18.5" cy="22" r="0.5" fill="white" className="group-hover:opacity-0 transition-opacity" />
          </g>

          <style>{`
            @keyframes door-cycle {
              0%, 10%, 90%, 100% { transform: rotateY(0deg); }
              40%, 60% { transform: rotateY(-110deg); }
            }
          `}</style>
        </svg>
      </div>

      {showText && (
        <span className={`font-black tracking-tighter text-foreground ${sizes[size].text}`}>
          Rent<span className="text-primary">Ease</span>
        </span>
      )}
    </div>
  );
};

export default Logo;

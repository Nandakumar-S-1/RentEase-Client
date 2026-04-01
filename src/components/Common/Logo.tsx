import { Home } from "lucide-react";
import type { LogoProps } from "../../types/common/LogoProps";

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showText = true,
  className = "",
}) => {
  const sizes = {
    sm: { icon: "h-8 w-8", text: "text-lg" },
    md: { icon: "h-10 w-10", text: "text-xl" },
    lg: { icon: "h-12 w-12", text: "text-2xl" },
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`flex items-center justify-center rounded-full bg-primary/20 ${sizes[size].icon}`}
      >
        <Home className={`${sizes[size].icon} text-primary`} />
      </div>
      {showText && (
        <span className={`font-bold text-primary ${sizes[size].text}`}>
          RentEase
        </span>
      )}
    </div>
  );
};

export default Logo;

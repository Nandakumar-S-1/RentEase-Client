import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "./Button";
import { PAGE_ROUTES } from "../../config/routes";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#0f1115] px-6 text-center">
      <div className="relative mb-12 animate-bounce">
        <div className="text-[12rem] font-black text-gray-100 dark:text-white/5 select-none leading-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-primary/10 dark:bg-primary/20 backdrop-blur-md p-8 rounded-full border border-primary/20 shadow-2xl">
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-primary text-white shadow-lg">
              <Home size={40} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          Lost in the city?
        </h1>
        <p className="text-lg text-muted-foreground">
          We couldn't find the page you're looking for. It might have been moved
          or doesn't exist.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-12 w-full max-w-xs sm:max-w-none justify-center">
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          icon={<ArrowLeft size={18} />}
        >
          Go Back
        </Button>
        <Button
          variant="primary"
          onClick={() => navigate(PAGE_ROUTES.DASHBOARD)}
          icon={<Home size={18} />}
        >
          Back to Dashboard
        </Button>
      </div>

      <div className="mt-20 flex items-center gap-2 text-muted-foreground/40 text-sm font-medium tracking-widest uppercase">
        <div className="w-8 h-px bg-muted-foreground/20" />
        RentEase Navigation
        <div className="w-8 h-px bg-muted-foreground/20" />
      </div>
    </div>
  );
};

export default NotFound;

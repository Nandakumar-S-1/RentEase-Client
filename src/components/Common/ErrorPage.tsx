import React from "react";
import { AlertTriangle, RefreshCcw, Bell } from "lucide-react";
import { Button } from "./Button";

interface ErrorPageProps {
  code?: number;
  message?: string;
  onRetry?: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({
  code = 502,
  message = "Bad Gateway: The server is currently unable to handle this request.",
  onRetry = () => window.location.reload(),
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-danger/5 dark:bg-danger/10 px-6 text-center">
      <div className="relative mb-8 animate-pulse">
        <div className="text-[12rem] font-black text-danger/10 dark:text-danger/20 select-none leading-none tracking-tighter">
          {code}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white dark:bg-card p-6 rounded-3xl border-2 border-danger/20 shadow-2xl">
            <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-danger text-white shadow-xl rotate-12">
              <AlertTriangle size={32} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md space-y-3">
        <h1 className="text-3xl font-bold text-foreground">
          Something went wrong
        </h1>
        <p className="text-muted-foreground">
          {message}
          <br />
          Please try again in a few moments.
        </p>
      </div>

      <div className="flex gap-4 mt-12">
        <Button
          variant="secondary"
          onClick={() => window.history.back()}
          className="border-danger/30 text-danger hover:bg-danger/5"
        >
          Go Back
        </Button>
        <Button
          variant="primary"
          onClick={onRetry}
          icon={<RefreshCcw size={18} />}
          className="bg-danger hover:bg-danger/90 shadow-danger/20"
        >
          Retry Connection
        </Button>
      </div>

      <div className="mt-16 flex items-center gap-4 p-4 bg-white dark:bg-card rounded-2xl border border-border shadow-sm">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Bell size={20} />
        </div>
        <p className="text-xs text-muted-foreground text-left max-w-[200px]">
          We've notified our engineering team. You can also check our status
          page for updates.
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;

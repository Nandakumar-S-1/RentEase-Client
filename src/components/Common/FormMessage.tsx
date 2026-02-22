import { AlertCircle, CheckCircle } from "lucide-react";
import type { FormMessageProps } from "../../Interfaces/FormMessageProps";

export const FormMessage: React.FC<FormMessageProps> = ({
  message,
  isError = false,
  onClose,
}) => {
  if (!message) return null;

  return (
    <div
      className={`mb-4 flex items-center gap-2 rounded-lg p-3 text-sm font-medium ${
        isError
          ? 'bg-red-50 text-red-700'
          : 'bg-green-50 text-green-700'
      }`}
    >
      {isError ? (
        <AlertCircle className="h-4 w-4 shrink-0" />
      ) : (
        <CheckCircle className="h-4 w-4 shrink-0" />
      )}
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto text-lg leading-none opacity-70 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  );
};
import React from "react";
import type { InputProps } from "../../Interfaces/InputProps";

export const Input = React.forwardRef<HTMLInputElement,InputProps>(
    (
        {
            name,
            type='text',
            placeholder,
            value,
            onChange,
            icon,
            label,
            required=false,
            disabled=false
        },
        ref
    )=>{
        return(
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-card-foreground">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            name={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={`w-full py-2 rounded-lg border border-gray-200 focus:border-primary focus:outline-none transition ${
              icon ? 'pl-10 pr-4' : 'px-4'
            } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
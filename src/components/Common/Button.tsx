import React from 'react'
import type { ButtonProps } from '../../Interfaces/ButtonProps'

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      onClick,
      type = 'button',
      disabled = false,
      loading = false,
      variant = 'primary',
      size = 'md',
      className = '',
      icon,
      iconPosition = 'left'
    },
    ref
  ) => {
    const variantStyles = {
      primary:
        'bg-primary text-white hover:bg-primary/90 disabled:opacity-50',
      secondary:
        'bg-secondary text-secondary-foreground hover:bg-secondary/90',
      outline:
        'border border-primary text-primary hover:bg-primary/5',
    }

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }

    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`
          flex items-center justify-center gap-2
          rounded-lg font-medium transition
          disabled:cursor-not-allowed
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${className}
        `}
      >
        {loading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            {children}
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            {children}
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
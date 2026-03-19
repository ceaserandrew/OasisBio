import React, { useState, useEffect } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
  validate?: (value: string) => string | null;
  debounce?: number;
}

export function Input({
  type = 'text',
  className = '',
  error: externalError = false,
  errorMessage: externalErrorMessage,
  validate,
  debounce = 300,
  onBlur,
  value,
  ...props
}: InputProps) {
  const [internalError, setInternalError] = useState<string | null>(null);

  const error = externalError || !!internalError;
  const errorMessage = externalErrorMessage || internalError;

  useEffect(() => {
    if (validate && value !== undefined) {
      const timer = setTimeout(() => {
        const validationError = validate(String(value));
        setInternalError(validationError);
      }, debounce);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [value, validate, debounce]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (validate && value !== undefined) {
      const validationError = validate(String(value));
      setInternalError(validationError);
    }
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <div className="w-full">
      <input
        type={type}
        onBlur={handleBlur}
        className={`
          w-full px-3 py-2 border rounded-md bg-background text-foreground
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${error ? 'border-error focus:ring-error' : 'border-border focus:ring-ring'}
          ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        value={value}
        {...props}
      />
      {error && errorMessage && (
        <p className="mt-1 text-sm text-error">{errorMessage}</p>
      )}
    </div>
  );
}

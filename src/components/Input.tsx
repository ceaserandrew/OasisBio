import React, { useState, useEffect } from 'react';

export interface InputProps {
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  min?: string;
  max?: string;
  step?: string;
  error?: boolean;
  errorMessage?: string;
  validate?: (value: string) => string | null;
  debounce?: number;
}

export function Input({
  id,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  className = '',
  disabled = false,
  required = false,
  min,
  max,
  step,
  error: externalError = false,
  errorMessage: externalErrorMessage,
  validate,
  debounce = 300,
}: InputProps) {
  const [internalError, setInternalError] = useState<string | null>(null);

  const error = externalError || !!internalError;
  const errorMessage = externalErrorMessage || internalError;

  useEffect(() => {
    if (validate && value !== undefined) {
      const timer = setTimeout(() => {
        const validationError = validate(value);
        setInternalError(validationError);
      }, debounce);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [value, validate, debounce]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (validate && value !== undefined) {
      const validationError = validate(value);
      setInternalError(validationError);
    }
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <div className="w-full">
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        className={`
          w-full px-3 py-2 border rounded-md bg-background text-foreground
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${error ? 'border-error focus:ring-error' : 'border-border focus:ring-ring'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        disabled={disabled}
        required={required}
        min={min}
        max={max}
        step={step}
      />
      {error && errorMessage && (
        <p className="mt-1 text-sm text-error">{errorMessage}</p>
      )}
    </div>
  );
}

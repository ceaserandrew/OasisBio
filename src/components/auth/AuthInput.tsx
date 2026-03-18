'use client';

import React, { InputHTMLAttributes } from 'react';
import { Input } from '@/components/Input';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function AuthInput({ label, error, id, ...props }: AuthInputProps) {
  const errorId = id ? `${id}-error` : undefined;
  
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium transform transition-all duration-300">
        {label}
      </label>
      <Input
        id={id}
        {...props}
        aria-describedby={errorId}
        aria-invalid={!!error}
        className={`transform transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-primary ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
      />
      {error && (
        <p id={errorId} className="text-sm text-red-600 transform transition-all duration-300 animate-fadeIn" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}

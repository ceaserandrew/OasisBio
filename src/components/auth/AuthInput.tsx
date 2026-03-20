'use client';

import React, { InputHTMLAttributes, useState } from 'react';
import { Input } from '@/components/Input';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function AuthInput({ label, error, id, ...props }: AuthInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const errorId = id ? `${id}-error` : undefined;
  
  return (
    <div className="space-y-1 relative">
      <label 
        htmlFor={id} 
        className={`block text-sm font-medium transform transition-all duration-300 ${isFocused || props.value ? 'text-primary -translate-y-6 scale-75' : ''} ${error ? 'text-red-600' : ''}`}
      >
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          {...props}
          aria-describedby={errorId}
          aria-invalid={!!error}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`transform transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-primary border-gray-300 ${error ? 'border-red-500 focus:ring-red-500' : ''} ${isFocused || props.value ? 'pt-6' : 'pt-2'}`}
        />
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 transform transition-all duration-300 ${isFocused ? 'bg-primary scale-x-100' : 'bg-gray-300 scale-x-0'}`}></div>
      </div>
      {error && (
        <p id={errorId} className="text-sm text-red-600 transform transition-all duration-300 animate-fadeIn" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}

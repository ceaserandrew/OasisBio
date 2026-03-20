'use client';

import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button } from '@/components/Button';
import { Loader2 } from 'lucide-react';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  variant?: 'primary' | 'outline';
  fullWidth?: boolean;
}

export function AuthButton({
  children,
  isLoading = false,
  variant = 'primary',
  fullWidth = false,
  disabled,
  ...props
}: AuthButtonProps) {
  return (
    <Button
      variant={variant}
      className={`${fullWidth ? 'w-full' : ''} transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group`}
      disabled={isLoading || disabled}
      aria-busy={isLoading}
      {...props}
    >
      <span className="transform transition-all duration-300 flex items-center justify-center gap-2">
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin" />
        )}
        {isLoading ? 'Processing...' : children}
      </span>
      <div className="absolute inset-0 bg-white opacity-20 transform scale-x-0 transition-transform duration-300 origin-left group-hover:scale-x-100"></div>
    </Button>
  );
}

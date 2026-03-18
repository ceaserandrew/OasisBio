'use client';

import React, { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button } from '@/components/Button';

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
      className={`${fullWidth ? 'w-full' : ''} transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]`}
      disabled={isLoading || disabled}
      aria-busy={isLoading}
      {...props}
    >
      <span className="transform transition-all duration-300">
        {isLoading ? 'Processing...' : children}
      </span>
    </Button>
  );
}

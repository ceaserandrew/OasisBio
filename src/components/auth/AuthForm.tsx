'use client';

import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';

interface AuthFormProps {
  title: string;
  children: ReactNode;
  error?: string;
  success?: string;
}

export function AuthForm({ title, children, error, success }: AuthFormProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" role="main" aria-labelledby="auth-form-title">
      <Card className="w-full max-w-md transform transition-all duration-300 ease-in-out hover:shadow-lg" role="form" aria-describedby={error ? "auth-error" : success ? "auth-success" : undefined}>
        <CardHeader>
          <CardTitle id="auth-form-title" className="text-2xl transform transition-all duration-300">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div id="auth-error" className="mb-4 p-3 bg-red-50 text-red-600 rounded-md transform transition-all duration-300 animate-fadeIn" role="alert" aria-live="assertive">
              {error}
            </div>
          )}
          {success && (
            <div id="auth-success" className="mb-4 p-3 bg-green-50 text-green-600 rounded-md transform transition-all duration-300 animate-fadeIn" role="status" aria-live="polite">
              {success}
            </div>
          )}
          <div className="transform transition-all duration-300">
            {children}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

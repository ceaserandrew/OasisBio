'use client';

import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { QuoteDisplay } from './QuoteDisplay';

interface AuthFormProps {
  title: string;
  children: ReactNode;
  error?: string;
  success?: string;
}

export function AuthForm({ title, children, error, success }: AuthFormProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row" role="main" aria-labelledby="auth-form-title">
      {/* 左侧：操作区域 */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 bg-white">
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
      
      {/* 右侧：名言展示区域 */}
      <div className="w-full md:w-1/2 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200">
        <QuoteDisplay />
      </div>
    </div>
  );
}

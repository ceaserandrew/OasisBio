'use client';

import React from 'react';
import { AuthButton } from './AuthButton';
import supabase from '@/lib/supabase';

export function OAuthButtons() {
  const handleOAuthSignIn = (provider: string) => {
    supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <>
      <div className="my-4 flex items-center justify-center">
        <div className="flex-grow h-px bg-gray-300 transform transition-all duration-300"></div>
        <span className="mx-4 text-sm text-gray-500 transform transition-all duration-300">or</span>
        <div className="flex-grow h-px bg-gray-300 transform transition-all duration-300"></div>
      </div>
      
      <div className="space-y-2">
        <AuthButton 
          variant="outline" 
          fullWidth
          onClick={() => handleOAuthSignIn('google')}
          className="flex items-center justify-center gap-2 transform transition-all duration-300 hover:bg-gray-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-all duration-300">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" fill="#4285F4"/>
            <path d="M12 18.25c2.48 0 4.5-2.02 4.5-4.5s-2.02-4.5-4.5-4.5c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5zm0-7c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5z" fill="#34A853"/>
            <path d="M5.5 8.08a7.04 7.04 0 0 1 .5-2.5A2.78 2.78 0 0 1 7.44 4c.97 0 1.94.3 2.56.8v1.29H7.42C6.88 6.6 6.31 6.3 5.5 6.3V8.08z" fill="#FBBC05"/>
            <path d="M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0 2c-2.48 0-4.5-2.02-4.5-4.5s2.02-4.5 4.5-4.5c2.48 0 4.5 2.02 4.5 4.5s-2.02 4.5-4.5 4.5z" fill="#EA4335" opacity=".8"/>
          </svg>
          <span className="transform transition-all duration-300">Sign in with Google</span>
        </AuthButton>
        <AuthButton 
          variant="outline" 
          fullWidth
          onClick={() => handleOAuthSignIn('github')}
          className="flex items-center justify-center gap-2 transform transition-all duration-300 hover:bg-gray-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-all duration-300">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.225 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" fill="#24292e"/>
          </svg>
          <span className="transform transition-all duration-300">Sign in with GitHub</span>
        </AuthButton>
      </div>
    </>
  );
}
